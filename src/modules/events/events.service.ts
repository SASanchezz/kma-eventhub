import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from './events.entity';
import { Repository } from 'typeorm';
import { UpdateEventDto } from './dto/update-events.dto';
import { CreateEventDto } from './dto/create-events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
  ) {}

  async find(): Promise<Events[]> {
    return this.eventsRepository.find();
  }

  async findOne(id: number): Promise<Events | null> {
    return this.eventsRepository.findOneBy({ id });
  }

  async create(createSODto: CreateEventDto): Promise<Events> {
    const emailTaken = await this.eventsRepository.findOneBy({ email: createSODto.email });
    if (emailTaken) {
      throw new BadRequestException('Student organisation with this email already exists');
    }
    const nameTaken = await this.eventsRepository.findOneBy({ name: createSODto.name });
    if (nameTaken) {
      throw new BadRequestException('Student organisation with this name already exists');
    }

    const newSO = this.eventsRepository.create(createSODto);

    await this.eventsRepository.save(newSO);

    return newSO;
  }

  async update(id: number, updateSODto: UpdateEventDto): Promise<Events> {
    const SO = await this.eventsRepository.findOneBy({ id });
    if (!SO) {
      throw new NotFoundException('Student organisation not found');
    }

    if (updateSODto.email && updateSODto.email !== SO.email) {
      const emailTaken = await this.eventsRepository.findOneBy({ email: updateSODto.email });
  
      if (emailTaken) {
        throw new BadRequestException('Email is already taken.');
      }
    }
    
    Object.assign(SO, updateSODto);

    return this.eventsRepository.save(SO);
  }

}
