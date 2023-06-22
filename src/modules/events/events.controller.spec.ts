import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { NotFoundException } from '@nestjs/common';
import { EventDetailsDto } from './dto/events-details.dto';
import { ListAllEventsDto } from './dto/list-all-events.dto';
import { ListSimilarEventsDto } from './dto/list-similar-events.dto';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { GetByIdsDto } from './dto/get-by-ids.dto';
import { LikeEventDto } from './dto/like-event.dto';
import { AllFiltersListDto } from './dto/all-filters-list.dto';

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            getAvaiableFilters: jest.fn().mockResolvedValue(new AllFiltersListDto()),
            count: jest.fn().mockResolvedValue(0),
            findOne: jest.fn().mockResolvedValue({ details: new EventDetailsDto() }),
            findSimilar: jest.fn().mockResolvedValue([]),
            findByIds: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockResolvedValue({ details: new EventDetailsDto() }),
            update: jest.fn().mockResolvedValue({ details: new EventDetailsDto() }),
            delete: jest.fn().mockResolvedValue(),
            likeEvent: jest.fn().mockResolvedValue(),
            unlikeEvent: jest.fn().mockResolvedValue(),
          },
        },
      ],
    }).compile();

    eventsController = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(eventsController).toBeDefined();
  });

  it('should return an array of events', async () => {
    expect(await eventsController.getAll(new ListAllEventsDto())).toBeInstanceOf(Array);
    expect(eventsService.find).toHaveBeenCalled();
  });

  it('should return an all available filters', async () => {
    expect(await eventsController.getAllFilters()).toBeInstanceOf(AllFiltersListDto);
    expect(eventsService.getAvaiableFilters).toHaveBeenCalled();
  });

  it('should return an event count', async () => {
    expect(await eventsController.count()).toBe(0);
    expect(eventsService.count).toHaveBeenCalled();
  });

  it('should return an event', async () => {
    expect(await eventsController.getOne(1)).toBeInstanceOf(EventDetailsDto);
    expect(eventsService.findOne).toHaveBeenCalled();
  });

  it('should return a list of similar events', async () => {
    expect(await eventsController.getSimilar(1, new ListSimilarEventsDto())).toBeInstanceOf(Array);
    expect(eventsService.findSimilar).toHaveBeenCalled();
  });

  it('should return an array of events by ids', async () => {
    expect(await eventsController.findByIds(new GetByIdsDto())).toBeInstanceOf(Array);
    expect(eventsService.findByIds).toHaveBeenCalled();
  });

  it('should create and return an event', async () => {
    expect(await eventsController.create(new CreateEventDto())).toBeInstanceOf(EventDetailsDto);
    expect(eventsService.create).toHaveBeenCalled();
  });

  it('should update and return an event', async () => {
    expect(await eventsController.update(1, new UpdateEventDto())).toBeInstanceOf(EventDetailsDto);
    expect(eventsService.update).toHaveBeenCalled();
  });

  it('should delete an event', async () => {
    await eventsController.delete(1);
    expect(eventsService.delete).toHaveBeenCalled();
  });

  it('should like an event', async () => {
    await eventsController.likeEvent(new LikeEventDto());
    expect(eventsService.likeEvent).toHaveBeenCalled();
  });

  it('should unlike an event', async () => {
    await eventsController.unlikeEvent(new LikeEventDto());
    expect(eventsService.unlikeEvent).toHaveBeenCalled();
  });

  it('should throw an exception when an event does not exist', async () => {
    jest.spyOn(eventsService, 'findOne').mockResolvedValue(undefined);

    await expect(eventsController.getOne(1)).rejects.toThrow(NotFoundException);
  });
});

