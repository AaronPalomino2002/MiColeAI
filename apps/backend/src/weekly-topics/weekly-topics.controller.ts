import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { WeeklyTopicsService } from './weekly-topics.service';
import type { CreateWeeklyTopicDto } from './weekly-topics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../domain/entities/user.entity';

@Controller('weekly-topics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WeeklyTopicsController {
    constructor(private readonly weeklyTopicsService: WeeklyTopicsService) {}

    @Get()
    findBySubject(@Query('subjectId') subjectId: string) {
        return this.weeklyTopicsService.findBySubject(subjectId);
    }

    @Post()
    @Roles(UserRole.TEACHER, UserRole.DIRECTOR)
    create(@Req() req: any, @Body() dto: CreateWeeklyTopicDto) {
        // El docente autenticado queda como autor del tema.
        return this.weeklyTopicsService.create({ ...dto, teacherId: dto.teacherId ?? req.user.userId });
    }
}
