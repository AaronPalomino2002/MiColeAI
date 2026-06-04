import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../domain/entities/exam.entity';

@Injectable()
export class ExamsService {
    constructor(
        @InjectRepository(Exam)
        private readonly examRepository: Repository<Exam>,
    ) { }

    async findAll(): Promise<Exam[]> {
        return this.examRepository.find({ relations: ['subject'] });
    }

    async findBySubject(subjectId: string): Promise<Exam[]> {
        return this.examRepository.find({
            where: { subjectId },
            relations: ['subject'],
        });
    }

    async findOne(id: string): Promise<Exam | null> {
        return this.examRepository.findOne({
            where: { id },
            relations: ['subject'],
        });
    }
}
