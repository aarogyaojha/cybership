import { Injectable } from '@nestjs/common';
import { ICarrier } from '../carrier.interface';
import { MockRatesService } from './mock-rates.service';

@Injectable()
export class MockAdapter implements ICarrier {
  readonly carrierId = 'MOCK';

  constructor(private readonly mockRates: MockRatesService) {}

  get capabilities() {
    return {
      rates: this.mockRates,
    };
  }
}
