import { Module } from '@nestjs/common';
import { ChzzkVideoService } from './service/chzzk.video.service';
import { ChzzkController } from './controller/chzzk.controller';

@Module({
  imports: [],
  controllers: [ChzzkController],
  providers: [ChzzkVideoService],
})
export class ChzzkModule {}
