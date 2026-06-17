import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
    IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, ValidateNested, ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Exam, ExamType } from '../domain/entities/exam.entity';
import { Question } from '../domain/entities/question.entity';
import { Option } from '../domain/entities/option.entity';

export class CreateOptionDto {
    @IsString() content: string;
    @IsBoolean() isCorrect: boolean;
}

export class CreateQuestionDto {
    @IsString() content: string;
    @IsEnum(['multiple_choice', 'true_false']) type: 'multiple_choice' | 'true_false';
    @IsInt() @Min(1) points: number;

    @IsArray() @ArrayMinSize(2) @ValidateNested({ each: true }) @Type(() => CreateOptionDto)
    options: CreateOptionDto[];
}

export class CreateExamDto {
    @IsString() subjectId: string;
    @IsOptional() @IsString() topicId?: string;
    @IsOptional() @IsEnum(ExamType) type?: ExamType;
    @IsString() title: string;
    @IsOptional() @IsString() description?: string;
    @IsInt() @Min(1) timeLimitMinutes: number;
    @IsOptional() @IsString() difficulty?: string;
    @IsOptional() @IsString() scheduledFor?: string;

    @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];
}

@Injectable()
export class ExamsService {
    constructor(
        @InjectRepository(Exam)
        private readonly examRepository: Repository<Exam>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        private readonly dataSource: DataSource,
    ) {}

    async findAll(): Promise<Exam[]> {
        return this.examRepository.find({ relations: ['subject'] });
    }

    async findBySubject(subjectId: string): Promise<Exam[]> {
        return this.examRepository.find({
            where: { subjectId },
            relations: ['subject'],
        });
    }

    /** Examen para rendir: incluye preguntas y opciones SIN revelar la correcta. */
    async findOneForStudent(id: string) {
        const exam = await this.examRepository.findOne({
            where: { id },
            relations: ['subject'],
        });
        if (!exam) throw new NotFoundException('Exam not found');

        const questions = await this.questionRepository.find({
            where: { examId: id },
            relations: ['options'],
        });

        return {
            ...exam,
            questions: questions.map((q) => ({
                id: q.id,
                content: q.content,
                type: q.type,
                points: q.points,
                options: (q.options ?? []).map((o) => ({ id: o.id, content: o.content })),
            })),
        };
    }

    /** Crea examen + preguntas + opciones en una transacción. */
    async create(dto: CreateExamDto): Promise<Exam> {
        const totalPoints = dto.questions.reduce((sum, q) => sum + (q.points ?? 0), 0);

        return this.dataSource.transaction(async (manager) => {
            const exam = await manager.getRepository(Exam).save(
                manager.getRepository(Exam).create({
                    subjectId: dto.subjectId,
                    topicId: dto.topicId,
                    type: dto.type ?? ExamType.WEEKLY,
                    title: dto.title,
                    description: dto.description,
                    timeLimitMinutes: dto.timeLimitMinutes,
                    totalPoints,
                    difficulty: dto.difficulty ?? 'medium',
                    scheduledFor: dto.scheduledFor ? new Date(dto.scheduledFor) : undefined,
                }),
            );

            for (const q of dto.questions) {
                const question = await manager.getRepository(Question).save(
                    manager.getRepository(Question).create({
                        examId: exam.id,
                        content: q.content,
                        type: q.type,
                        points: q.points,
                    }),
                );

                await manager.getRepository(Option).save(
                    q.options.map((o) =>
                        manager.getRepository(Option).create({
                            questionId: question.id,
                            content: o.content,
                            isCorrect: o.isCorrect,
                        }),
                    ),
                );
            }

            return exam;
        });
    }
}
