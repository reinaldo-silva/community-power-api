import { User } from '../../entities/user.entity';
import { IUserRepository } from '../IUserRepository';

export class MockUsersRepository implements IUserRepository {
  users: User[];

  constructor() {
    this.users = [];
  }

  async delete(user: User): Promise<void> {
    const newArray = this.users.filter((userFind) => userFind.id !== user.id);

    this.users = newArray;
  }
  async findById(id: string): Promise<User> {
    const userFound = await this.users.find((user) => user.id === id);

    return userFound;
  }

  async save(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.users;
  }
}
