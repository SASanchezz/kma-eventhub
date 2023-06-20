import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EventDetailsDto } from './dto/events-details.dto';
import * as moment from 'moment';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';
import { EventFormats } from './dto/event.formats';

@Entity({ engine: 'InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' })
export class Events {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  title: string;

  @Column({ default: EventFormats.ONLINE })
  format: string;

  @Column({ length: 4096 })
  text: string;

  @Column({ default: null })
  textPreview?: string;

  @Column()
  dateTime: string;

  @Column({ default: null })
  tags?: string;

  @Column()
  organisationId: number;

  @Column({ default: null })
  partnerIds?: string;

  @Column({ default: null })
  location?: string;

  @Column({ default: 0 })
  price?: number;

  @Column({ default: null })
  imageUrl?: string;

  @Column({ default: null })
  linkToRegister?: string;

  @ManyToOne(() => StudentOrganisations, so => so.events)
  organisation: StudentOrganisations;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn({ default: null })
  deletedAt: string;

  get details(): EventDetailsDto {
    return {
      id: this.id,
      title: this.title,
      format: this.format, 
      text: this.text,
      textPreview: this.textPreview,
      dateTime: moment(this.dateTime).format('YYYY-MM-DD HH:mm:ss'),
      tags: this.tags?.split(' ') ?? [],
      organisationId: this.organisationId,
      partnerIds: this.partnerIds?.split(' ').map(Number) ?? [],
      location: this.location,
      price: this.price,
      imageUrl: this.imageUrl,
      linkToRegister: this.linkToRegister,
      createdAt: moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    }
  }

}
