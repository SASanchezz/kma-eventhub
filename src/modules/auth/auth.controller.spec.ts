import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { EmailAuthDto } from './dto/email-auth.dto';
import { TokensPairDto } from './dto/token-pair.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(new TokensPairDto()),
            login: jest.fn().mockResolvedValue(new TokensPairDto()),
            emailAuth: jest.fn().mockResolvedValue(new TokensPairDto()),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should register and return tokens', async () => {
    const createUserDto = new CreateUserDto();
    expect(await authController.create(createUserDto)).toBeInstanceOf(TokensPairDto);
    expect(authService.register).toHaveBeenCalledWith(createUserDto);
  });

  it('should login and return tokens', async () => {
    const loginDto = new LoginDto();
    expect(await authController.login(loginDto)).toBeInstanceOf(TokensPairDto);
    expect(authService.login).toHaveBeenCalledWith(loginDto);
  });

  it('should authenticate via email and return tokens', async () => {
    process.env.TOKEN_SECRET = 'secret';
    process.env.TOKEN_LIFE = '2592000';
    const emailAuthDto = new EmailAuthDto();
    expect(await authController.emailAuth(emailAuthDto)).toBeInstanceOf(TokensPairDto);
    expect(authService.emailAuth).toHaveBeenCalledWith(emailAuthDto);
  });
});
