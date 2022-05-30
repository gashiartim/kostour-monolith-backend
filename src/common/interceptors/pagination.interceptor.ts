import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    let page = req.query.page;
    let limit = req.query.limit;

    limit = limit > 0 ? limit : 10;
    page = page ? page : 1;

    return next.handle().pipe(
      map((data) => {
        const results = data[0];
        const totalNumber = data[1];

        return {
          data: results,
          total: totalNumber,
          lastPage: Math.ceil(totalNumber / limit),
          currentPage: Number(page),
          perPage: Number(limit),
        };
      })
    );
  }
}
