import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, IsNull, Like, MoreThan } from "typeorm";
import { Events } from './events.entity';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';
import { Users } from '../users/users.entity';
import { Repository } from 'typeorm';
import { UpdateEventDto } from './dto/update-events.dto';
import { CreateEventDto } from './dto/create-events.dto';
import { BoolValues, ListAllEventsDto } from './dto/list-all-events.dto';
import { ListSimilarEventsDto } from './dto/list-similar-events.dto';
import { LikeEventDto } from './dto/like-event.dto';
import { GetByIdsDto } from './dto/get-by-ids.dto';
import { AllFiltersListDto } from './dto/all-filters-list.dto';

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

  async find(listAllEventsDto: ListAllEventsDto): Promise<Events[]> {
    const { all, tags, isFree, format, studentOrganisationNames, dateTimeFrom, dateTimeTo, date, time, locations, offset, limit } = listAllEventsDto;
    const where: any = {};

    if (all) {
      const allLike = Like(`%${all}%`);
      where.textPreview = allLike;
    }

    if (studentOrganisationNames) {
      const studentOrganisation = await this.SORepository.findBy({ name: In(studentOrganisationNames) });
      const organisationIds = studentOrganisation.map(org => org.id);
      if (studentOrganisation) {
        where.organisationId = In(organisationIds);
      }
    }

    if (isFree) {
      where.price = isFree == BoolValues.TRUE ? 0 : MoreThan(0);
    }

    if (format) {
      where.format = format;
    }

    if (dateTimeFrom && dateTimeTo) {
      where.dateTime = Between(dateTimeFrom, dateTimeTo);
    }

    if (date) {
      where.dateTime = Like(`%${date}%`);
    }

    if (time) {
      where.dateTime = Like(`%${time}%`);
    }

    if (locations) {
      where.location = In(locations);
    }

    const events = await this.eventsRepository.find({
      where,
      skip: offset ?? 0,
      take: limit ?? 10,
    });

    let filteredEvents = events;
    if (tags) {
      filteredEvents = events.filter(event => {
        const eventTags = event.tags?.split(' ');
        return eventTags?.some(tag => tags.includes(tag));
      });
    }

    return filteredEvents;
  }

  async getAvaiableFilters(): Promise<AllFiltersListDto> {
    const tags = await this.eventsRepository.find({
      select: ['tags'],
    });
    const organisations = await this.SORepository.find({
      select: ['name'],
    });
    const locations = await this.eventsRepository.find({
      select: ['location'],
    });

    const unqiueTags = new Set<string>();
    tags.forEach(tag => {
      tag.tags?.split(' ')?.forEach(t => unqiueTags.add(t));
    });
    const uniqueOrganisations = new Set<string>();
    organisations.forEach(org => {
      uniqueOrganisations.add(org.name);
    });
    const uniqueLocations = new Set<string>();
    locations.forEach(loc => {
      uniqueLocations.add(loc.location);
    });


    return {
      tags: Array.from(unqiueTags),
      studentOrganisations: Array.from(uniqueOrganisations),
      locations: Array.from(uniqueLocations),
    };
  }

  async findSimilar(id: number, query: ListSimilarEventsDto): Promise<Events[]> {
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
    similarEvents.unshift(event);
    
    return similarEvents; 
  }

  async findOne(id: number): Promise<Events | null> {
    return await this.eventsRepository.findOneBy({ id });
  }

  async count(): Promise<number> {
    return this.eventsRepository.count();
  }

  async findByIds(getByIdsDto: GetByIdsDto): Promise<Events[]> {
    return this.eventsRepository.find({
      where: { 
        id: In(getByIdsDto.ids),
      },
    });
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
