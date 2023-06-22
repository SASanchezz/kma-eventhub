import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Events } from './events.entity';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';
import { Users } from '../users/users.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let eventsRepository: Repository<Events>;
  let SORepository: Repository<StudentOrganisations>;
  let usersRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getRepositoryToken(Events), useClass: Repository },
        { provide: getRepositoryToken(StudentOrganisations), useClass: Repository },
        { provide: getRepositoryToken(Users), useClass: Repository },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventsRepository = module.get<Repository<Events>>(getRepositoryToken(Events));
    SORepository = module.get<Repository<StudentOrganisations>>(getRepositoryToken(StudentOrganisations));
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an event if it exists', async () => {
      const testEvent = new Events();
      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(testEvent);

      const foundEvent = await service.findOne(1);
      expect(foundEvent).toBe(testEvent);
    });

    it('should throw a NotFoundException if the event does not exist', async () => {
      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should return a new event', async () => {
      const testEvent = new Events();
      const createEventDto = { organisationId: 1 };

      jest.spyOn(SORepository, 'findOne').mockResolvedValueOnce(new StudentOrganisations());
      jest.spyOn(eventsRepository, 'create').mockReturnValue(testEvent);
      jest.spyOn(eventsRepository, 'save').mockResolvedValueOnce(testEvent);

      const newEvent = await service.create(createEventDto);

      expect(newEvent).toBe(testEvent);
    });

    it('should throw a NotFoundException if student organisation not found', async () => {
      const createEventDto = { organisationId: 1 };

      jest.spyOn(SORepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.create(createEventDto)).rejects.toThrow(NotFoundException);
    });
  });

  //... The above code

  describe('update', () => {
    it('should return an updated event', async () => {
      const testEvent = new Events();
      const updateEventDto = { title: 'updatedTitle' };

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(testEvent);
      jest.spyOn(eventsRepository, 'save').mockResolvedValueOnce(testEvent);

      const updatedEvent = await service.update(1, updateEventDto);

      expect(updatedEvent).toBe(testEvent);
    });

    it('should throw a NotFoundException if the event does not exist', async () => {
      const updateEventDto = { title: 'updatedTitle' };

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(1, updateEventDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the event', async () => {
      const testEvent = new Events();

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(testEvent);
      jest.spyOn(eventsRepository, 'remove').mockResolvedValueOnce(testEvent);

      await service.delete(1);

      expect(eventsRepository.remove).toHaveBeenCalledWith(testEvent);
    });

    it('should throw a NotFoundException if the event does not exist', async () => {
      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('likeEvent', () => {
    it('should add a like to the event', async () => {
      const testEvent = new Events();
      const testUser = new Users();
      testUser.addLikedEvent = jest.fn();
      const likeEventDto = { userId: 1, eventId: 1 };

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(testEvent);
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(testUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce(testUser);

      await service.likeEvent(likeEventDto);

      expect(testUser.addLikedEvent).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if the event does not exist', async () => {
      const likeEventDto = { userId: 1, eventId: 1 };

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.likeEvent(likeEventDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      const testEvent = new Events();
      const likeEventDto = { userId: 1, eventId: 1 };

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(testEvent);
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.likeEvent(likeEventDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('unlikeEvent', () => {
    it('should remove a like from the event', async () => {
      const testEvent = new Events();
      const testUser = new Users();
      testUser.removeLikedEvent = jest.fn();
      const likeEventDto = { userId: 1, eventId: 1 };

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(testEvent);
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(testUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce(testUser);

      await service.unlikeEvent(likeEventDto);

      expect(testUser.removeLikedEvent).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if the event does not exist', async () => {
      const likeEventDto = { userId: 1, eventId: 1 };

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.unlikeEvent(likeEventDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      const testEvent = new Events();
      const likeEventDto = { userId: 1, eventId: 1 };

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValueOnce(testEvent);
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.unlikeEvent(likeEventDto)).rejects.toThrow(NotFoundException);
    });
  });
});

