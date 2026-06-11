import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { School } from './school.entity';

/**
 * Staff institucional: director, tutor y docente.
 *
 * NOTA: Los estudiantes se modelan en la entidad `Student` (gamificación,
 * matrícula, intentos de examen). `User` cubre los roles administrativos
 * que comparten email/password/nombre y cuelgan del colegio.
 */
export enum UserRole {
    DIRECTOR = 'director',
    TUTOR = 'tutor',
    TEACHER = 'teacher',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'school_id' })
    schoolId: string;

    @ManyToOne(() => School)
    @JoinColumn({ name: 'school_id' })
    school: School;

    @Column({
        type: 'enum',
        enum: UserRole,
    })
    role: UserRole;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // Hide password by default
    password: string;

    @Column({ name: 'first_name', nullable: true })
    firstName: string;

    @Column({ name: 'last_name', nullable: true })
    lastName: string;

    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl: string;

    @Column({ name: 'last_login_at', nullable: true })
    lastLoginAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
