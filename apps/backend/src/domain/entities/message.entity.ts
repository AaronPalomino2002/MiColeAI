import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ChatSession } from './chat-session.entity';
import { WeeklyTopic } from './weekly-topic.entity';

export enum MessageSender {
    STUDENT = 'student',
    AGENT = 'agent',
}

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'session_id' })
    sessionId: string;

    @ManyToOne(() => ChatSession)
    @JoinColumn({ name: 'session_id' })
    session: ChatSession;

    // Tema consultado. Habilita la analítica de dudas por tema.
    @Column({ name: 'topic_id', nullable: true })
    topicId: string;

    @ManyToOne(() => WeeklyTopic)
    @JoinColumn({ name: 'topic_id' })
    topic: WeeklyTopic;

    @Column({
        type: 'enum',
        enum: MessageSender,
    })
    sender: MessageSender;

    @Column({ type: 'text' })
    content: string;

    // Control de consumo de tokens del modelo (solo respuestas del agente).
    @Column({ name: 'tokens_used', type: 'int', nullable: true })
    tokensUsed: number;

    @CreateDateColumn({ name: 'sent_at' })
    sentAt: Date;
}
