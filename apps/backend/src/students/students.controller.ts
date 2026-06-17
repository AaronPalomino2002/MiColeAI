import { Controller, Get, Post, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './students.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../domain/entities/user.entity';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DIRECTOR, UserRole.TUTOR)
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) {}

    @Post()
    create(@Req() req: any, @Body() dto: CreateStudentDto) {
        return this.studentsService.create({ ...dto, schoolId: dto.schoolId ?? req.user.schoolId });
    }

    @Get()
    findBySection(@Query('sectionId') sectionId: string) {
        return this.studentsService.findBySection(sectionId);
    }

    @Patch(':id/section')
    assignSection(@Param('id') id: string, @Body('sectionId') sectionId: string) {
        return this.studentsService.assignSection(id, sectionId);
    }

    // ── Matrículas ────────────────────────────────────────────────────────────
    @Post(':id/enrollments')
    enroll(@Param('id') id: string, @Body('subjectId') subjectId: string) {
        return this.studentsService.enroll(id, subjectId);
    }

    @Get(':id/enrollments')
    findEnrollments(@Param('id') id: string) {
        return this.studentsService.findEnrollments(id);
    }
}
