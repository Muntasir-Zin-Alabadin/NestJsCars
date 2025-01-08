import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

interface ClassConstructor {
    new (...args: any[]): {} //as long as you give me a class, I'm gonna be happy. (used to make sure that Serialize only gets classes)
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        //Run something before a request is handeled by the request handler
        //console.log('Im running befre the hanlder', context);

        return handler.handle().pipe(
            map((data: any) => {
                //Run something before the response is sent out
                //console.log('Im running before response is snet out', data);
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                })
            })
        )
    }

}