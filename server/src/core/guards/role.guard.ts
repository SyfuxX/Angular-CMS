import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../models/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly _reflector: Reflector,
    ) {
    }

    public canActivate(context: ExecutionContext): boolean {
        const requiredRole = this._reflector.getAllAndOverride<RoleEnum>('role', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRole) return true;

        const { user } = context.switchToHttp().getRequest();

        if (!user) return true;

        if (user.role === RoleEnum.Developer) return true;
        if (
            (requiredRole === RoleEnum.User || requiredRole === RoleEnum.Manager)
            && user.role === RoleEnum.Admin
        ) return true;
        if (
            requiredRole === RoleEnum.User
            && user.role === RoleEnum.Manager
        ) return true;

        return requiredRole === user.role;
    }
}
