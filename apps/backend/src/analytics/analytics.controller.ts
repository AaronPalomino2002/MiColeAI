import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../domain/entities/user.entity';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    // Sin @Roles: disponible para cualquier usuario autenticado (estudiante ve su propia línea).
    @Get('performance-timeline')
    timeline(@Req() req: any, @Query('studentId') studentId?: string) {
        if (req.user.role === 'student') {
            return this.analyticsService.performanceTimeline({ studentId: req.user.userId });
        }
        return this.analyticsService.performanceTimeline({ studentId, schoolId: req.user.schoolId });
    }

    @Get('exam/:examId')
    @Roles(UserRole.DIRECTOR, UserRole.TEACHER)
    examDifficulty(@Param('examId') examId: string) {
        return this.analyticsService.examDifficulty(examId);
    }

    @Get('frequent-doubts')
    @Roles(UserRole.DIRECTOR, UserRole.TEACHER)
    frequentDoubts(@Query('subjectId') subjectId?: string) {
        return this.analyticsService.frequentDoubts(subjectId);
    }

    @Get('compare-grades')
    @Roles(UserRole.DIRECTOR)
    compareGrades(@Req() req: any) {
        return this.analyticsService.compareGrades(req.user.schoolId);
    }
}
