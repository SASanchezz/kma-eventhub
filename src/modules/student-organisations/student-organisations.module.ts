import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentOrganisationsService } from './student-organisations.service';
import { StudentOrganisationsController } from './student-organisations.controller';
import { StudentOrganisations } from './student-organisations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentOrganisations])],
  controllers: [StudentOrganisationsController],
  providers: [StudentOrganisationsService],
})
export class StudentOrganisationsModule {}
