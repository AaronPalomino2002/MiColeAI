import { Controller, Get, Post, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import type { CreateGradeDto, CreateSectionDto, AssignTeacherSubjectDto } from './academics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../domain/entities/user.entity';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DIRECTOR)
export class AcademicsController {
    constructor(private readonly academicsService: AcademicsService) {}

    // ── Grados ────────────────────────────────────────────────────────────────
    @Post('grades')
    createGrade(@Req() req: any, @Body() dto: CreateGradeDto) {
        return this.academicsService.createGrade({ ...dto, schoolId: dto.schoolId ?? req.user.schoolId });
    }

    @Get('grades')
    findGrades(@Req() req: any, @Query('schoolId') schoolId?: string) {
        return this.academicsService.findGradesBySchool(schoolId ?? req.user.schoolId);
    }

    // ── Secciones ───────────────────────────────────────────────────────────
    @Post('sections')
    createSection(@Body() dto: CreateSectionDto) {
        return this.academicsService.createSection(dto);
    }

    @Get('sections')
    findSections(@Query('gradeId') gradeId: string) {
        return this.academicsService.findSectionsByGrade(gradeId);
    }

    @Patch('sections/:id/tutor')
    assignTutor(@Param('id') id: string, @Body('tutorId') tutorId: string) {
        return this.academicsService.assignTutor(id, tutorId);
    }

    // ── Docente ↔ Materia ──────────────────────────────────────────────────
    @Post('teacher-subjects')
    assignTeacherSubject(@Body() dto: AssignTeacherSubjectDto) {
        return this.academicsService.assignTeacherSubject(dto);
    }

    @Get('teacher-subjects')
    findByTeacher(@Query('teacherId') teacherId: string) {
        return this.academicsService.findSubjectsByTeacher(teacherId);
    }
}
