import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIAgent } from '../domain/entities/ai-agent.entity';
import { Subject } from '../domain/entities/subject.entity';

export interface CreateAgentDto {
    name: string;
    description: string;
    modelId: string;
    systemPrompt: string;
    iconName?: string;
    colorTheme?: string;
}

@Injectable()
export class AgentsService {
    constructor(
        @InjectRepository(AIAgent)
        private readonly agentRepository: Repository<AIAgent>,
        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,
    ) {}

    async findAll(): Promise<AIAgent[]> {
        return this.agentRepository.find({ relations: ['subject'] });
    }

    async findOne(id: string): Promise<AIAgent | null> {
        return this.agentRepository.findOne({ where: { id }, relations: ['subject'] });
    }

    async create(dto: CreateAgentDto): Promise<AIAgent> {
        const subject = await this.subjectRepository.save(
            this.subjectRepository.create({
                name: dto.name,
                description: dto.description,
                iconName: dto.iconName || 'smart_toy',
                colorTheme: dto.colorTheme || 'primary',
            }),
        );

        const agent = await this.agentRepository.save(
            this.agentRepository.create({
                name: dto.name,
                subjectId: subject.id,
                modelId: dto.modelId,
                systemPrompt: dto.systemPrompt,
            }),
        );

        return this.agentRepository.findOne({ where: { id: agent.id }, relations: ['subject'] }) as Promise<AIAgent>;
    }
}
