import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Subject } from './subject.entity';

@Entity('exams')
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'subject_id' })
    subjectId: string;

    @ManyToOne(() => Subject)
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

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
}
