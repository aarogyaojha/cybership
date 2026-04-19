import { Module } from '@nestjs/common';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';
import { UpsModule } from '../carriers/ups/ups.module';
import { UpsAdapter } from '../carriers/ups/ups.adapter';
import { MockAdapter } from '../carriers/mock/mock.adapter';
import { MockRatesService } from '../carriers/mock/mock-rates.service';
import { CARRIERS } from '../carriers/carrier.interface';
import { AuditLogService } from '../common/services/audit-log.service';

@Module({
  imports: [UpsModule],
  controllers: [RatesController],
  providers: [
    RatesService,
    AuditLogService,
    MockRatesService,
    MockAdapter,
    {
      provide: CARRIERS,
      useFactory: (ups: UpsAdapter, mock: MockAdapter) => [ups, mock],
      inject: [UpsAdapter, MockAdapter],
    },
  ],
})
export class RatesModule {}

