import { Module } from '@nestjs/common';
import { AgodaController } from './controller/agoda.controller';
import { AgodaService } from './service/agoda.service';

@Module({
  controllers: [AgodaController],
  providers: [AgodaService],
})
export class AgodaModule {}
