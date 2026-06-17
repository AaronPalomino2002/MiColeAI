import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import type { UpsertSchoolDto } from './schools.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../domain/entities/user.entity';

@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DIRECTOR)
export class SchoolsController {
    constructor(private readonly schoolsService: SchoolsService) {}

    @Post()
    create(@Body() dto: UpsertSchoolDto) {
        return this.schoolsService.create(dto);
    }

    /** Colegio del usuario autenticado (director). */
    @Get('me')
    findMine(@Req() req: any) {
        return this.schoolsService.findOne(req.user.schoolId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.schoolsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<UpsertSchoolDto>) {
        return this.schoolsService.update(id, dto);
    }
}
