import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Subject } from './subject.entity';

@Entity('ai_agents')
export class AIAgent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'subject_id' })
    subjectId: string;

    @OneToOne(() => Subject)
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

    @Column()
    name: string;

    @Column({ name: 'model_id' })
    modelId: string;

    @Column({ name: 'system_prompt', type: 'text' })
    systemPrompt: string;

    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl: string;
}
