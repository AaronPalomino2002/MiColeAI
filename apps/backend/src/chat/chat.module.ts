import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatSession } from '../domain/entities/chat-session.entity';
import { Message } from '../domain/entities/message.entity';
import { AIAgent } from '../domain/entities/ai-agent.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ChatSession, Message, AIAgent])],
    controllers: [ChatController],
    providers: [ChatService],
    exports: [ChatService],
})
export class ChatModule {}
