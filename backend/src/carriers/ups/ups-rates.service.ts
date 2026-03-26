import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UpsAuthService } from './ups-auth.service';
import { RateRequest, RateQuote } from '@prisma/client';
import { CarrierError } from '../../common/errors/carrier-error';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UpsRatesService {
  private readonly logger = new Logger(UpsRatesService.name);
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly upsAuth: UpsAuthService,
  ) {}

  async getRates(request: RateRequest): Promise<RateQuote[]> {
    const token = await this.upsAuth.getToken();
    const baseUrl = this.configService.get<string>('UPS_BASE_URL');
    
    const payload = this.buildPayload(request);

    try {
      const response = await lastValueFrom(
        this.httpService.post(`${baseUrl}/api/rating/v1/Shop`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            transId: request.id,
            transactionSrc: 'cybership',
          },
          timeout: 15000,
        })
      );
      
      return this.parseResponse(response.data, request);
    } catch (error: any) {
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

  private buildPayload(request: RateRequest) {
    return {
      RateRequest: {
        Request: { TransactionReference: { CustomerContext: request.id } },
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
                Weight: request.weightLbs.toString(),
              },
            },
          ],
        },
      },
    };
  }

  private parseResponse(data: any, request: RateRequest): RateQuote[] {
    try {
      const services = data?.RateResponse?.RatedShipment || [];
      const serviceArray = Array.isArray(services) ? services : [services];
      const quotes: RateQuote[] = [];

      for (const svc of serviceArray) {
        if (!svc) continue;
        
        const serviceCode = svc.Service?.Code || 'UNKNOWN';
        let serviceLabel = 'UPS Service';
        if (serviceCode === '03') serviceLabel = 'UPS Ground';
        else if (serviceCode === '02') serviceLabel = 'UPS 2nd Day Air';
        else if (serviceCode === '01') serviceLabel = 'UPS Next Day Air';

        const charge = parseFloat(svc.TotalCharges?.MonetaryValue || '0');
        const currency = svc.TotalCharges?.CurrencyCode || 'USD';
        const daysRaw = svc.GuaranteedDelivery?.BusinessDaysInTransit;
        const days = daysRaw ? parseInt(daysRaw, 10) : null;

        quotes.push({
          id: uuidv4(),
          carrier: 'UPS',
          serviceCode,
          serviceLabel,
          totalCharge: charge,
          currency: currency,
          estimatedDays: Number.isNaN(days) ? null : days,
          rateRequestId: request.id,
        });
      }

      if (quotes.length === 0) {
        throw new Error('No services returned');
      }

      return quotes;
    } catch (e: any) {
      throw new CarrierError('UPS', 'PARSE_ERROR', 'Failed to parse UPS response', undefined, data);
    }
  }
}
