import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UpsAuthService } from './ups-auth.service';
import { RateRequest, RateQuote } from '@prisma/client';
import { CarrierError } from '../../common/errors/carrier-error';
import { lastValueFrom } from 'rxjs';
import { randomUUID } from 'node:crypto';

const UPS_RATING_ENDPOINT = '/api/rating/v2409/Shoptimeintransit';
const UPS_RATING_TIMEOUT_MS = 15000;

// UPS service code mappings
const UPS_SERVICE_LABELS: Record<string, string> = {
  '01': 'UPS Next Day Air',
  '02': 'UPS 2nd Day Air',
  '03': 'UPS Ground',
  '07': 'UPS Worldwide Express',
  '08': 'UPS Worldwide Expedited',
  '11': 'UPS Standard',
  '12': 'UPS 3 Day Select',
  '13': 'UPS Next Day Air Saver',
  '14': 'UPS Next Day Air Early',
};

interface UpsRateResponse {
  RateResponse: {
    RatedShipment: Array<{
      Service: { Code: string };
      TotalCharges: { MonetaryValue: string; CurrencyCode: string };
      GuaranteedDelivery?: { BusinessDaysInTransit: string };
    }>;
  };
}

@Injectable()
export class UpsRatesService {
  private readonly logger = new Logger(UpsRatesService.name);
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly upsAuth: UpsAuthService,
  ) {}

  // Get shipping rates from UPS
  async getRates(request: RateRequest): Promise<RateQuote[]> {
    this.validateRequest(request);

    const token = await this.upsAuth.getToken();
    const baseUrl = this.configService.get<string>('UPS_BASE_URL');
    
    // Sanitize transId for UPS (strip hyphens to get 32 chars from UUID)
    const transId = (request?.id || randomUUID()).replace(/-/g, '').substring(0, 32);
    const payload = this.buildPayload(request, transId);

    try {
      const response = await lastValueFrom(
        this.httpService.post<UpsRateResponse>(`${baseUrl}${UPS_RATING_ENDPOINT}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            transId,
            transactionSrc: 'cybership',
          },
          timeout: UPS_RATING_TIMEOUT_MS,
        })
      );
      
      return this.parseResponse(response.data, request);
    } catch (error: any) {
      if (error instanceof CarrierError) {
        throw error;
      }
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        throw new CarrierError('UPS', 'AUTH_FAILED', 'Invalid token during rate request', status, error.response?.data);
      }
      if (status === 429) {
        throw new CarrierError('UPS', 'RATE_LIMITED', 'UPS rate limit exceeded', status, error.response?.data);
      }
      if (error.code === 'ECONNABORTED') {
         throw new CarrierError('UPS', 'TIMEOUT', 'UPS rating request timed out');
      }
      
      this.logger.error(`UPS Rating failed: ${error.message}`, error.stack);
      throw new CarrierError('UPS', 'SERVER_ERROR', 'Failed to get rates from UPS', status, error.response?.data);
    }
  }

  private validateRequest(request: RateRequest) {
    if (!request.originZip || request.originZip.length < 5) {
      throw new CarrierError('UPS', 'VALIDATION_ERROR', 'Invalid origin ZIP code');
    }
    if (!request.destZip || request.destZip.length < 5) {
      throw new CarrierError('UPS', 'VALIDATION_ERROR', 'Invalid destination ZIP code');
    }
    if (!request.weightLbs || request.weightLbs <= 0) {
      throw new CarrierError('UPS', 'VALIDATION_ERROR', 'Package weight must be greater than 0');
    }
  }

  private buildPayload(request: RateRequest, transId: string) {
    return {
      RateRequest: {
        Request: { TransactionReference: { CustomerContext: transId } },
        Shipment: {
          Shipper: {
            Address: { PostalCode: request.originZip, CountryCode: 'US' },
            ShipperNumber: this.configService.get('UPS_ACCOUNT_NUMBER'),
          },
          ShipTo: {
            Address: { PostalCode: request.destZip, CountryCode: 'US' },
          },
          ShipFrom: {
            Address: { PostalCode: request.originZip, CountryCode: 'US' },
          },
          Package: [
            {
              PackagingType: { Code: '02', Description: 'Package' },
              Dimensions: {
                UnitOfMeasurement: { Code: 'IN' },
                Length: (request.lengthIn || 1).toString(),
                Width: (request.widthIn || 1).toString(),
                Height: (request.heightIn || 1).toString(),
              },
              PackageWeight: {
                UnitOfMeasurement: { Code: 'LBS' },
                Weight: (request.weightLbs || 0).toString(),
              },
            },
          ],
        },
      },
    };
  }

  private parseResponse(data: UpsRateResponse, request: RateRequest): RateQuote[] {
    try {
      const services = data?.RateResponse?.RatedShipment || [];
      const serviceArray = Array.isArray(services) ? services : [services];
      const quotes: RateQuote[] = [];

      for (const svc of serviceArray) {
        if (!svc || !svc.Service || !svc.TotalCharges) continue;
        
        const serviceCode = svc.Service.Code || 'UNKNOWN';
        const serviceLabel = UPS_SERVICE_LABELS[serviceCode] || 'UPS Service';

        const charge = parseFloat(svc.TotalCharges.MonetaryValue || '0');
        const currency = svc.TotalCharges.CurrencyCode || 'USD';
        const daysRaw = svc.GuaranteedDelivery?.BusinessDaysInTransit;
        const days = daysRaw ? parseInt(daysRaw, 10) : null;

        quotes.push({
          id: randomUUID(),
          carrier: 'UPS',
          serviceCode,
          serviceLabel,
          totalCharge: charge,
          currency: currency,
          estimatedDays: (days !== null && !Number.isNaN(days)) ? days : null,
          rateRequestId: request.id,
        });
      }

      if (quotes.length === 0) {
        throw new Error('No services returned or malformed response');
      }

      return quotes;
    } catch (e: any) {
      throw new CarrierError('UPS', 'PARSE_ERROR', `Failed to parse UPS response: ${e.message}`, undefined, data);
    }
  }
}
