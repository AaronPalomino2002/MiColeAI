import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Exam } from './exam.entity';
import { Option } from './option.entity';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'exam_id' })
    examId: string;

    @ManyToOne(() => Exam)
    @JoinColumn({ name: 'exam_id' })
    exam: Exam;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'enum', enum: ['multiple_choice', 'true_false'] })
    type: string;

    @Column({ type: 'int' })
    points: number;

    @OneToMany(() => Option, (option) => option.question)
    options: Option[];
}
