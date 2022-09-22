import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../IUserRepository';

@Injectable()
export class TypeOrmUsersRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async delete(user: User): Promise<void> {
    this.usersRepository.remove(user);
  }
  findById(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['posts'] });
  }
}
