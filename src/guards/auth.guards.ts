import {
    CanActivate,
    ExecutionContext
} from '@nestjs/common'
import { Observable } from 'rxjs'

//to make sure someone is signed in before they can access a given route handler
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        return request.session.userId;
    }
}