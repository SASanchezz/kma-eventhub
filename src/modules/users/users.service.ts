import { Injectable } from '@nestjs/common';
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

  async findOne(id: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      return null;
    }
    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

}
