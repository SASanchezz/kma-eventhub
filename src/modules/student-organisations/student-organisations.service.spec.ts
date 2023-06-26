import { Test, TestingModule } from '@nestjs/testing';
import { StudentOrganisationsService } from './student-organisations.service';
import { In, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentOrganisations } from './student-organisations.entity';
import { Users } from '../users/users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateStudentOrganisationDto } from './dto/create-student-organisation.dto';
import { UpdateStudentOrganisationDto } from './dto/update-student-organisation.dto';
import { FollowOrganisationDto } from './dto/follow-student-organisation.dto';
import { GetByIdsDto } from './dto/get-by-ids.dto';
import { SORequestStatuses } from './types/so-requests.statuses';

describe('StudentOrganisationsService', () => {
  let service: StudentOrganisationsService;
  let studentOrganisationsRepository: Repository<StudentOrganisations>;
  let usersRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentOrganisationsService,
        {
          provide: getRepositoryToken(StudentOrganisations),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StudentOrganisationsService>(StudentOrganisationsService);
    studentOrganisationsRepository = module.get<Repository<StudentOrganisations>>(getRepositoryToken(StudentOrganisations));
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  describe('find', () => {
    it('should find student organisations with specified statuses', async () => {
      const listAllDto = { statuses: [SORequestStatuses.APPROVED, SORequestStatuses.REJECTED] };
      const expectedResult: any = [{ id: 1, name: 'StudentOrg1' }, { id: 2, name: 'StudentOrg2' }];
      jest.spyOn(studentOrganisationsRepository, 'find').mockResolvedValue(expectedResult);

      const result = await service.find(listAllDto);

      expect(result).toEqual(expectedResult);
      expect(studentOrganisationsRepository.find).toBeCalledWith({
        where: { status: In(listAllDto.statuses) },
        relations: { events: true },
      });
    });
  });

  describe('findOne', () => {
    it('should find a student organisation by ID', async () => {
      const expectedResult: any = { id: 1, name: 'StudentOrg1' };
      jest.spyOn(studentOrganisationsRepository, 'findOne').mockResolvedValue(expectedResult);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedResult);
      expect(studentOrganisationsRepository.findOne).toBeCalledWith({
        where: { id: 1 },
        relations: { events: true },
      });
    });

    it('should return null if student organisation is not found', async () => {
      jest.spyOn(studentOrganisationsRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findOne(1);

      expect(result).toBeNull();
      expect(studentOrganisationsRepository.findOne).toBeCalledWith({
        where: { id: 1 },
        relations: { events: true },
      });
    });
  });

  describe('findByIds', () => {
    it('should find student organisations by IDs', async () => {
      const getByIdsDto: GetByIdsDto = { ids: [1, 2] };
      const expectedResult: any = [{ id: 1, name: 'StudentOrg1' }, { id: 2, name: 'StudentOrg2' }];
      jest.spyOn(studentOrganisationsRepository, 'find').mockResolvedValue(expectedResult);

      const result = await service.findByIds(getByIdsDto);

      expect(result).toEqual(expectedResult);
      expect(studentOrganisationsRepository.find).toBeCalledWith({
        where: { id: In(getByIdsDto.ids), status: SORequestStatuses.APPROVED },
        relations: { events: true },
      });
    });
  });

  describe('create', () => {
    const createDto: CreateStudentOrganisationDto = {
      createdById: 1,
      email: 'test@example.com',
      name: 'New StudentOrg',
    };

    it('should create a new student organisation', async () => {
      const user: any = { id: 1, studentOrganisations: [] };
      const newSO: any = { id: 1, name: 'New StudentOrg' };

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(user);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(studentOrganisationsRepository, 'create').mockReturnValue(newSO);
      jest.spyOn(studentOrganisationsRepository, 'save').mockResolvedValue(newSO);

      const result = await service.create(createDto);

      expect(result).toEqual(newSO);
      expect(usersRepository.findOneBy).toBeCalledWith({ id: createDto.createdById });
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ email: createDto.email });
      expect(studentOrganisationsRepository.create).toBeCalledWith(createDto);
      expect(user.studentOrganisations).toContain(newSO);
      expect(studentOrganisationsRepository.save).toBeCalledWith(newSO);
    });

    it('should throw BadRequestException if user with the specified ID does not exist', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(usersRepository.findOneBy).toBeCalledWith({ id: createDto.createdById });
    });

    it('should throw BadRequestException if a student organisation with the specified email already exists', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue({} as any);
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue({} as any);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(usersRepository.findOneBy).toBeCalledWith({ id: createDto.createdById });
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ email: createDto.email });
    });

    it('should throw BadRequestException if a user with the specified email already exists', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue({} as any);
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue({} as any);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(usersRepository.findOneBy).toBeCalledWith({ id: createDto.createdById });
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ email: createDto.email });
      expect(usersRepository.findOneBy).toBeCalledWith({ email: createDto.email });
    });

    it('should throw BadRequestException if a student organisation with the specified name already exists', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue({} as any);
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue({} as any);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(usersRepository.findOneBy).toBeCalledWith({ id: createDto.createdById });
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ email: createDto.email });
      expect(usersRepository.findOneBy).toBeCalledTimes(1);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    const updateDto: UpdateStudentOrganisationDto = { email: 'updated@example.com' };

    it('should update a student organisation by ID', async () => {
      const existingSO: any = { id: 1, name: 'StudentOrg1', email: 'test@example.com' };

      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValueOnce(existingSO);
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(studentOrganisationsRepository, 'save').mockResolvedValue(existingSO);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(existingSO);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: 1 });
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ email: updateDto.email });
      expect(existingSO.email).toEqual(updateDto.email);
      expect(studentOrganisationsRepository.save).toBeCalledWith(existingSO);
    });

    it('should throw NotFoundException if student organisation is not found', async () => {
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: 1 });
    });

    it('should throw BadRequestException if the updated email is already taken by another student organisation', async () => {
      const existingSO: any = { id: 1, name: 'StudentOrg1', email: 'test@example.com' };
      const newSo: any = { email: 'test@example.com' };
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValueOnce({ email: 'someEmail'} as any);
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValueOnce({ email: existingSO.email } as any);
      jest.spyOn(studentOrganisationsRepository, 'save').mockResolvedValue({} as any);

      await expect(service.update(1, newSo)).rejects.toThrow(BadRequestException);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: 1 });
      expect(studentOrganisationsRepository.findOneBy).toBeCalledTimes(2);
    });
  });

  describe('moveToReview', () => {
    it('should move a student organisation to review status', async () => {
      const existingSO: any = { id: 1, name: 'StudentOrg1', status: SORequestStatuses.APPROVED };

      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(existingSO);
      jest.spyOn(studentOrganisationsRepository, 'save').mockResolvedValue(existingSO);

      const result = await service.moveToReview(1);

      expect(result).toEqual(existingSO);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: 1 });
      expect(existingSO.status).toEqual(SORequestStatuses.ON_REVIEW);
      expect(studentOrganisationsRepository.save).toBeCalledWith(existingSO);
    });

    it('should throw NotFoundException if student organisation is not found', async () => {
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.moveToReview(1)).rejects.toThrow(NotFoundException);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: 1 });
    });
  });

  describe('moveToRejected', () => {
    it('should move a student organisation to rejected status', async () => {
      const existingSO: any = { id: 1, name: 'StudentOrg1', status: SORequestStatuses.APPROVED };

      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(existingSO);
      jest.spyOn(studentOrganisationsRepository, 'save').mockResolvedValue(existingSO);

      const result = await service.moveToRejected(1);

      expect(result).toEqual(existingSO);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: 1 });
      expect(existingSO.status).toEqual(SORequestStatuses.REJECTED);
      expect(studentOrganisationsRepository.save).toBeCalledWith(existingSO);
    });

    it('should throw NotFoundException if student organisation is not found', async () => {
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.moveToRejected(1)).rejects.toThrow(NotFoundException);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: 1 });
    });
  });

  describe('moveToApproved', () => {
    it('should move a student organisation to approved status', async () => {
      const existingSO: any = { id: 1, name: 'StudentOrg1', status: SORequestStatuses.REJECTED };

      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(existingSO);
      jest.spyOn(studentOrganisationsRepository, 'save').mockResolvedValue(existingSO);

      const result = await service.moveToApproved(1);

      expect(result).toEqual(existingSO);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: 1 });
      expect(existingSO.status).toEqual(SORequestStatuses.APPROVED);
      expect(studentOrganisationsRepository.save).toBeCalledWith(existingSO);
    });

    it('should throw NotFoundException if student organisation is not found', async () => {
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.moveToApproved(1)).rejects.toThrow(NotFoundException);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: 1 });
    });
  });

  describe('follow', () => {
    it('should follow a student organisation', async () => {
      const followDto: FollowOrganisationDto = { userId: 1, organisationId: 1 };
      const organisation: any = { id: 1, name: 'StudentOrg1', incrementFollowers: jest.fn() };
      const user: any = { id: 1, isFollowed: jest.fn(), followOrganisation: jest.fn() };

      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(organisation);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(user, 'isFollowed').mockReturnValue(false);
      jest.spyOn(user, 'followOrganisation');
      jest.spyOn(organisation, 'incrementFollowers');
      jest.spyOn(studentOrganisationsRepository, 'save').mockResolvedValue(organisation);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      await service.follow(followDto);

      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: followDto.organisationId });
      expect(usersRepository.findOneBy).toBeCalledWith({ id: followDto.userId });
      expect(user.isFollowed).toBeCalledWith(followDto.organisationId);
      expect(user.followOrganisation).toBeCalledWith(followDto.organisationId);
      expect(organisation.incrementFollowers).toBeCalled();
      expect(studentOrganisationsRepository.save).toBeCalledWith(organisation);
      expect(usersRepository.save).toBeCalledWith(user);
    });

    it('should throw NotFoundException if organisation is not found', async () => {
      const followDto: FollowOrganisationDto = { userId: 1, organisationId: 1 };

      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue({} as any);

      await expect(service.follow(followDto)).rejects.toThrow(NotFoundException);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: followDto.organisationId });
      expect(usersRepository.findOneBy).toBeCalledTimes(0);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const followDto: FollowOrganisationDto = { userId: 1, organisationId: 1 };

      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue({} as any);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.follow(followDto)).rejects.toThrow(NotFoundException);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: followDto.organisationId });
      expect(usersRepository.findOneBy).toBeCalledWith({ id: followDto.userId });
    });

    it('should throw BadRequestException if user already follows the organisation', async () => {
      const followDto: FollowOrganisationDto = { userId: 1, organisationId: 1 };
      const organisation: any = { id: 1, name: 'StudentOrg1' };
      const user: any = { id: 1, isFollowed: jest.fn() };

      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(organisation);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(user, 'isFollowed').mockReturnValue(true);

      await expect(service.follow(followDto)).rejects.toThrow(BadRequestException);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: followDto.organisationId });
      expect(usersRepository.findOneBy).toBeCalledWith({ id: followDto.userId });
      expect(user.isFollowed).toBeCalledWith(followDto.organisationId);
    });
  });

  describe('unfollow', () => {
    it('should unfollow a student organisation', async () => {
      const unfollowDto: FollowOrganisationDto = { userId: 1, organisationId: 1 };
      const organisation: any = { id: 1, name: 'StudentOrg1', decrementFollowers: jest.fn() };
      const user: any = { id: 1, unFollowOrganisation: jest.fn() };

      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(organisation);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(user, 'unFollowOrganisation');
      jest.spyOn(organisation, 'decrementFollowers');
      jest.spyOn(studentOrganisationsRepository, 'save').mockResolvedValue(organisation);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      await service.unfollow(unfollowDto);

      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: unfollowDto.organisationId });
      expect(usersRepository.findOneBy).toBeCalledWith({ id: unfollowDto.userId });
      expect(user.unFollowOrganisation).toBeCalledWith(unfollowDto.organisationId);
      expect(organisation.decrementFollowers).toBeCalled();
      expect(studentOrganisationsRepository.save).toBeCalledWith(organisation);
      expect(usersRepository.save).toBeCalledWith(user);
    });

    it('should throw NotFoundException if organisation is not found', async () => {
      const unfollowDto: FollowOrganisationDto = { userId: 1, organisationId: 1 };

      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue({} as any);

      await expect(service.unfollow(unfollowDto)).rejects.toThrow(NotFoundException);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: unfollowDto.organisationId });
      expect(usersRepository.findOneBy).toBeCalledTimes(0);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const unfollowDto: FollowOrganisationDto = { userId: 1, organisationId: 1 };

      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue({} as any);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.unfollow(unfollowDto)).rejects.toThrow(NotFoundException);
      expect(studentOrganisationsRepository.findOneBy).toBeCalledWith({ id: unfollowDto.organisationId });
      expect(usersRepository.findOneBy).toBeCalledWith({ id: unfollowDto.userId });
    });
  });
});

