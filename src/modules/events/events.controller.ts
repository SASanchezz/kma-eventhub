import { Controller, Param, Get, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { EventDetailsDto } from './dto/events-details.dto';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { ListAllEventsDto } from './dto/list-all-events.dto';
import { ListSimilarEventsDto } from './dto/list-similar-events.dto';
import { LikeEventDto } from './dto/like-event.dto';
import { GetByIdsDto } from './dto/get-by-ids.dto';


@ApiTags('route to manage event entity')
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  @ApiCreatedResponse({ type: EventDetailsDto, isArray: true })
  async getAll(@Query() query: ListAllEventsDto): Promise<EventDetailsDto[]> {
    const events = await this.eventService.find(query);

    return events.map(event => event.details);
  }

  @Get('count')
  @ApiCreatedResponse({type: Number})
  async count(): Promise<number> {
    return await this.eventService.count();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: EventDetailsDto })
  async getOne(@Param('id') id: number): Promise<EventDetailsDto> {
    const event = await this.eventService.findOne(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event.details;
  }

  @Get('/similar/:id')
  @ApiCreatedResponse({ type: EventDetailsDto, isArray: true })
  async getSimilar(
    @Param('id') id: number,
    @Query() query: ListSimilarEventsDto
  ): Promise<EventDetailsDto[]> {
    const events = await this.eventService.findSimilar(id, query);

    return events.map(event => event.details);
  }

  @Post('get-by-ids')
  async findByIds(@Body() getByIdsDto: GetByIdsDto): Promise<EventDetailsDto[]> {
    const events = await this.eventService.findByIds(getByIdsDto);

    return events.map(event => event.details);
  }

  @Post('')
  async create(@Body() createEventDto: CreateEventDto): Promise<EventDetailsDto> {
    const event = await this.eventService.create(createEventDto);

    return event.details;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateEventDto: UpdateEventDto): Promise<EventDetailsDto> {
    const event = await this.eventService.update(id, updateEventDto);

    return event.details;
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.eventService.delete(id);
  }

  @Post('like')
  async likeEvent(@Body() likeEventDto: LikeEventDto): Promise<void> {
    await this.eventService.likeEvent(likeEventDto);
  }

  @Post('unlike')
  async unlikeEvent(@Body() likeEventDto: LikeEventDto): Promise<void> {
    await this.eventService.unlikeEvent(likeEventDto);
  }
}
