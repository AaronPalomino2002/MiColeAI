import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ExamAttempt } from './exam-attempt.entity';
import { Question } from './question.entity';
import { Option } from './option.entity';

@Entity('answers')
export class Answer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'attempt_id' })
    attemptId: string;

    @ManyToOne(() => ExamAttempt)
    @JoinColumn({ name: 'attempt_id' })
    attempt: ExamAttempt;

    @Column({ name: 'question_id' })
    questionId: string;

    @ManyToOne(() => Question)
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @Column({ name: 'selected_option_id', nullable: true })
    selectedOptionId: string;

    @ManyToOne(() => Option)
    @JoinColumn({ name: 'selected_option_id' })
    selectedOption: Option;

    @Column({ name: 'text_content', type: 'text', nullable: true })
    textContent: string;
}
