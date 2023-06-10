import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentOrganisations } from './student-organisations.entity';
import { In, Repository } from 'typeorm';
import { UpdateStudentOrganisationDto } from './dto/update-student-organisation.dto';
import { CreateStudentOrganisationDto } from './dto/create-student-organisation.dto';
import { FollowOrganisationDto } from './dto/follow-student-organisation.dto';
import { Users } from '../users/users.entity';
import { GetByIdsDto } from './dto/get-by-ids.dto';
import { SORequestStatuses } from './types/so-requests.statuses';
import { ListAllStudentOrganisationsDto } from './dto/list-all-student-organisations.dto';

@Injectable()
export class StudentOrganisationsService {
  constructor(
    @InjectRepository(StudentOrganisations)
    private studentOrganisationsRepository: Repository<StudentOrganisations>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async find(body: ListAllStudentOrganisationsDto): Promise<StudentOrganisations[]> {
    const { statuses } = body;
    const where: any = {};

    if (statuses) {
      where.status = In(statuses);
    }


    return this.studentOrganisationsRepository.find({
      where,
      relations: {
        events: true,
      },
    });
  }

  async findOne(id: number): Promise<StudentOrganisations | null> {
    return this.studentOrganisationsRepository.findOne({
      where: { 
        id,
      },
      relations: {
        events: true,
      },
    });
  }

  async findByIds(getByIdsDto: GetByIdsDto): Promise<StudentOrganisations[]> {
    return this.studentOrganisationsRepository.find({
      where: { 
        id: In(getByIdsDto.ids),
        status: SORequestStatuses.APPROVED,
      },
      relations: {
        events: true,
      },
    });
  }

  async create(createStudentOrganisationDto: CreateStudentOrganisationDto): Promise<StudentOrganisations> {
    const user = await this.usersRepository.findOneBy({ id: createStudentOrganisationDto.createdById });
    if (!user) {
      throw new BadRequestException('User with this id does not exist');
    }
    const emailTaken = await this.studentOrganisationsRepository.findOneBy({ email: createStudentOrganisationDto.email });
    if (emailTaken) {
      throw new BadRequestException('Student organisation with this email already exists');
    }
    const nameTaken = await this.studentOrganisationsRepository.findOneBy({ name: createStudentOrganisationDto.name });
    if (nameTaken) {
      throw new BadRequestException('Student organisation with this name already exists');
    }
    const newSO = this.studentOrganisationsRepository.create(createStudentOrganisationDto);
    if (!user.studentOrganisations) {
      user.studentOrganisations = new Array<StudentOrganisations>();
    }
    user.studentOrganisations.push(newSO);

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

  async moveToReview(id: number): Promise<StudentOrganisations> {
    const SO = await this.studentOrganisationsRepository.findOneBy({ id });
    if (!SO) {
      throw new NotFoundException('Student organisation not found');
    }
    SO.status = SORequestStatuses.ON_REVIEW;

    return this.studentOrganisationsRepository.save(SO);
  }

  async moveToRejected(id: number): Promise<StudentOrganisations> {
    const SO = await this.studentOrganisationsRepository.findOneBy({ id });
    if (!SO) {
      throw new NotFoundException('Student organisation not found');
    }
    SO.status = SORequestStatuses.REJECTED;

    return this.studentOrganisationsRepository.save(SO);
  }

  async moveToApproved(id: number): Promise<StudentOrganisations> {
    const SO = await this.studentOrganisationsRepository.findOneBy({ id });
    if (!SO) {
      throw new NotFoundException('Student organisation not found');
    }
    SO.status = SORequestStatuses.APPROVED;

    return this.studentOrganisationsRepository.save(SO);
  }

  async follow(followOrganisationDto: FollowOrganisationDto): Promise<void> {
    const { userId, organisationId } = followOrganisationDto;
    const organisation = await this.studentOrganisationsRepository.findOneBy({ id: organisationId });
    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isFollowed(organisationId)) {
      throw new BadRequestException('User already follows this organisation');
    }

    user.followOrganisation(organisationId);
    organisation.incrementFollowers();

    await this.studentOrganisationsRepository.save(organisation);
    await this.usersRepository.save(user);
  }

  async unfollow(followOrganisationDto: FollowOrganisationDto): Promise<void> {
    const { userId, organisationId } = followOrganisationDto;
    const organisation = await this.studentOrganisationsRepository.findOneBy({ id: organisationId });
    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.unFollowOrganisation(organisationId);
    organisation.decrementFollowers();

    await this.studentOrganisationsRepository.save(organisation);
    await this.usersRepository.save(user);
  }
}
