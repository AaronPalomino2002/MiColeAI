import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('exams')
@UseGuards(JwtAuthGuard)
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
        return this.examsService.findOne(id);
    }
}
