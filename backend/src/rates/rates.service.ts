import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsAdapter } from '../carriers/ups/ups.adapter';
import { RateRequestDto } from './dto/rate-request.dto';

@Injectable()
export class RatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upsAdapter: UpsAdapter,
  ) {}

  async getRates(dto: RateRequestDto, sessionId: string) {
    const request = await this.prisma.rateRequest.create({
      data: {
        sessionId,
        originZip: dto.originZip,
        destZip: dto.destZip,
        weightLbs: dto.weightLbs,
        lengthIn: dto.lengthIn,
        widthIn: dto.widthIn,
        heightIn: dto.heightIn,
        serviceCode: dto.serviceCode,
      },
    });

    const upsQuotes = await this.upsAdapter.getRates(request);
    
    if (upsQuotes.length > 0) {
      await this.prisma.rateQuote.createMany({
        data: upsQuotes.map(q => ({
          id: q.id,
          carrier: q.carrier,
          serviceCode: q.serviceCode,
          serviceLabel: q.serviceLabel,
          totalCharge: q.totalCharge,
          currency: q.currency,
          estimatedDays: q.estimatedDays,
          rateRequestId: request.id,
        })),
      });
    }

    return upsQuotes;
  }

  async getHistory(sessionId: string) {
    return this.prisma.rateRequest.findMany({
      where: { sessionId },
      include: {
        quotes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
