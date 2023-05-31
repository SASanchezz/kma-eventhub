import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { StudentOrganisationDetailsDto } from './dto/student-organisations-details.dto';
import { UserDetailsDto } from '../users/dto/user-details.dto';

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

  followers: UserDetailsDto[];

  // @Column({ default: null })
  // upcoming_events: Object; //TODO when event entity will be created

  // @Column({ default: null })
  // finished_events: Object; //TODO when event entity will be created

  @Column({ default: null })
  socialMedia: string;

  @Column({ default: null })
  logoUrl: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn({ default: null })
  deletedAt: string;

  get details(): StudentOrganisationDetailsDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      description: this.description,
      followers: this.followers,
      // upcomin_events: this.upcomin_events,
      // finished_events: this.finished_events,
      socialMedia: this.socialMedia.split(' '),
      logoUrl: this.logoUrl,
      createdAt: this.createdAt,
    }
  }

}
