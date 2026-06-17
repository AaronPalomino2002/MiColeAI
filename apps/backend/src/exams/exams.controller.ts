import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../domain/entities/user.entity';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
    constructor(private readonly examsService: ExamsService) { }

    @Get()
    async findAll() {
        return this.examsService.findAll();
    }

    @Get('subject/:subjectId')
    async findBySubject(@Param('subjectId') subjectId: string) {
        return this.examsService.findBySubject(subjectId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        // Vista para rendir: incluye preguntas/opciones sin marcar la correcta.
        return this.examsService.findOneForStudent(id);
    }

    @Post()
    @Roles(UserRole.TEACHER, UserRole.DIRECTOR)
    async create(@Body() dto: CreateExamDto) {
        return this.examsService.create(dto);
    }
}
