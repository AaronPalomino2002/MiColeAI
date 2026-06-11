import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('student')
    getStudentDashboard(@Req() req: any) {
        return this.dashboardService.getStudentDashboard(req.user.userId);
    }

    @Get('tutor')
    getTutorDashboard(@Req() req: any) {
        return this.dashboardService.getTutorDashboard(req.user.userId);
    }

    @Get('teacher')
    getTeacherDashboard(@Req() req: any) {
        return this.dashboardService.getTeacherDashboard(req.user.userId);
    }

    @Get('director')
    getDirectorDashboard(@Req() req: any) {
        // schoolId viene del User.schoolId
        return this.dashboardService.getDirectorDashboard(req.user.schoolId);
    }
}
