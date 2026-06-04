import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIAgent } from '../domain/entities/ai-agent.entity';

@Injectable()
export class AgentsService {
    constructor(
        @InjectRepository(AIAgent)
        private readonly agentRepository: Repository<AIAgent>,
    ) {}

    async findAll(): Promise<AIAgent[]> {
        return this.agentRepository.find({ relations: ['subject'] });
    }

    async findOne(id: string): Promise<AIAgent | null> {
        return this.agentRepository.findOne({ where: { id }, relations: ['subject'] });
    }
}
