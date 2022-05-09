import { CallHandler, ExecutionContext, Injectable } from "@nestjs/common";
import { map } from "rxjs";

@Injectable()
export class ResponseInterceptor {
    intercept(executionContect: ExecutionContext, next: CallHandler) {
        return next
            .handle()
            .pipe(
                map(
                    (data) => {
                        return {
                            status: executionContect.switchToHttp().getResponse().statusCode,
                            message: data.message,
                            data: data
                        }
                    }
                )
            )
            
    }

}