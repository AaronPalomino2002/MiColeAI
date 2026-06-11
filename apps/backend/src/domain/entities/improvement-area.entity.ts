import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ExamAttempt } from './exam-attempt.entity';
import { WeeklyTopic } from './weekly-topic.entity';

@Entity('improvement_areas')
export class ImprovementArea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'attempt_id' })
    attemptId: string;

    @ManyToOne(() => ExamAttempt)
    @JoinColumn({ name: 'attempt_id' })
    attempt: ExamAttempt;

    // Tema débil detectado. FK al eje analítico (nullable: temas ad-hoc).
    @Column({ name: 'topic_id', nullable: true })
    topicId: string;

    @ManyToOne(() => WeeklyTopic)
    @JoinColumn({ name: 'topic_id' })
    topic: WeeklyTopic;

    // Etiqueta libre del tema (compatibilidad / fallback cuando no hay topic_id).
    @Column({ name: 'topic_name' })
    topicName: string;

    @Column({ default: 'moderate' })
    priority: string;

    @Column({ name: 'ai_suggestion', type: 'text', nullable: true })
    aiSuggestion: string;
}
