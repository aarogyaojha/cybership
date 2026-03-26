import { Module, MiddlewareConsumer } from '@nestjs/common';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';
import { SessionMiddleware } from '../session/session.middleware';
import { UpsModule } from '../carriers/ups/ups.module';

@Module({
  imports: [UpsModule],
  controllers: [RatesController],
  providers: [RatesService],
})
export class RatesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .forRoutes(RatesController);
  }
}
