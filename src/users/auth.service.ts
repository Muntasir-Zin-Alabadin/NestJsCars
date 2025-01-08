import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto"; //script is the actuall hashing function
import { promisify } from "util"; //used to make scrypt able to use a promise instead of a callback

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor (private UsersService: UsersService) {}

    async signup(email: string, password: string) {
        //See if email is in use
        const users = await this.UsersService.find(email);
        if(users.length) {
            throw new BadRequestException('email is in use');
        }

        //Hash the users password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        //Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer; //we're telling Typescript that scrypt will return Buffer

        //Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        //Create a new user and save it
        const user = await this.UsersService.create(email, result);

        //return the user
        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.UsersService.find(email);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const [salt, storedHash] = user.password.split('.'); //because of the .

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if(storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }
        return user;
    }
}