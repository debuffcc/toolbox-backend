import { Controller, Get, Param } from '@nestjs/common';
import { ChzzkVideoService } from '../service/chzzk.video.service';

@Controller('chzzk')
export class ChzzkController {
  constructor(private readonly videoService: ChzzkVideoService) {}

  @Get('videos/:videoNo')
  async getVideo(@Param('videoNo') videoNo: string) {
    return this.videoService.getVideo(videoNo);
  }
}
