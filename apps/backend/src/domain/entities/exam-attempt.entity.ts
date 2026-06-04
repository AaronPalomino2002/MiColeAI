import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { Exam } from './exam.entity';

@Entity('exam_attempts')
export class ExamAttempt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'student_id' })
    studentId: string;

    @ManyToOne(() => Student)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @Column({ name: 'exam_id' })
    examId: string;

    @ManyToOne(() => Exam)
    @JoinColumn({ name: 'exam_id' })
    exam: Exam;

    @Column({ type: 'int', nullable: true })
    score: number;

    @CreateDateColumn({ name: 'started_at' })
    startedAt: Date;

    @Column({ name: 'completed_at', nullable: true })
    completedAt: Date;

    @Column({ name: 'time_spent_seconds', default: 0 })
    timeSpentSeconds: number;

    @Column({ name: 'ai_feedback_summary', type: 'text', nullable: true })
    aiFeedbackSummary: string;
}
