import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { AIAgent } from './ai-agent.entity';

@Entity('chat_sessions')
export class ChatSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'student_id' })
    studentId: string;

    @ManyToOne(() => Student)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @Column({ name: 'agent_id' })
    agentId: string;

    @ManyToOne(() => AIAgent)
    @JoinColumn({ name: 'agent_id' })
    agent: AIAgent;

    @Column({ name: 'last_interaction', nullable: true })
    lastInteraction: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
