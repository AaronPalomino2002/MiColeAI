import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { WeeklyTopic } from './weekly-topic.entity';

export enum ExamType {
    DAILY = 'daily',     // Temas del día
    WEEKLY = 'weekly',   // Temas semanales
    MOCK = 'mock',       // Simulacro
    ADAPTIVE = 'adaptive', // Adaptativa según errores frecuentes
}

@Entity('exams')
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'subject_id' })
    subjectId: string;

    @ManyToOne(() => Subject)
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

    // Tema evaluado. Nullable en simulacros integrales. Eje analítico.
    @Column({ name: 'topic_id', nullable: true })
    topicId: string;

    @ManyToOne(() => WeeklyTopic)
    @JoinColumn({ name: 'topic_id' })
    topic: WeeklyTopic;

    @Column({
        type: 'enum',
        enum: ExamType,
        default: ExamType.WEEKLY,
    })
    type: ExamType;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'time_limit_minutes', type: 'int' })
    timeLimitMinutes: number;

    @Column({ name: 'total_points', type: 'int' })
    totalPoints: number;

    @Column({ default: 'medium' })
    difficulty: string;

    // Fecha programada. Alimenta "Próximos exámenes" del dashboard del estudiante.
    @Column({ name: 'scheduled_for', type: 'date', nullable: true })
    scheduledFor: Date;
}
