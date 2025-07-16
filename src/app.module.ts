import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChzzkModule } from './module/chzzk/chzzk.module';
import { AgodaModule } from './module/agoda/agoda.module';
import { CustomExceptionFilter } from './common/filter/exception-filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [ChzzkModule, AgodaModule],
  controllers: [AppController],
  providers: [{ provide: APP_FILTER, useClass: CustomExceptionFilter }],
})
export class AppModule {}
