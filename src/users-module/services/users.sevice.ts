import { Repository } from 'typeorm';
import { User, UserRole } from '../../database-module/entities/user.entity';
import { CreateUserDto } from '../../auth-module/dtos/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async create(createUser: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...createUser
    });
    return this.usersRepository.save(user);
  }
}
