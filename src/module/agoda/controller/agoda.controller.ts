import { Controller, Query, Get } from '@nestjs/common';
import { AgodaService } from '../service/agoda.service';

@Controller('agoda')
export class AgodaController {
  constructor(private readonly agodaService: AgodaService) {}

  @Get('prices')
  async getPrices(
    @Query()
    query: {
      baseUrl: string;
      checkIn: string;
      los: number;
      rooms: number;
      children: number;
      adults: number;
    },
  ) {
    const { baseUrl, checkIn, los, rooms, children, adults } = query;
    return this.agodaService.getAgodaPrices(
      baseUrl,
      checkIn,
      los,
      rooms,
      children,
      adults,
    );
  }
}
