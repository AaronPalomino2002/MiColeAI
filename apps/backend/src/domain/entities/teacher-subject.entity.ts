import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Subject } from './subject.entity';

/**
 * Relación N:M entre docentes (User role=teacher) y materias.
 * `isPrimary` marca al docente principal de la materia.
 */
@Entity('teacher_subjects')
export class TeacherSubject {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'teacher_id' })
    teacherId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'teacher_id' })
    teacher: User;

    @Column({ name: 'subject_id' })
    subjectId: string;

    @ManyToOne(() => Subject)
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

    @Column({ name: 'is_primary', default: false })
    isPrimary: boolean;
}
