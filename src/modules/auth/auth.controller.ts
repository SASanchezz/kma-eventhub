import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { TokensPairDto } from './dto/token-pair.dto';


@ApiTags('route for authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiCreatedResponse({ type: TokensPairDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<TokensPairDto> {
    const tokens = await this.authService.register(createUserDto);

    return tokens
  }

  @Post('/signin')
  @ApiCreatedResponse({ type: TokensPairDto })
  async login(@Body() loginDto: LoginDto): Promise<TokensPairDto> {
    const tokens = await this.authService.login(loginDto);

    return tokens
  }
}
