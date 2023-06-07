import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from "typeorm";
import { Events } from './events.entity';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';
import { Users } from '../users/users.entity';
import { Repository } from 'typeorm';
import { UpdateEventDto } from './dto/update-events.dto';
import { CreateEventDto } from './dto/create-events.dto';
import { GREATER, LOWER, ListAllEventsDto } from './dto/list-all-events.dto';
import { ListSimilarEventsDto } from './dto/list-similar-events.dto';
import { LikeEventDto } from './dto/like-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
    @InjectRepository(StudentOrganisations)
    private SORepository: Repository<StudentOrganisations>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findAndCount(listAllEventsDto: ListAllEventsDto): Promise<[Events[], number]> {
    const { all, dateTime, dateTimeComparison, offset, limit } = listAllEventsDto;
    const where: any = {};

    if (all) {
      where.title = { $like: `%${all}%` };
      where.textPreview = { $like: `%${all}%` };
      where.tags = { $like: `%${all}%` };
    }

    if (dateTime && dateTimeComparison) {
      if (dateTimeComparison === GREATER) {
        where.dateTime = { $gt: dateTime };
      } else if (dateTimeComparison === LOWER) {
        where.dateTime = { $lt: dateTime };
      }
    }

    return this.eventsRepository.findAndCount({
      where,
      skip: offset ?? 0,
      take: limit ?? 10,
    });
  }

  async findSimilar(id: number, query: ListSimilarEventsDto): Promise<[Events[] | null, number]> {
    const event = await this.eventsRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const { tags, organisationId, dateTime } = event;
    const { offset, limit } = query;

    const similarEvents = await this.eventsRepository.find({
      where: [
        { tags: Like(`%${tags}%`) },
        { organisationId },
        { dateTime },
      ],
      order: { dateTime: 'DESC' },
      skip: offset ?? 0,
      take: limit ?? 10,
    });

    return [similarEvents, 200];
  }

  async findOne(id: number): Promise<Events | null> {
    return await this.eventsRepository.findOneBy({ id });
  }

  async create(createEventDto: CreateEventDto): Promise<Events> {
    const SO = await this.SORepository.findOneBy({ id: createEventDto.organisationId });
    if (!SO) {
      throw new NotFoundException('Student organisation by organisationId not found');
    }

    const newEvent = this.eventsRepository.create(createEventDto);
    await this.eventsRepository.save(newEvent);
    SO.addEvent(newEvent);

    return newEvent;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Events> {
    const event = await this.eventsRepository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    
    Object.assign(event, updateEventDto);

    return this.eventsRepository.save(event);
  }

  async delete(id: number): Promise<void> {
    const event = await this.eventsRepository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.eventsRepository.remove(event);
  }

  async likeEvent(likeEventDto: LikeEventDto): Promise<void> {
    const { userId, eventId } = likeEventDto;
    const event = await this.eventsRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isLiked(eventId)) {
      throw new BadRequestException('User already liked this event');
    }

    user.addLikedEvent(eventId);
    await this.usersRepository.save(user);
  }

  async unlikeEvent(likeEventDto: LikeEventDto): Promise<void> {
    const { userId, eventId } = likeEventDto;
    const event = await this.eventsRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.removeLikedEvent(eventId);
    await this.usersRepository.save(user);
  }

}
