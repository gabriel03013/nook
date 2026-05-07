import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

/**
 * Global module that exposes a single `PrismaService` instance.
 *
 * Marked `@Global()` for the same reason as ConfigModule: every domain
 * module talks to the database, so requiring an explicit import in each
 * feature module would be pure ceremony.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
