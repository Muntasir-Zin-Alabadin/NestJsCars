import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {//fakeUsers/AuthService are for mock implementations for testing, only in places that have these services (such as signup and signin for fakeAuthService)
    fakeUsersService = {
      findOne: (id: number) => { //hovering over findOne's name tells us what it needs
        return Promise.resolve({id, email: 'asdf@asdf.com', password: 'asdf' } as User); //since it has some methods we don't want to implement we add "as User"
      }, 
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: 'asdf'} as User]);
      },
      // remove: () => {},
      // update: () => {}
    }; 
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({id: 1, email, password} as User)
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService, //whenever the UserController is created, instead of giving it an actual copy of userService, we giv eit the object we just put together (fakeUsersService)
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with a given email', async () => {
    const users = await controller.findAllUsers('mun@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('mun@gmail.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = {userId: -10};
    const user = await controller.signin(
      {email: 'mun@gmail.com', password: 'mun'},
      session
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
