import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Events } from './events.entity';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Events, StudentOrganisations])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
