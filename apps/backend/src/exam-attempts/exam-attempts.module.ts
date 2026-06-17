import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamAttemptsController } from './exam-attempts.controller';
import { ExamAttemptsService } from './exam-attempts.service';
import { ExamAttempt } from '../domain/entities/exam-attempt.entity';
import { Answer } from '../domain/entities/answer.entity';
import { Question } from '../domain/entities/question.entity';
import { Option } from '../domain/entities/option.entity';
import { Exam } from '../domain/entities/exam.entity';
import { ImprovementArea } from '../domain/entities/improvement-area.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ExamAttempt, Answer, Question, Option, Exam, ImprovementArea]),
    ],
    controllers: [ExamAttemptsController],
    providers: [ExamAttemptsService],
    exports: [ExamAttemptsService],
})
export class ExamAttemptsModule {}
