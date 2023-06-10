import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async find(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async findByEmailOrCreate(email: string): Promise<Users | null> {
    let user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      user = this.usersRepository.create({ email });
      await this.usersRepository.save(user);
    } 

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

}
