import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Injectable()
export class RolesGuard extends AuthGuard implements CanActivate {
  private readonly reflector: Reflector = new Reflector();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      return false;
    }

    const role = await user.role;

    return role && roles.includes(role.slug);
  }
}
