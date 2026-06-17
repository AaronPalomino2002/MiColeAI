import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ExamAttempt } from '../domain/entities/exam-attempt.entity';
import { Answer } from '../domain/entities/answer.entity';
import { Message } from '../domain/entities/message.entity';
import { Grade } from '../domain/entities/grade.entity';
import { Student } from '../domain/entities/student.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ExamAttempt, Answer, Message, Grade, Student])],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    exports: [AnalyticsService],
})
export class AnalyticsModule {}
