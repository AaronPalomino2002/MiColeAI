import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity('options')
export class Option {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'question_id' })
    questionId: string;

    @ManyToOne(() => Question, (question) => question.options)
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @Column({ type: 'text' })
    content: string;

    @Column({ name: 'is_correct', type: 'boolean' })
    isCorrect: boolean;
}
