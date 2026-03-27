import { RateRequest, RateQuote } from '@prisma/client';

export const CARRIERS = 'CARRIERS';

// Provider for calculating shipping rates
export interface IRateProvider {
  getRates(request: RateRequest): Promise<RateQuote[]>;
}

// Provider for fetching tracking info
export interface ITrackingProvider {
  getTracking(trackingId: string): Promise<any>;
}

// Provider for label generation
export interface ILabelProvider {
  createLabel(request: any): Promise<any>;
}

// Maps carrier ID to operations so we can easily bolt on things like tracking later
export interface ICarrier {
  readonly carrierId: string;
  readonly capabilities: {
    rates?: IRateProvider;
    tracking?: ITrackingProvider;
    labels?: ILabelProvider;
  };
}
