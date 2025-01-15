import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

//we're telling TypeScript that this request might have a current user propertie that is going to be an instance of a user
declare global {
    namespace Express {
        interface Request {
            currentUser?: User; //add one more property (user) to that interface (the request object might have a current user property (optional) and if it's defined it will be set to a User entity instance)
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(
        private usersService: UsersService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.session || {} //if the user has a session OR not

        if (userId) {
            const user = await this.usersService.findOne(userId);
            // req.currentUser = user; we are trying to assign some value to a propertie that doesn't exist
            req.currentUser = user;
        }

        next(); //that's it for this middleware, go ahead and run whatever middleware might exist
    }
}