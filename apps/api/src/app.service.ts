import { Injectable } from '@nestjs/common';

import { PrismaService } from './infrastructure/prisma';

export interface HealthCheck {
  status: 'ok' | 'degraded';
  checks: {
    database: 'ok' | 'down';
  };
  timestamp: string;
}

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Aggregated health check used by the /health endpoint.
   *
   * Returns 'ok' only when every dependency is reachable. If anything
   * is down, the overall status flips to 'degraded' and the failing
   * components are listed in `checks`.
   *
   * The endpoint always returns HTTP 200 so probes can read the JSON;
   * orchestration platforms can decide what to do based on the body.
   */
  async getHealth(): Promise<HealthCheck> {
    const dbOk = await this.prisma.ping();

    return {
      status: dbOk ? 'ok' : 'degraded',
      checks: {
        database: dbOk ? 'ok' : 'down',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
