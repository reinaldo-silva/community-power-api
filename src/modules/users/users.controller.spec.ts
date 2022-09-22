import { Test, TestingModule } from '@nestjs/testing';
import { MockUsersRepository } from '../../repositories/implementations/MockUsersRepository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: 'IUserRepository', useClass: MockUsersRepository },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create a new User', async () => {
    const res = await controller.createUser({
      email: 'reinaldo@email.com',
      name: 'Reinaldo Silva ',
      password: 'Reinaldo123@',
    });

    expect(res).toHaveProperty('id');
  });
});
