import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('subjects')
export class Subject {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'icon_name', nullable: true })
    iconName: string;

    @Column({ name: 'color_theme', nullable: true })
    colorTheme: string;

    @Column({ name: 'total_lessons', default: 0 })
    totalLessons: number;
}
