import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CarrierError } from '../../common/errors/carrier-error';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UpsAuthService {
  private readonly logger = new Logger(UpsAuthService.name);
  private readonly CARRIER_ID = 'UPS';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async getToken(): Promise<string> {
    const existing = await this.prisma.authToken.findUnique({
      where: { carrier: this.CARRIER_ID },
    });

    if (existing && existing.expiresAt > new Date(Date.now() + 60000)) {
      // Return if valid and not expiring in the next 60 seconds
      return existing.accessToken;
    }

    return this.refreshToken();
  }

  private async refreshToken(): Promise<string> {
    this.logger.debug('Refreshing UPS OAuth token...');
    const clientId = this.configService.get<string>('UPS_CLIENT_ID');
    const clientSecret = this.configService.get<string>('UPS_CLIENT_SECRET');
    const baseUrl = this.configService.get<string>('UPS_BASE_URL');

    if (!clientId || !clientSecret || !baseUrl) {
      throw new CarrierError(this.CARRIER_ID, 'AUTH_FAILED', 'Missing UPS credentials in configuration');
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${baseUrl}/security/v1/oauth/token`,
          new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${credentials}`,
            },
            timeout: 10000,
          },
        ),
      );

      const token = response.data.access_token;
      const expiresInSeconds = parseInt(response.data.expires_in, 10);
      
      const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

      await this.prisma.authToken.upsert({
        where: { carrier: this.CARRIER_ID },
        update: {
          accessToken: token,
          expiresAt,
        },
        create: {
          carrier: this.CARRIER_ID,
          accessToken: token,
          expiresAt,
        },
      });

      return token;
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        throw new CarrierError(this.CARRIER_ID, 'AUTH_FAILED', 'Invalid UPS credentials', status, error.response?.data);
      }
      if (status === 429) {
        throw new CarrierError(this.CARRIER_ID, 'RATE_LIMITED', 'UPS API rate limited', status, error.response?.data);
      }
      if (error.code === 'ECONNABORTED') {
        throw new CarrierError(this.CARRIER_ID, 'TIMEOUT', 'UPS auth request timed out');
      }
      
      this.logger.error(`UPS Auth failed: ${error.message}`, error.stack);
      throw new CarrierError(this.CARRIER_ID, 'SERVER_ERROR', 'Failed to get UPS token', status, error.response?.data);
    }
  }
}
