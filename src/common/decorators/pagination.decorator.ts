import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PaginationOptions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    let limit = query.limit;
    let page = query.page;
    const search = query.search;

    limit = limit > 0 ? limit : 10;
    page = page ? page : 1;

    return { limit, page, search };
  },
);
