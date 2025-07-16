import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChzzkModule } from './chzzk/chzzk.module';
import { AgodaModule } from './agoda/agoda.module';

@Module({
  imports: [ChzzkModule, AgodaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
