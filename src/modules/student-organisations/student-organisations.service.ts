import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentOrganisations } from './student-organisations.entity';
import { Repository } from 'typeorm';
import { UpdateStudentOrganisationDto } from './dto/update-student-organisation.dto';
import { CreateStudentOrganisationDto } from './dto/create-student-organisation.dto';

@Injectable()
export class StudentOrganisationsService {
  constructor(
    @InjectRepository(StudentOrganisations)
    private studentOrganisationsRepository: Repository<StudentOrganisations>,
  ) {}

  async find(): Promise<StudentOrganisations[]> {
    return this.studentOrganisationsRepository.find({
      relations: {
        followers: true,
        events: true,
      },
    });
  }

  async findOne(id: number): Promise<StudentOrganisations | null> {
    return this.studentOrganisationsRepository.findOne({
      where: { id },
      relations: {
        followers: true,
        events: true,
      },
    });
  }

  async create(createSODto: CreateStudentOrganisationDto): Promise<StudentOrganisations> {
    const emailTaken = await this.studentOrganisationsRepository.findOneBy({ email: createSODto.email });
    if (emailTaken) {
      throw new BadRequestException('Student organisation with this email already exists');
    }
    const nameTaken = await this.studentOrganisationsRepository.findOneBy({ name: createSODto.name });
    if (nameTaken) {
      throw new BadRequestException('Student organisation with this name already exists');
    }

    const newSO = this.studentOrganisationsRepository.create(createSODto);

    await this.studentOrganisationsRepository.save(newSO);

    return newSO;
  }

  async update(id: number, updateSODto: UpdateStudentOrganisationDto): Promise<StudentOrganisations> {
    const SO = await this.studentOrganisationsRepository.findOneBy({ id });
    if (!SO) {
      throw new NotFoundException('Student organisation not found');
    }

    if (updateSODto.email && updateSODto.email !== SO.email) {
      const emailTaken = await this.studentOrganisationsRepository.findOneBy({ email: updateSODto.email });
  
      if (emailTaken) {
        throw new BadRequestException('Email is already taken.');
      }
    }
    
    Object.assign(SO, updateSODto);

    return this.studentOrganisationsRepository.save(SO);
  }

}
