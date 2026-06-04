import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../domain/entities/subject.entity';

@Injectable()
export class SubjectsService {
    constructor(
        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,
    ) { }

    async findAll(): Promise<Subject[]> {
        return this.subjectRepository.find();
    }

    async findOne(id: string): Promise<Subject | null> {
        return this.subjectRepository.findOne({ where: { id } });
    }
}
