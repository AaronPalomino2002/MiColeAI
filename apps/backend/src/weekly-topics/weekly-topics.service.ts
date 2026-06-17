import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyTopic } from '../domain/entities/weekly-topic.entity';

export interface CreateWeeklyTopicDto {
    subjectId: string;
    teacherId?: string;
    name: string;
    weekNumber: number;
}

@Injectable()
export class WeeklyTopicsService {
    constructor(
        @InjectRepository(WeeklyTopic)
        private readonly topicRepository: Repository<WeeklyTopic>,
    ) {}

    async create(dto: CreateWeeklyTopicDto): Promise<WeeklyTopic> {
        const topic = this.topicRepository.create(dto);
        return this.topicRepository.save(topic);
    }

    async findBySubject(subjectId: string): Promise<WeeklyTopic[]> {
        return this.topicRepository.find({
            where: { subjectId },
            order: { weekNumber: 'ASC', createdAt: 'ASC' },
        });
    }
}
