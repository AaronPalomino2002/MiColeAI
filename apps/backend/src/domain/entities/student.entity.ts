import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PlanType {
    FREE = 'free',
    PREMIUM = 'premium',
}

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // Hide password by default
    password: string;

    @Column({ name: 'first_name', nullable: true })
    firstName: string;

    @Column({ name: 'last_name', nullable: true })
    lastName: string;

    @Column({ nullable: true })
    school: string;

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
