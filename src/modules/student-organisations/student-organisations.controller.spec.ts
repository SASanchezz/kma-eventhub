import { Test, TestingModule } from '@nestjs/testing';
import { StudentOrganisationsController } from './student-organisations.controller';
import { StudentOrganisationsService } from './student-organisations.service';
import { NotFoundException } from '@nestjs/common';

describe('StudentOrganisationsController', () => {
  let controller: StudentOrganisationsController;
  let service: StudentOrganisationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentOrganisationsController],
      providers: [StudentOrganisationsService],
    }).compile();

    controller = module.get<StudentOrganisationsController>(StudentOrganisationsController);
    service = module.get<StudentOrganisationsService>(StudentOrganisationsService);
  });

  describe('getAll', () => {
    it('should return an array of student organisations', async () => {
      const expectedResult = [{ id: 1, name: 'StudentOrg1' }, { id: 2, name: 'StudentOrg2' }];
      jest.spyOn(service, 'find').mockResolvedValue(expectedResult);

      const result = await controller.getAll({});

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getOne', () => {
    it('should return a student organisation by ID', async () => {
      const expectedResult = { id: 1, name: 'StudentOrg1' };
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.getOne(1);

      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if student organisation is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.getOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByIds', () => {
    it('should return an array of student organisations by IDs', async () => {
      const expectedResult = [{ id: 1, name: 'StudentOrg1' }, { id: 2, name: 'StudentOrg2' }];
      jest.spyOn(service, 'findByIds').mockResolvedValue(expectedResult);

      const result = await controller.findByIds({ ids: [1, 2] });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should create a new student organisation', async () => {
      const createDto = { name: 'New StudentOrg' };
      const expectedResult = { id: 1, name: 'New StudentOrg' };
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a student organisation by ID', async () => {
      const updateDto = { name: 'Updated StudentOrg' };
      const expectedResult = { id: 1, name: 'Updated StudentOrg' };
      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('follow', () => {
    it('should follow a student organisation', async () => {
      await expect(controller.follow({})).resolves.toBeUndefined();
      expect(service.follow).toBeCalledTimes(1);
    });
  });

  describe('unfollow', () => {
    it('should unfollow a student organisation', async () => {
      await expect(controller.unfollow({})).resolves.toBeUndefined();
      expect(service.unfollow).toBeCalledTimes(1);
    });
  });

  describe('moveToReview', () => {
    it('should move a student organisation to review status', async () => {
      await expect(controller.moveToReview(1)).resolves.toBeUndefined();
      expect(service.moveToReview).toBeCalledTimes(1);
    });
  });

  describe('approve', () => {
    it('should approve a student organisation', async () => {
      await expect(controller.approve(1)).resolves.toBeUndefined();
      expect(service.moveToApproved).toBeCalledTimes(1);
    });
  });

  describe('reject', () => {
    it('should reject a student organisation', async () => {
      await expect(controller.reject(1)).resolves.toBeUndefined();
      expect(service.moveToRejected).toBeCalledTimes(1);
    });
  });
});

