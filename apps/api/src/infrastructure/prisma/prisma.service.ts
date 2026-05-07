import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@nook/database';

import { ConfigService } from '../../config';

/**
 * Singleton wrapper around Prisma Client.
 *
 * Extends `PrismaClient` directly so any service can inject `PrismaService`
 * and use it as if it were the client itself:
 *
 *   constructor(private readonly prisma: PrismaService) {}
 *   ...
 *   await this.prisma.user.findMany();
 *
 * Lifecycle is bound to Nest:
 * - `onModuleInit`  → opens the connection pool when the app starts
 * - `onModuleDestroy` → closes it gracefully on shutdown (SIGTERM/SIGINT)
 *
 * Important: `app.enableShutdownHooks()` must be called in main.ts for
 * `onModuleDestroy` to actually fire on signals.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService) {
    super({
      datasourceUrl: config.databaseUrl,

      // verbose logs in dev, quiet in prod
      log: config.isDevelopment
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'warn' },
            { emit: 'stdout', level: 'error' },
          ]
        : [
            { emit: 'stdout', level: 'warn' },
            { emit: 'stdout', level: 'error' },
          ],
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Connected to the database');
    } catch (err) {
      this.logger.error('Failed to connect to the database', err);
      throw err;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Disconnected from the database');
  }

  /**
   * Lightweight liveness probe — used by the /health endpoint.
   * Runs a trivial query that doesn't depend on any table existing.
   */
  async ping(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (err) {
      this.logger.warn(`Database ping failed: ${(err as Error).message}`);
      return false;
    }
  }
}
