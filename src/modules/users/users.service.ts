import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';
import { EmailStatusType, EmailStatuses } from './dto/email-status.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(StudentOrganisations)
    private studentOrganisationsRepository: Repository<StudentOrganisations>,
  ) {}

  async find(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async findByEmailOrCreate(email: string): Promise<Users | null> {
    let user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      user = this.usersRepository.create({ email });
      await this.usersRepository.save(user);
    } 

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async getEmailStatus(email: string): Promise<EmailStatusType> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      return {
        status: EmailStatuses.USER,
      }
    }
    const studentOrganisation = await this.studentOrganisationsRepository.findOneBy({ email });
    if (studentOrganisation) {
      return {
        status: EmailStatuses.ORGANISATION,
      }
    }

    return {
      status: EmailStatuses.NONE,
    }
  }
}
