import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.currentUser) {
            return false; //if you're not signed in then obviously you're not an admin, so we're going to request your request
        }

        return request.currentUser.admin;
    }
}