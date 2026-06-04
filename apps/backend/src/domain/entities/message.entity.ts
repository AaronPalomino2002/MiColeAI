import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ChatSession } from './chat-session.entity';

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

    @Column({
        type: 'enum',
        enum: MessageSender,
    })
    sender: MessageSender;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn({ name: 'sent_at' })
    sentAt: Date;
}
