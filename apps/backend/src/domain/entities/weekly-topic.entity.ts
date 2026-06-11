import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { User } from './user.entity';

/**
 * Tema semanal registrado por un docente.
 *
 * Es el EJE ANALÍTICO del producto: chat (Message), exámenes (Exam) y áreas de
 * mejora (ImprovementArea) se anclan a un topic para responder
 * "¿qué tema genera más dudas / peor desempeño?".
 */
@Entity('weekly_topics')
export class WeeklyTopic {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'subject_id' })
    subjectId: string;

    @ManyToOne(() => Subject)
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

    // Docente que registró el tema (User role=teacher).
    @Column({ name: 'teacher_id', nullable: true })
    teacherId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'teacher_id' })
    teacher: User;

    @Column()
    name: string; // "Factorización"

    @Column({ name: 'week_number', type: 'int' })
    weekNumber: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
