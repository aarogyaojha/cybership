import { Injectable } from '@nestjs/common';
import { RateRequest, RateQuote } from '@prisma/client';
import { IRateProvider } from '../carrier.interface';
import { randomUUID } from 'node:crypto';

@Injectable()
export class MockRatesService implements IRateProvider {
  async getRates(request: RateRequest): Promise<RateQuote[]> {
    // Artificial delay to simulate real API
    await new Promise((resolve) => setTimeout(resolve, 800));

    const baseCharge = 15 + Math.random() * 20 + (request.weightLbs || 1) * 2.5;

    // We generate a few mock services. If a specific serviceCode was requested,
    // we make sure at least one matches it to allow the UI to work.
    const mockServices = [
      { code: '03', label: 'Ground Performance (Mock)' },
      { code: '01', label: 'Next Day Dash (Mock)' },
      { code: '02', label: 'Standard Air (Mock)' },
      { code: 'DHL_XP', label: 'International Express (Mock)' },
    ];

    return mockServices.map(svc => ({
      id: randomUUID(),
      carrier: svc.code.startsWith('0') ? 'UPS Mock' : 'Global Mock',
      serviceCode: svc.code,
      serviceLabel: svc.label,
      totalCharge: parseFloat((baseCharge * (svc.code === '01' ? 2.5 : svc.code === '02' ? 1.8 : 1)).toFixed(2)),
      currency: 'USD',
      estimatedDays: svc.code === '01' ? 1 : svc.code === '02' ? 2 : 5,
      rateRequestId: request.id,
    }));
  }
}

