import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { UserDetails } from './types/users.user-details';

@Entity({ engine: 'InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' })
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, default: null })
  email: string;

  @Column({ default: null })
  phone: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ default: null })
  patronymic: string;

  @Column()
  password: string;

  @Column({ default: null })
  refresh_token: string;

  @Column({ default: null })
  refresh_token_issued_at: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @DeleteDateColumn({ default: null })
  deleted_at: string;

  get details(): UserDetails {
    return {
      id: this.id,
      email: this.email,
      phone: this.phone,
      name: this.name,
      surname: this.surname,
      patronymic: this.patronymic,
      created_at: this.created_at,
    }
  }

}
