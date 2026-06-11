import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { User } from './user.entity';
import { Subject } from './subject.entity';

export enum AlertType {
    LOW_PERFORMANCE = 'low_performance',
    PERFORMANCE_DROP = 'performance_drop',
    INACTIVITY = 'inactivity',
    UPCOMING_EXAM = 'upcoming_exam',
}

/**
 * Sistema de alertas tempranas (diferenciador del producto).
 * Vincula al estudiante observado con el tutor que debe intervenir.
 */
@Entity('alerts')
export class Alert {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Estudiante observado.
    @Column({ name: 'student_id' })
    studentId: string;

    @ManyToOne(() => Student)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    // Tutor notificado (User role=tutor).
    @Column({ name: 'tutor_id' })
    tutorId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'tutor_id' })
    tutor: User;

    // Materia afectada (nullable: la inactividad puede ser global).
    @Column({ name: 'subject_id', nullable: true })
    subjectId: string;

    @ManyToOne(() => Subject)
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

    @Column({
        type: 'enum',
        enum: AlertType,
    })
    type: AlertType;

    @Column({ type: 'text' })
    description: string;

    @Column({ default: false })
    resolved: boolean;

    @Column({ name: 'resolved_at', nullable: true })
    resolvedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
