import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from "typeorm";
import { Events } from './events.entity';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';
import { Repository } from 'typeorm';
import { UpdateEventDto } from './dto/update-events.dto';
import { CreateEventDto } from './dto/create-events.dto';
import { GREATER, LOWER, ListAllEventsDto } from './dto/list-all-events.dto';
import { ListSimilarEventsDto } from './dto/list-similar-events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
    @InjectRepository(StudentOrganisations)
    private SORepository: Repository<StudentOrganisations>,
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
      skip: offset,
      take: limit,
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
      skip: offset,
      take: limit,
    });

    return [similarEvents, 200];
  }

  async findOne(id: number): Promise<Events | null> {
    return this.eventsRepository.findOneBy({ id });
  }

  async create(createEventDto: CreateEventDto): Promise<Events> {
    const SO = this.SORepository.findOneBy({ id: createEventDto.organisationId });
    if (!SO) {
      throw new NotFoundException('Student organisation by organisationId not found');
    } 

    const newEvent = this.eventsRepository.create(createEventDto);
    await this.eventsRepository.save(newEvent);

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

}
