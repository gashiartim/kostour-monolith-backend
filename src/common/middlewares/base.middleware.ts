import { Injectable, NestMiddleware, RequestMethod } from '@nestjs/common';

@Injectable()
export class BaseMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
  async resolve(): Promise<any> {
    return async (req, res, next) => {
      next();
    };
  }

  isExcludedRoute(excludedRoutes, req): boolean {
    return (
      excludedRoutes.filter((excludedRoute) => {
        return (
          excludedRoute.path == req._parsedUrl.path &&
          (excludedRoute.method === RequestMethod[req.method] ||
            req.method === RequestMethod.ALL)
        );
      }).length > 0
    );
  }
}
