import { RateRequest, RateQuote } from '@prisma/client';

export interface ICarrier {
  readonly carrierId: string;
  getRates(request: RateRequest): Promise<RateQuote[]>;
}
