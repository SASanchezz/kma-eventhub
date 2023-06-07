import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserDetailsDto } from './dto/user-details.dto';
import { StudentOrganisations } from '../student-organisations/student-organisations.entity';

@Entity({ engine: 'InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' })
export class Users {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ unique: true, default: null })
  email: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ default: null })
  imageUrl: string;

  @Column()
  password: string;

  @Column({ default: null })
  refreshToken: string;

  @Column({ default: null })
  refreshTokenIssuedAt: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn({ default: null })
  deletedAt: string;

  get details(): UserDetailsDto {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      surname: this.surname,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
    }
  }
}
