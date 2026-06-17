import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ExamAttemptsService } from './exam-attempts.service';
import type { SubmitAttemptDto } from './exam-attempts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('exam-attempts')
@UseGuards(JwtAuthGuard)
export class ExamAttemptsController {
    constructor(private readonly service: ExamAttemptsService) {}

    @Post()
    start(@Req() req: any, @Body('examId') examId: string) {
        return this.service.start(req.user.userId, examId);
    }

    @Post(':id/submit')
    submit(@Req() req: any, @Param('id') id: string, @Body() dto: SubmitAttemptDto) {
        return this.service.submit(req.user.userId, id, dto);
    }

    @Get(':id')
    findResult(@Param('id') id: string) {
        return this.service.findResult(id);
    }

    @Get()
    findByStudent(@Req() req: any, @Query('studentId') studentId?: string) {
        return this.service.findByStudent(studentId ?? req.user.userId);
    }
}
