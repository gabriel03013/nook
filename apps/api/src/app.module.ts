import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { PrismaModule } from './infrastructure/prisma';

// Root module of the Nook API.
//
// ConfigModule and PrismaModule are global — domain modules don't need
// to re-import them. Domain modules (Auth, User, Post, Comment, etc) will
// be added under `modules/` as they are implemented.
@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
