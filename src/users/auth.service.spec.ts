import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";


describe('AuthService', () => { //This function is just to add "AuthService" as the title of the test in the test screen.
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () =>{
        //Create a fake copy of the module service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers); //because find is asyncronous
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 99999), email, password } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
            {
                provide: UsersService,
                useValue: fakeUsersService
            },
            ],
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('asd@gmail.com', 'asds');

        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined(); //making sure that the password is salted and hashed
    });

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('asdf@asdf.com', 'asdf');
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
      });

    it('throws if signin is called with an unused email', async () => {
        await expect(
          service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException);
      });

    it('throws if an invalid password is provided', async () => {
        await service.signup('laskdjf@alskdfj.com', 'password');
        await expect(
          service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
        ).rejects.toThrow(BadRequestException);
      });

      it('returns a user if correct password is provided', async () => {
        await service.signup('asdf@asdf.com', 'mypassword');
        
        const user = await service.signin('asdf@asdf.com', 'mypassword');
        expect(user).toBeDefined();
      });
});
