import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { UserDetailsDto } from './dto/user-details.dto';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';

@Entity({ engine: 'InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' })
export class Users {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ unique: true, default: null })
  email: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  surname: string;

  @Column({ default: '' })
  likes: string;

  @Column({ default: '' })
  follows: string;

  @Column({ default: null })
  imageUrl: string;

  @Column({ default: null})
  password?: string;

  @Column({ default: null })
  refreshToken: string;

  @Column({ default: null })
  refreshTokenIssuedAt: string;

  @OneToMany(() => StudentOrganisations, studentOrganisation => studentOrganisation.createdBy)
  studentOrganisations: StudentOrganisations[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn({ default: null })
  deletedAt: string;

  isLiked(eventId: number): boolean {
    return this.likes.includes(eventId.toString());
  }

  addLikedEvent(eventId: number): void {
    this.likes = (this.likes + ' ' + eventId).trim();
  }

  removeLikedEvent(eventId: number): void {
    const arr = this.likes?.split(' ').map(Number) ?? [];
    const index = arr.indexOf(eventId);
    if (index !== -1) {
      arr.splice(index, 1);
      this.likes = arr.join(' ');
    }
  }

  isFollowed(organisationId: number): boolean {
    return this.follows.includes(organisationId.toString());
  }

  followOrganisation(organisationId: number): void {
    this.follows = (this.follows + ' ' + organisationId).trim();
  }

  unFollowOrganisation(organisationId: number): void {
    const arr = this.follows?.split(' ').map(Number) ?? [];
    const index = arr.indexOf(organisationId);
    if (index !== -1) {
      arr.splice(index, 1);
      this.follows = arr.join(' ');
    }
  }

  get details(): UserDetailsDto {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      surname: this.surname,
      likes: this.likes?.split(' ').filter(value => value.length > 0).map(Number) ?? [],
      follows: this.follows?.split(' ').filter(value => value.length > 0).map(Number) ?? [],
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
    }
  }
}
