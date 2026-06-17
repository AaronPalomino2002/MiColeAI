import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { Exam } from '../domain/entities/exam.entity';
import { Question } from '../domain/entities/question.entity';
import { Option } from '../domain/entities/option.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Exam, Question, Option])],
    controllers: [ExamsController],
    providers: [ExamsService],
    exports: [ExamsService],
})
export class ExamsModule { }
