import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UpsAuthService } from './ups-auth.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [UpsAuthService],
  exports: [UpsAuthService],
})
export class UpsModule {}
