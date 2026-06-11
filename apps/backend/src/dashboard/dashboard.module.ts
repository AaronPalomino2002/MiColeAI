import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Student } from '../domain/entities/student.entity';
import { Alert } from '../domain/entities/alert.entity';
import { ExamAttempt } from '../domain/entities/exam-attempt.entity';
import { Message } from '../domain/entities/message.entity';
import { WeeklyTopic } from '../domain/entities/weekly-topic.entity';
import { Subject } from '../domain/entities/subject.entity';
import { Grade } from '../domain/entities/grade.entity';
import { ImprovementArea } from '../domain/entities/improvement-area.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Student,
            Alert,
            ExamAttempt,
            Message,
            WeeklyTopic,
            Subject,
            Grade,
            ImprovementArea,
        ]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
