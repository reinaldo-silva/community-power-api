import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/IUserRepository';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository') private usersRepository: IUserRepository,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const newUser = new User();

    const salt = await genSalt(10);
    const passwordEncrypt = await hash(data.password, salt);

    return await this.usersRepository.save(
      Object.assign(newUser, {
        ...data,
        password: passwordEncrypt,
        salt: salt,
      }),
    );
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findById(id);
  }

  async remove(id: string): Promise<void> {
    const userFound = await this.usersRepository.findById(id);

    if (!userFound) {
      throw new NotFoundException('User not found!');
    }

    await this.usersRepository.delete(userFound);
  }
}
