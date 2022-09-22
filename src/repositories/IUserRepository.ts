import { User } from '../entities/user.entity';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
  delete(user: User): Promise<void>;
}
