import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentOrganisationsService } from './student-organisations.service';
import { StudentOrganisationsController } from './student-organisations.controller';
import { StudentOrganisations } from './student-organisations.entity';
import { Users } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentOrganisations, Users])],
  controllers: [StudentOrganisationsController],
  providers: [StudentOrganisationsService],
})
export class StudentOrganisationsModule {}
