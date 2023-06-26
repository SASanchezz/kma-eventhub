import { Test, TestingModule } from '@nestjs/testing';
import { StudentOrganisationsController } from './student-organisations.controller';
import { StudentOrganisationsService } from './student-organisations.service';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { StudentOrganisations } from './student-organisations.entity';

describe('StudentOrganisationsController', () => {
  let controller: StudentOrganisationsController;
  let service: StudentOrganisationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentOrganisationsController],
      providers: [
        StudentOrganisationsService,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(StudentOrganisations),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentOrganisationsController>(StudentOrganisationsController);
    service = module.get<StudentOrganisationsService>(StudentOrganisationsService);
  });

  describe('getAll', () => {
    it('should return an array of student organisations', async () => {
      const expectedResult: any = [{ id: 1, name: 'StudentOrg1' }, { id: 2, name: 'StudentOrg2' }];
      const returnValue: any = [{ details: { id: 1, name: 'StudentOrg1' } }, { details: { id: 2, name: 'StudentOrg2' } }];
      jest.spyOn(service, 'find').mockResolvedValue(returnValue);

      const result = await controller.getAll({} as any);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getOne', () => {
    it('should return a student organisation by ID', async () => {
      const expectedResult: any = { details: { id: 1, name: 'StudentOrg1' } };
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.getOne(1);

      expect(result).toEqual(expectedResult.details);
    });

    it('should throw NotFoundException if student organisation is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.getOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByIds', () => {
    it('should return an array of student organisations by IDs', async () => {
      const expectedResult: any = [{ id: 1, name: 'StudentOrg1' }, { id: 2, name: 'StudentOrg2' }];
      const returnValue: any = [{ details: { id: 1, name: 'StudentOrg1' } }, { details: { id: 2, name: 'StudentOrg2' } }];
      jest.spyOn(service, 'findByIds').mockResolvedValue(returnValue);

      const result = await controller.findByIds({ ids: [1, 2] });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should create a new student organisation', async () => {
      const createDto: any = { name: 'New StudentOrg' };
      const expectedResult: any = { details: { id: 1, name: 'New StudentOrg' } };
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult.details);
    });
  });

  describe('update', () => {
    it('should update a student organisation by ID', async () => {
      const updateDto: any = { name: 'Updated StudentOrg' };
      const expectedResult: any = { details: { id: 1, name: 'Updated StudentOrg' } };
      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(expectedResult.details);
    });
  });

  describe('follow', () => {
    it('should follow a student organisation', async () => {
      service.follow = jest.fn();
      await expect(controller.follow({} as any)).resolves.toBeUndefined();
      expect(service.follow).toBeCalledTimes(1);
    });
  });

  describe('unfollow', () => {
    it('should unfollow a student organisation', async () => {
      service.unfollow = jest.fn();
      await expect(controller.unfollow({} as any)).resolves.toBeUndefined();
      expect(service.unfollow).toBeCalledTimes(1);
    });
  });

  describe('moveToReview', () => {
    it('should move a student organisation to review status', async () => {
      service.moveToReview = jest.fn();
      await expect(controller.moveToReview(1)).resolves.toBeUndefined();
      expect(service.moveToReview).toBeCalledTimes(1);
    });
  });

  describe('approve', () => {
    it('should approve a student organisation', async () => {
      service.moveToApproved = jest.fn();
      await expect(controller.approve(1)).resolves.toBeUndefined();
      expect(service.moveToApproved).toBeCalledTimes(1);
    });
  });

  describe('reject', () => {
    it('should reject a student organisation', async () => {
      service.moveToRejected = jest.fn();
      await expect(controller.reject(1)).resolves.toBeUndefined();
      expect(service.moveToRejected).toBeCalledTimes(1);
    });
  });
});

