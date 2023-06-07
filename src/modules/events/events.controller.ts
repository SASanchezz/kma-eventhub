import { Controller, Param, Get, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { EventDetailsAndCountDto, EventDetailsDto } from './dto/events-details.dto';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { ListAllEventsDto } from './dto/list-all-events.dto';
import { ListSimilarEventsDto } from './dto/list-similar-events.dto';


@ApiTags('route to manage event entity')
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  @ApiCreatedResponse({ type: EventDetailsAndCountDto })
  async getAll(@Query() query: ListAllEventsDto): Promise<EventDetailsAndCountDto> {
    const result = await this.eventService.findAndCount(query);

    return {
      events: result[0].map(event => event.details),
      count: result[1],
    };
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
  @ApiCreatedResponse({ type: EventDetailsAndCountDto })
  async getSimilar(
    @Param('id') id: number,
    @Query() query: ListSimilarEventsDto
  ): Promise<EventDetailsAndCountDto> {
    const result = await this.eventService.findSimilar(id, query);

    return {
      events: result[0].map(event => event.details),
      count: result[1],
    };
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
}
