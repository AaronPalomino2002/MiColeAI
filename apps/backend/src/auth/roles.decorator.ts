import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../domain/entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * Restringe un handler/controlador a uno o más roles.
 * 'student' no está en UserRole (vive en la entidad Student); se admite como string.
 */
export type AllowedRole = UserRole | 'student';

export const Roles = (...roles: AllowedRole[]) => SetMetadata(ROLES_KEY, roles);
