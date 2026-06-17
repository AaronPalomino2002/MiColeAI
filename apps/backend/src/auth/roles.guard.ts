import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, AllowedRole } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<AllowedRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Sin @Roles → no se restringe por rol (sigue requiriendo JWT vía JwtAuthGuard).
        if (!required || required.length === 0) return true;

        const { user } = context.switchToHttp().getRequest();
        if (!user?.role || !required.includes(user.role)) {
            throw new ForbiddenException('Insufficient role');
        }
        return true;
    }
}
