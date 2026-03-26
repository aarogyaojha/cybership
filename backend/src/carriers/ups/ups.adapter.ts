import { Injectable } from '@nestjs/common';
import { ICarrier } from '../carrier.interface';
import { RateRequest, RateQuote } from '@prisma/client';
import { UpsRatesService } from './ups-rates.service';

@Injectable()
export class UpsAdapter implements ICarrier {
  readonly carrierId = 'UPS';

  constructor(private readonly upsRatesService: UpsRatesService) {}

  async getRates(request: RateRequest): Promise<RateQuote[]> {
    return this.upsRatesService.getRates(request);
  }
}
