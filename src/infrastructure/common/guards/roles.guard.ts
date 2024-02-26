import { IJwtServicePayload } from '@domain/adapters/jwt.interface';
import { UserRole } from '@domain/aggregates/user.aggregate';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const HasRoles = (...roles: UserRole[]) =>
    SetMetadata(RolesGuard.key, roles);

@Injectable()
export class RolesGuard implements CanActivate {
    static key = 'user-role';
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            RolesGuard.key,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true;
        }

        const { user }: { user: IJwtServicePayload } = context
            .switchToHttp()
            .getRequest();

        return requiredRoles.some((role) => user?.role === role);
    }
}
