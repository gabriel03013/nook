import 'reflect-metadata';
// Load .env before anything else so ConfigService sees the variables.
// In production, env vars come from the runtime (k8s secrets, etc) and
// dotenv is a no-op when there's no .env file present.
import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ZodExceptionFilter } from './common';
import { ConfigService } from './config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Validation is done per-route via Zod schemas from @nook/shared.
  // We deliberately skip the global ValidationPipe (which depends on
  // class-validator) to keep a single source of truth for validation.
  //
  // The filter below catches BadRequestException raised by ZodValidationPipe
  // and shapes the response into a consistent JSON contract.
  app.useGlobalFilters(new ZodExceptionFilter());

  // Required for `OnModuleDestroy` to fire on SIGTERM/SIGINT — without
  // this, the Prisma connection would not be closed gracefully on shutdown.
  app.enableShutdownHooks();

  // All routes live under /api/v1.
  app.setGlobalPrefix('api/v1');

  // Pull the validated port out of ConfigService instead of reading
  // process.env directly — keeps a single source of truth for env vars.
  const config = app.get(ConfigService);
  const port = config.port;

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Nook API listening on http://localhost:${port}/api/v1`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
