import { Test, TestingModule } from '@nestjs/testing';
import { RatesService } from './rates/rates.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { UpsModule } from './carriers/ups/ups.module';
import { UpsRatesService } from './carriers/ups/ups-rates.service';
import { UpsAuthService } from './carriers/ups/ups-auth.service';
import { UpsAdapter } from './carriers/ups/ups.adapter';
import { CARRIERS } from './carriers/carrier.interface';
import { of, throwError } from 'rxjs';
import { CarrierError } from './common/errors/carrier-error';

describe('Rates Integration (End-to-End Logic)', () => {
  let service: RatesService;
  let http: jest.Mocked<HttpService>;
  let prisma: jest.Mocked<PrismaService>;
  let module: TestingModule;

  const mockConfig = {
    get: jest.fn((key: string) => {
      if (key === 'UPS_BASE_URL') return 'https://api.ups.com';
      if (key === 'UPS_CLIENT_ID') return 'cli_123';
      if (key === 'UPS_CLIENT_SECRET') return 'sec_456';
      if (key === 'UPS_ACCOUNT_NUMBER') return 'AC_999';
      return key;
    }),
  };

  beforeEach(async () => {
    http = { post: jest.fn() } as any;
    prisma = {
      authToken: { findUnique: jest.fn(), upsert: jest.fn() },
      rateRequest: { create: jest.fn() },
      rateQuote: { createMany: jest.fn() },
    } as any;

    module = await Test.createTestingModule({
      providers: [
        RatesService,
        UpsAdapter,
        UpsRatesService,
        UpsAuthService,
        { provide: HttpService, useValue: http },
        { provide: ConfigService, useValue: mockConfig },
        { provide: PrismaService, useValue: prisma },
        {
            provide: CARRIERS,
            useFactory: (ups: UpsAdapter) => [ups],
            inject: [UpsAdapter],
        },
      ],
    }).compile();

    service = module.get(RatesService);
  });

  it('Successful end-to-end rating flow with token acquisition', async () => {
    const sessionId = 'session_ok';
    const requestDto = { originZip: '11111', destZip: '22222', weightLbs: 5 };
    
    // 1. Mock DB showing NO existing token
    prisma.authToken.findUnique.mockResolvedValue(null);
    prisma.rateRequest.create.mockResolvedValue({ id: 'req_123', ...requestDto } as any);

    // 2. Mock UPS Token Response (Authentic format)
    http.post.mockImplementation((url) => {
      if (url.includes('/oauth/token')) {
        return of({ data: { access_token: 'valid_access_token', expires_in: '3600' } }) as any;
      }
      if (url.includes('/rating/v2409/Shoptimeintransit')) {
        return of({
          data: {
            RateResponse: {
              RatedShipment: [
                {
                  Service: { Code: '03' },
                  TotalCharges: { MonetaryValue: '18.50', CurrencyCode: 'USD' },
                  GuaranteedDelivery: { BusinessDaysInTransit: '4' }
                }
              ]
            }
          }
        }) as any;
      }
      return throwError(() => new Error('Unexpected URL'));
    });

    const results = await service.getRates(requestDto, sessionId);

    // Verify normalization
    expect(results).toHaveLength(1);
    expect(results[0].carrier).toBe('UPS');
    expect(results[0].totalCharge).toBe(18.50);
    expect(results[0].estimatedDays).toBe(4);

    // Verify token was saved
    expect(prisma.authToken.upsert).toHaveBeenCalled();
    // Verify results were persisted
    expect(prisma.rateQuote.createMany).toHaveBeenCalled();
  });

  it('Full chain retry on Refresh Token failure', async () => {
     const expired = new Date(Date.now() - 10000);
     prisma.authToken.findUnique.mockResolvedValue({ 
         accessToken: 'old', 
         refreshToken: 'ref_123', 
         expiresAt: expired 
     } as any);
     prisma.rateRequest.create.mockResolvedValue({ id: 'req_2', originZip: '11111', destZip: '22222', weightLbs: 10 } as any);

     http.post
        .mockReturnValueOnce(throwError(() => ({ response: { status: 401 } }))) // Refresh fails
        .mockReturnValueOnce(of({ data: { access_token: 'brand_new', expires_in: '3600' } }) as any) // Full login succeeds
        .mockReturnValueOnce(of({ data: { RateResponse: { RatedShipment: [] } } }) as any); // Rating fails later but login worked

     // We expect it to eventually fail parsing because we returned empty RatedShipment, but we want to see the 2 auth calls
     await service.getRates({ originZip: '11111', destZip: '22222', weightLbs: 10 }, 'sid').catch(() => {});
     
     expect(http.post).toHaveBeenCalledWith(expect.stringContaining('/refresh'), expect.anything(), expect.anything());
     expect(http.post).toHaveBeenCalledWith(expect.stringContaining('/token'), expect.anything(), expect.anything());
  });

  it('Propagates structured CarrierError for external Rate Limiting (429)', async () => {
      prisma.authToken.findUnique.mockResolvedValue({ accessToken: 'valid', expiresAt: new Date(Date.now() + 3600000) } as any);
      prisma.rateRequest.create.mockResolvedValue({ id: 'req_lim' } as any);
      
      http.post.mockReturnValue(throwError(() => ({ 
          response: { 
              status: 429,
              data: { errors: [{ code: '123', message: 'Rate Limit Exceeded' }] }
          } 
      })) as any);

      // Note: RatesService catches and logs, returning an empty array if all carriers fail
      // but if we want to test the raw adapter logic, we can also check the logs or use the adapter directly
      const adapter = module.get(UpsAdapter);
      await expect(adapter.capabilities.rates!.getRates({ originZip: '11111', destZip: '22222', weightLbs: 5 } as any))
        .rejects.toMatchObject({
            code: 'RATE_LIMITED',
            carrier: 'UPS',
            statusCode: 429
        });
  });

  it('Handles malformed JSON via PARSE_ERROR', async () => {
    prisma.authToken.findUnique.mockResolvedValue({ accessToken: 'valid', expiresAt: new Date(Date.now() + 3600000) } as any);
    http.post.mockReturnValue(of({ data: { Corrupt: 'Data' } }) as any);

    const adapter = module.get(UpsAdapter);
    await expect(adapter.capabilities.rates!.getRates({ originZip: '11111', destZip: '22222', weightLbs: 5 } as any))
      .rejects.toMatchObject({
          code: 'PARSE_ERROR'
      });
  });
});
