import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TokensPair } from 'src/utils/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<TokensPair> {
    const tokens = await this.authService.register(createUserDto);

    return tokens
  }

  @Post('/signin')
  async login(@Body() {email, password}): Promise<TokensPair> {
    const tokens = await this.authService.login(email, password);

    return tokens
  }
}
