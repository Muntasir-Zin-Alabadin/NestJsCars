import {
    createParamDecorator,
    ExecutionContext
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => { //never is because our decorator never needs any argumnets
        const request = context.switchToHttp().getRequest(); //gives us the underlying request thta's comeing to our application
        //console.log(request.session.userId) //this will give us the id of the signed in user
        //return 'hi there';
        return request.currentUser;
    }
)