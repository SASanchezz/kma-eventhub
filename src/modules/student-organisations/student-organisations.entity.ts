import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { StudentOrganisationDetailsDto } from './dto/student-organisations-details.dto';
import * as moment from 'moment';
import { Events } from '../events/events.entity';
import { SORequestStatuses } from './types/so-requests.statuses';
import { Users } from '../users/users.entity';

@Entity({ engine: 'InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' })
export class StudentOrganisations {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: null })
  socialMedia: string;

  @Column({ default: null })
  logoUrl: string;

  @Column({ default: 0 })
  followers: number;

  @Column({ default: SORequestStatuses.SENT })
  status: string;

  @Column()
  createdById: number;

  @OneToMany(() => Events, event => event.organisation, {
    cascade: true,
  })
  events: Events[];

  @ManyToOne(() => Users, (user) => user.studentOrganisations)
  createdBy: Users;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn({ default: null })
  deletedAt: string;


  addEvent(event: Events) {
    if (!this.events) {
      this.events = new Array<Events>();
    }
    this.events.push(event);
  }

  removeEvent(event: Events) {
    if (!this.events) {
      return;
    }
    const index = this.events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  incrementFollowers() {
    this.followers++;
  }

  decrementFollowers() {
    this.followers--;
  }


  get details(): StudentOrganisationDetailsDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      description: this.description,
      status: this.status,
      followers: this.followers,
      socialMedia: this.socialMedia?.trim().split(' '),
      logoUrl: this.logoUrl,
      createdAt: moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      upcomingEvents: this.events
        ?.filter(event => moment(event.dateTime).isAfter(moment()))
        ?.map(event => event.details) ?? [],
      finishedEvents: this.events
        ?.filter(event => moment(event.dateTime).isBefore(moment()))
        ?.map(event => event.details) ?? [],
    }
  }

}
