import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { ChatSession } from '../domain/entities/chat-session.entity';
import { Message, MessageSender } from '../domain/entities/message.entity';
import { AIAgent } from '../domain/entities/ai-agent.entity';

@Injectable()
export class ChatService {
    private readonly openai: OpenAI;

    constructor(
        @InjectRepository(ChatSession)
        private readonly chatSessionRepository: Repository<ChatSession>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(AIAgent)
        private readonly agentRepository: Repository<AIAgent>,
    ) {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async createSession(studentId: string, agentId: string): Promise<ChatSession> {
        const session = this.chatSessionRepository.create({ studentId, agentId });
        return this.chatSessionRepository.save(session);
    }

    async findSessionsByStudent(studentId: string): Promise<ChatSession[]> {
        return this.chatSessionRepository.find({
            where: { studentId },
            relations: ['agent'],
        });
    }

    async findMessagesBySession(sessionId: string): Promise<Message[]> {
        return this.messageRepository.find({
            where: { sessionId },
            order: { sentAt: 'ASC' },
        });
    }

    async sendStudentMessage(
        sessionId: string,
        content: string,
        imageFile?: Express.Multer.File,
    ): Promise<Message> {
        console.log('[sendStudentMessage] sessionId:', sessionId, 'content:', content, 'hasImage:', !!imageFile);

        const session = await this.chatSessionRepository.findOne({ where: { id: sessionId } });
        if (!session) throw new NotFoundException('Session not found');

        const agent = await this.agentRepository.findOne({ where: { id: session.agentId } });
        if (!agent) throw new NotFoundException('Agent not found');

        // Convert image to base64 data URL if present
        let imageDataUrl: string | undefined;
        if (imageFile) {
            const b64 = imageFile.buffer.toString('base64');
            imageDataUrl = `data:${imageFile.mimetype};base64,${b64}`;
        }

        // Persist student message — store imageDataUrl in JSON if present
        const studentContent = imageDataUrl
            ? JSON.stringify({ text: content, imageUrl: imageDataUrl })
            : content;

        await this.messageRepository.save(
            this.messageRepository.create({
                sessionId,
                sender: MessageSender.STUDENT,
                content: studentContent,
            }),
        );

        // Build full message history for OpenAI
        const history = await this.messageRepository.find({
            where: { sessionId },
            order: { sentAt: 'ASC' },
        });

        const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: agent.systemPrompt },
            ...history.map((m) => {
                if (m.sender === MessageSender.AGENT) {
                    return { role: 'assistant' as const, content: m.content };
                }
                try {
                    const parsed = JSON.parse(m.content) as { text: string; imageUrl: string };
                    // Only send image to OpenAI if it's a base64 data URL (not localhost)
                    if (parsed.imageUrl && parsed.imageUrl.startsWith('data:')) {
                        return {
                            role: 'user' as const,
                            content: [
                                { type: 'text' as const, text: parsed.text || '' },
                                { type: 'image_url' as const, image_url: { url: parsed.imageUrl } },
                            ],
                        };
                    }
                    // Image URL not usable by OpenAI — send text only
                    if (parsed.text) {
                        return { role: 'user' as const, content: parsed.text };
                    }
                } catch {
                    // plain text
                }
                return { role: 'user' as const, content: m.content };
            }),
        ];

        let completion: OpenAI.Chat.ChatCompletion;
        try {
            completion = await this.openai.chat.completions.create({
                model: agent.modelId || 'gpt-4o-mini',
                messages: openaiMessages,
            });
        } catch (err: any) {
            console.error('OpenAI error:', err?.status, err?.message, JSON.stringify(err?.error));
            throw err;
        }

        const aiContent = completion.choices[0].message.content ?? '';

        const saved = await this.messageRepository.save(
            this.messageRepository.create({
                sessionId,
                sender: MessageSender.AGENT,
                content: aiContent,
            }),
        );

        await this.chatSessionRepository.update(sessionId, { lastInteraction: new Date() });

        return saved;
    }
}
