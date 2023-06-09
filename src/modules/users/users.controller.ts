import { Controller, Param, Get, NotFoundException, Put, Body, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDetailsDto } from './dto/user-details.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailStatusResponseDto, EmailStatusType } from './dto/email-status.dto';
import { StudentOrganisationDetailsDto } from '../student-organisations/dto/student-organisations-details.dto';


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
  @ApiCreatedResponse({ type: UserDetailsDto, description: 'Returns either: "UserDetailsDto", "StudentOrganisationDetailsDto"' })
  async getOrCreate(@Param('email') email: string): Promise<UserDetailsDto | StudentOrganisationDetailsDto> {
    const entity = await this.usersService.findByEmailOrCreate(email);

    return entity.details;
  }

  @Get('status/:email')
  @ApiCreatedResponse({ type: EmailStatusResponseDto, description: 'Returns either: "user", "organisation", "none"' })
  async getEmailStatus(@Param('email') email: string): Promise<EmailStatusType> {
    return await this.usersService.getEmailStatus(email);
  }

  @Put(':id')
  async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: number): Promise<UserDetailsDto> {
    const user = await this.usersService.update(id, updateUserDto);

    return user.details
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.usersService.delete(id);
  }
}
