import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UpsModule } from './carriers/ups/ups.module';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UpsModule,
    RatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
