import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, Session, UseGuards} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { Auth } from 'typeorm';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guards';

@Controller('auth') //auth or whatever you want to be before this section i.e. auth/...
@Serialize(UserDto) //To have no password shown in any respense
export class UsersController {
    constructor(private usersService: UsersService,
                private authService: AuthService
                ) {}

    @Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color;
    }

    @Get('/colors')
    getColor(@Session() session: any) {
        return session.color;
    }

    //@Get('/whoami')
    //whoAmI(@Session() session: any) {
    //    return this.usersService.findOne(session.userId); //if the id was null we will get the first user in the list of users, so we need to modify findOne in users.service.ts
    //}

    @Get('/whoami')
    @UseGuards(AuthGuard) //You can only access this if you're signed in. Get 403 error if not signed in
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    //@UseInterceptors(new SerializeInterceptor(UserDto)) (deleted because we used a function instead (Serialize))
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        // console.log('handler is running');
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('user not found')
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
