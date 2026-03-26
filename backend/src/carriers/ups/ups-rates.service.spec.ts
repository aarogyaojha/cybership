import { Test, TestingModule } from '@nestjs/testing';
import { UpsRatesService } from './ups-rates.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UpsAuthService } from './ups-auth.service';
import { of, throwError } from 'rxjs';

describe('UpsRatesService', () => {
  let service: UpsRatesService;
  let http: jest.Mocked<HttpService>;
  let auth: jest.Mocked<UpsAuthService>;

  beforeEach(async () => {
    http = { post: jest.fn() } as any;
    auth = { getToken: jest.fn().mockResolvedValue('mock_token') } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpsRatesService,
        { provide: HttpService, useValue: http },
        { provide: ConfigService, useValue: { get: () => 'mock' } },
        { provide: UpsAuthService, useValue: auth },
      ],
    }).compile();

    service = module.get(UpsRatesService);
  });

  it('UPS request payload built correctly from domain RateRequest', async () => {
    const mockRequest: any = { id: '123-456', originZip: '11111', destZip: '22222', weightLbs: 10 };
    http.post.mockReturnValue(of({ data: { RateResponse: { RatedShipment: [] } } }) as any);

    await service.getRates(mockRequest).catch(() => {});
    const callArgs = http.post.mock.calls[0];
    const url = callArgs[0];
    const payload = callArgs[1] as any;
    const config = callArgs[2] as any;

    expect(url).toContain('v2409/Shoptimeintransit');
    expect(config.headers.transId).toBe('123456');
    expect(payload.RateRequest.Request.TransactionReference.CustomerContext).toBe('123456');
    expect(payload.RateRequest.Shipment.Shipper.Address.PostalCode).toBe('11111');
    expect(payload.RateRequest.Shipment.ShipTo.Address.PostalCode).toBe('22222');
  });

  const validRequest: any = { id: '123', originZip: '11111', destZip: '22222', weightLbs: 10 };

  it('UPS response parsed into normalized RateQuote[]', async () => {
    const mockResponse = {
      RateResponse: {
        RatedShipment: [
          { Service: { Code: '03' }, TotalCharges: { MonetaryValue: '12.50', CurrencyCode: 'USD' } }
        ]
      }
    };
    http.post.mockReturnValue(of({ data: mockResponse }) as any);

    const quotes = await service.getRates(validRequest);
    expect(quotes).toHaveLength(1);
    expect(quotes[0].serviceCode).toBe('03');
    expect(quotes[0].totalCharge).toBe(12.50);
  });

  it('429 → CarrierError { code: "RATE_LIMITED" }', async () => {
    http.post.mockReturnValue(throwError(() => ({ response: { status: 429 } })) as any);
    await expect(service.getRates(validRequest)).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('500 → CarrierError { code: "SERVER_ERROR" }', async () => {
    http.post.mockReturnValue(throwError(() => ({ response: { status: 500 } })) as any);
    await expect(service.getRates(validRequest)).rejects.toMatchObject({ code: 'SERVER_ERROR' });
  });

  it('Missing originZip → CarrierError { code: "VALIDATION_ERROR" }', async () => {
    await expect(service.getRates({ ...validRequest, originZip: '' } as any)).rejects.toMatchObject({ code: 'VALIDATION_ERROR', message: /origin/ });
  });

  it('Zero weight → CarrierError { code: "VALIDATION_ERROR" }', async () => {
    await expect(service.getRates({ ...validRequest, weightLbs: 0 } as any)).rejects.toMatchObject({ code: 'VALIDATION_ERROR', message: /weight/ });
  });

  it('Malformed JSON → CarrierError { code: "PARSE_ERROR" }', async () => {
    http.post.mockReturnValue(of({ data: { RateResponse: "invalid" } }) as any);
    await expect(service.getRates(validRequest)).rejects.toMatchObject({ code: 'PARSE_ERROR' });
  });

  it('UPS response with multiple service levels should return all quotes', async () => {
    const mockResponse = {
      RateResponse: {
        RatedShipment: [
          { Service: { Code: '01' }, TotalCharges: { MonetaryValue: '50.00', CurrencyCode: 'USD' } },
          { Service: { Code: '03' }, TotalCharges: { MonetaryValue: '15.00', CurrencyCode: 'USD' } }
        ]
      }
    };
    http.post.mockReturnValue(of({ data: mockResponse }) as any);

    const quotes = await service.getRates(validRequest);
    expect(quotes).toHaveLength(2);
    expect(quotes.some(q => q.serviceCode === '01')).toBeTruthy();
    expect(quotes.some(q => q.serviceCode === '03')).toBeTruthy();
  });

  it('UPS transit time should be parsed if present in GuaranteedDelivery', async () => {
    const mockResponse = {
      RateResponse: {
        RatedShipment: [
          { 
            Service: { Code: '03' }, 
            TotalCharges: { MonetaryValue: '12.50', CurrencyCode: 'USD' },
            GuaranteedDelivery: { BusinessDaysInTransit: '3' }
          }
        ]
      }
    };
    http.post.mockReturnValue(of({ data: mockResponse }) as any);

    const quotes = await service.getRates(validRequest);
    expect(quotes[0].estimatedDays).toBe(3);
  });
});
