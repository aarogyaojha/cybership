import { Controller, Post, Get, Body } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RateRequestDto } from './dto/rate-request.dto';
import { SessionId } from '../session/session.decorator';

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Post()
  async getRates(@Body() dto: RateRequestDto, @SessionId() sessionId: string) {
    return this.ratesService.getRates(dto, sessionId);
  }

  @Get('history')
  async getHistory(@SessionId() sessionId: string) {
    return this.ratesService.getHistory(sessionId);
  }
}
