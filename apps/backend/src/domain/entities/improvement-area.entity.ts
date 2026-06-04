import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ExamAttempt } from './exam-attempt.entity';

@Entity('improvement_areas')
export class ImprovementArea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'attempt_id' })
    attemptId: string;

    @ManyToOne(() => ExamAttempt)
    @JoinColumn({ name: 'attempt_id' })
    attempt: ExamAttempt;

    @Column({ name: 'topic_name' })
    topicName: string;

    @Column({ default: 'moderate' })
    priority: string;

    @Column({ name: 'ai_suggestion', type: 'text', nullable: true })
    aiSuggestion: string;
}
