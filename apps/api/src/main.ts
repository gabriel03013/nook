import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Validation is done per-route via Zod schemas from @nook/shared.
  // We deliberately skip the global ValidationPipe (which depends on
  // class-validator) to keep a single source of truth for validation.

  // All routes live under /api/v1.
  app.setGlobalPrefix('api/v1');

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Nook API listening on http://localhost:${port}/api/v1`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start application:', err);
  process.exit(1);
});
