import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Grade } from './grade.entity';
import { User } from './user.entity';

@Entity('sections')
export class Section {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'grade_id' })
    gradeId: string;

    @ManyToOne(() => Grade)
    @JoinColumn({ name: 'grade_id' })
    grade: Grade;

    // Tutor a cargo del aula (User role=tutor). Nullable hasta asignación.
    @Column({ name: 'tutor_id', nullable: true })
    tutorId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'tutor_id' })
    tutor: User;

    @Column()
    name: string; // "A", "B", "C"
}
