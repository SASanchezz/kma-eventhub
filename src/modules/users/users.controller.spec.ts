import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { UserDetailsDto } from './dto/user-details.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailStatusType, EmailStatuses } from './dto/email-status.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
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

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('getAll', () => {
    it('should return an array of UserDetailsDto', async () => {
      // Mock the usersService.find() method
      const mockUsers: any = [{ details: new UserDetailsDto() }];
      jest.spyOn(usersService, 'find').mockResolvedValue(mockUsers);

      const result = await usersController.getAll();

      expect(result).toEqual(mockUsers.map(user => user.details));
    });
  });

  describe('getOrCreate', () => {
    it('should return a UserDetailsDto', async () => {
      const mockUser: any = { details: new UserDetailsDto() };
      const email = 'test@example.com';

      // Mock the usersService.findByEmailOrCreate() method
      jest.spyOn(usersService, 'findByEmailOrCreate').mockResolvedValue(mockUser);
      const result = await usersController.getOrCreate(email);

      
      expect(result).toEqual(mockUser.details);
    });
  });

  describe('getEmailStatus', () => {
    it('should return an EmailStatusType', async () => {
      const mockStatus: EmailStatusType = {
        status: EmailStatuses.USER,
      }
      const email = 'test@example.com';

      // Mock the usersService.getEmailStatus() method
      jest.spyOn(usersService, 'getEmailStatus').mockResolvedValue(mockStatus);

      const result = await usersController.getEmailStatus(email);

      expect(result).toEqual(mockStatus);
    });
  });

  describe('update', () => {
    it('should return a UserDetailsDto', async () => {
      const mockUser: any = { details: new UserDetailsDto() };
      const updateUserDto: UpdateUserDto = { /* update user details */ };
      const id = 1;

      // Mock the usersService.update() method
      jest.spyOn(usersService, 'update').mockResolvedValue(mockUser);

      const result = await usersController.update(updateUserDto, id);

      expect(result).toEqual(mockUser.details);
    });
  });
});
