import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.service';
import { UserRole } from '../domain/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DIRECTOR)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Req() req: any, @Body() dto: CreateUserDto) {
        // El staff se crea bajo el colegio del director autenticado.
        return this.usersService.create({ ...dto, schoolId: dto.schoolId ?? req.user.schoolId });
    }

    @Get()
    findBySchool(@Req() req: any, @Query('role') role?: UserRole) {
        return this.usersService.findBySchool(req.user.schoolId, role);
    }
}
