import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UpsModule } from './carriers/ups/ups.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UpsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
