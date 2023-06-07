import { Controller, Param, Get, NotFoundException, Post, Body, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { EventDetailsDto } from './dto/events-details.dto';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';


@ApiTags('route to manage student organisation entity')
@Controller('student-organisations')
export class EventsController {
  constructor(private readonly SOService: EventsService) {}

  @Get()
  @ApiCreatedResponse({ type: EventDetailsDto, isArray: true })
  async getAll(): Promise<EventDetailsDto[]> {
    const SOs = await this.SOService.find();

    return SOs.map(SO => SO.details);
  }

  @Get(':id')
  @ApiCreatedResponse({ type: EventDetailsDto })
  async getOne(@Param('id') id: number): Promise<EventDetailsDto> {
    const SO = await this.SOService.findOne(id);
    if (!SO) {
      throw new NotFoundException('Event not found');
    }
    return SO.details;
  }

  @Post('')
  async create(@Body() createEventDto: CreateEventDto): Promise<EventDetailsDto> {
    const SO = await this.SOService.create(createEventDto);

    return SO.details;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateEventDto: UpdateEventDto): Promise<EventDetailsDto> {
    const SO = await this.SOService.update(id, updateEventDto);

    return SO.details;
  }
}
