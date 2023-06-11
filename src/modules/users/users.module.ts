import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './users.entity';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, StudentOrganisations])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
