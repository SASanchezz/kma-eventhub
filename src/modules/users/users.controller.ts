import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDetails } from './types/users.user-details';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(): Promise<UserDetails[]> {
    const users = await this.usersService.find();

    return users.map(user => user.details);
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<UserDetails> {
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
