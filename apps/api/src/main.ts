import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ZodExceptionFilter } from './common';

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

  // All routes live under /api/v1.
  app.setGlobalPrefix('api/v1');

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Nook API listening on http://localhost:${port}/api/v1`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
