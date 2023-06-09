import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { UserSession, createTokensPair } from '../../utils/jwt';
import { Users } from '../../modules/users/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { TokensPairDto } from './dto/token-pair.dto';
import { EmailAuthDto } from './dto/email-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<TokensPairDto> {
    const user = await this.usersRepository.findOneBy({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('User with this email already exists');
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, Number(process.env.PASsWORD_HASH_ROUNDS));

    const newUser = this.usersRepository.create(createUserDto);

    const jwtPayload: UserSession = { userId: newUser.id };
    const tokens = createTokensPair(jwtPayload);

    newUser.refreshToken = tokens.refreshToken;
    newUser.refreshTokenIssuedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    await this.usersRepository.save(newUser);

    return tokens;
  }

  async login(loginDto: LoginDto): Promise<TokensPairDto> {
    const user = await this.usersRepository.findOneBy({ email: loginDto.email });
    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }
    const isPasswordCorrect = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const jwtPayload: UserSession = { userId: user.id };
    const tokens = createTokensPair(jwtPayload);

    return tokens;
  }

  async emailAuth(emailAuthDto: EmailAuthDto): Promise<TokensPairDto> {
    let user = await this.usersRepository.findOneBy({ email: emailAuthDto.email });
    if (!user) {
      user = this.usersRepository.create(emailAuthDto);
    }

    const jwtPayload: UserSession = { userId: user.id };
    const tokens = createTokensPair(jwtPayload);
    user.refreshToken = tokens.refreshToken;
    user.refreshTokenIssuedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    await this.usersRepository.save(user);

    return tokens;
  }

}
