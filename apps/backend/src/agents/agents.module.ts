import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { AIAgent } from '../domain/entities/ai-agent.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AIAgent])],
    controllers: [AgentsController],
    providers: [AgentsService],
    exports: [AgentsService],
})
export class AgentsModule {}
