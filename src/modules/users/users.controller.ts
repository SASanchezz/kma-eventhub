import { Controller, Param, Get, NotFoundException } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDetailsDto } from './dto/user-details.dto';


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

  @Get(':id')
  @ApiCreatedResponse({ type: UserDetailsDto })
  async getOne(@Param('id') id: string): Promise<UserDetailsDto> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.details;
  }

  // @Put(':id')
  // async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string): Promise<UserDetails> {
  //   const user = await this.usersService.update(id, updateUserDto);

  //   return user.details
  // }
}
