import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';
import { NotFoundException } from '@nestjs/common';
import { EmailStatuses } from './dto/email-status.dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<Users>;
  let studentOrganisationsRepository: Repository<StudentOrganisations>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StudentOrganisations),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    studentOrganisationsRepository = module.get<Repository<StudentOrganisations>>(getRepositoryToken(StudentOrganisations));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('find', () => {
    it('should return an array of users', async () => {
      const users: any[] = [{ id: 1, email: 'user1@example.com' }];
      jest.spyOn(usersRepository, 'find').mockResolvedValue(users);

      const result = await service.find();

      expect(result).toEqual(users);
      expect(usersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findByEmailOrCreate', () => {
    it('should return an existing user', async () => {
      const email = 'existinguser@example.com';
      const user: any = { id: 1, email };
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'create').mockImplementation();
      jest.spyOn(usersRepository, 'save').mockResolvedValue(null);

      const result = await service.findByEmailOrCreate(email);

      expect(result).toEqual(user);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(usersRepository.create).not.toHaveBeenCalled();
      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    it('should create and return a new user if not found', async () => {
      const email = 'newuser@example.com';
      const newUser: any = { id: 2, email };
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'create').mockReturnValue(newUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(newUser);

      const result = await service.findByEmailOrCreate(email);

      expect(result).toEqual(newUser);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(usersRepository.create).toHaveBeenCalledWith({ email });
      expect(usersRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const id = 1;
      const updateUserDto = { name: 'John Doe' };
      const user: any = { id, email: 'user1@example.com' };
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue({ ...user, ...updateUserDto });

      const result = await service.update(id, updateUserDto);

      expect(result).toEqual({ ...user, ...updateUserDto });
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(usersRepository.save).toHaveBeenCalledWith({ ...user, ...updateUserDto });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const id = 1;
      const updateUserDto = { name: 'John Doe' };
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(null);

      await expect(service.update(id, updateUserDto)).rejects.toThrow(NotFoundException);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(usersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getEmailStatus', () => {
    it('should return EmailStatuses.USER if user exists with the given email', async () => {
      const email = 'user@example.com';
      const user: any = { id: 1, email };
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.getEmailStatus(email);

      expect(result).toEqual({ status: EmailStatuses.USER });
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(studentOrganisationsRepository.findOneBy).not.toHaveBeenCalled();
    });

    it('should return EmailStatuses.ORGANISATION if student organisation exists with the given email', async () => {
      const email = 'organisation@example.com';
      const studentOrganisation: any = { id: 1, email };
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(studentOrganisation);

      const result = await service.getEmailStatus(email);

      expect(result).toEqual({ status: EmailStatuses.ORGANISATION });
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(studentOrganisationsRepository.findOneBy).toHaveBeenCalledWith({ email });
    });

    it('should return EmailStatuses.NONE if no user or student organisation exists with the given email', async () => {
      const email = 'nonexistent@example.com';
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(studentOrganisationsRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.getEmailStatus(email);

      expect(result).toEqual({ status: EmailStatuses.NONE });
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(studentOrganisationsRepository.findOneBy).toHaveBeenCalledWith({ email });
    });
  });
});

