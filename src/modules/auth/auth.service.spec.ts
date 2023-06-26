import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../../modules/users/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { EmailAuthDto } from './dto/email-auth.dto';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register and return tokens', async () => {
      process.env.TOKEN_SECRET = 'secret';
      process.env.TOKEN_LIFE = '2592000';
      process.env.PASsWORD_HASH_ROUNDS = '10';
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(undefined);
      jest.spyOn(usersRepository, 'create').mockReturnValue({ id: 'id' } as any);

      const createUserDto = new CreateUserDto();
      createUserDto.password = 'password';
      const result = await authService.register(createUserDto);

      expect(result).toBeDefined();
      expect(usersRepository.create).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user exists', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(new Users());

      const createUserDto = new CreateUserDto();

      await expect(authService.register(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login and return tokens', async () => {
      process.env.TOKEN_SECRET = 'secret';
      process.env.TOKEN_LIFE = '2592000';
      const user = new Users();
      user.password = await bcrypt.hash('password', 10);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);

      const loginDto = new LoginDto();
      loginDto.password = 'password';
      const result = await authService.login(loginDto);

      expect(result).toBeDefined();
    });

    it('should throw error if user does not exist', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(undefined);

      const loginDto = new LoginDto();

      await expect(authService.login(loginDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('emailAuth', () => {
    it('should authenticate via email and return tokens', async () => {
      process.env.TOKEN_SECRET = 'secret';
      process.env.TOKEN_LIFE = '2592000';
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(undefined);
      jest.spyOn(usersRepository, 'create').mockReturnValue({ id: 'id' } as any);

      const emailAuthDto = new EmailAuthDto();
      const result = await authService.emailAuth(emailAuthDto);

      expect(result).toBeDefined();
      expect(usersRepository.create).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });
  });
});
