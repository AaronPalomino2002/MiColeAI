import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { School } from './school.entity';
import { Section } from './section.entity';

export enum PlanType {
    FREE = 'free',
    PREMIUM = 'premium',
}

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Multi-tenant: el estudiante pertenece a un colegio.
    @Column({ name: 'school_id', nullable: true })
    schoolId: string;

    @ManyToOne(() => School)
    @JoinColumn({ name: 'school_id' })
    school: School;

    // Aula matriculada. Alimenta el dashboard del tutor.
    @Column({ name: 'section_id', nullable: true })
    sectionId: string;

    @ManyToOne(() => Section)
    @JoinColumn({ name: 'section_id' })
    section: Section;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // Hide password by default
    password: string;

    @Column({ name: 'first_name', nullable: true })
    firstName: string;

    @Column({ name: 'last_name', nullable: true })
    lastName: string;

    @Column({ nullable: true })
    district: string;

    // Texto libre heredado (mostrar nombre del colegio sin join). La relación
    // FK real es `school` arriba. Mantenido por compatibilidad de datos previos.
    @Column({ name: 'school_name', nullable: true })
    schoolName: string;

    @Column({ name: 'grade_level', nullable: true })
    gradeLevel: string;

    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl: string;

    @Column({
        name: 'plan_type',
        type: 'enum',
        enum: PlanType,
        default: PlanType.FREE,
    })
    planType: PlanType;

    @Column({ name: 'tokens_balance', default: 0 })
    tokensBalance: number;

    @Column({ name: 'streak_count', default: 0 })
    streakCount: number;

    @Column({ name: 'last_login_at', nullable: true })
    lastLoginAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
