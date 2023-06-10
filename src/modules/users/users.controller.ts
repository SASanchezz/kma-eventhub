import { Controller, Param, Get, NotFoundException, Put, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDetailsDto } from './dto/user-details.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@ApiTags('route to manage user entity')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiCreatedResponse({ type: UserDetailsDto, isArray: true })
  async getAll(): Promise<UserDetailsDto[]> {
    const users = await this.usersService.find();

    return users.map(user => user.details);
  }

  @Get(':email')
  @ApiCreatedResponse({ type: UserDetailsDto })
  async getOrCreate(@Param('email') email: string): Promise<UserDetailsDto> {
    const user = await this.usersService.findByEmailOrCreate(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.details;
  }

  @Put(':id')
  async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: number): Promise<UserDetailsDto> {
    const user = await this.usersService.update(id, updateUserDto);

    return user.details
  }
}
