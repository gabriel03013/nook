import { Global, Module } from '@nestjs/common';

import { ConfigService } from './config.service';

/**
 * Loads and validates environment variables once at boot.
 *
 * Marked `@Global()` so any module/service can inject `ConfigService`
 * without having to import `ConfigModule` in every feature module.
 * Config is a cross-cutting concern — making it global is correct here.
 */
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
