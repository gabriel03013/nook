import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Root module of the Nook API.
// Domain modules (Auth, User, Post, Comment, etc) will be
// added here as they are implemented.
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
