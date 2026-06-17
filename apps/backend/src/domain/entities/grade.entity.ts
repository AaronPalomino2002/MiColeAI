import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { School } from './school.entity';
import { Section } from './section.entity';

@Entity('grades')
export class Grade {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'school_id' })
    schoolId: string;

    @ManyToOne(() => School)
    @JoinColumn({ name: 'school_id' })
    school: School;

    @Column()
    name: string; // "1° Secundaria"

    // Relación inversa: un grado tiene varias secciones.
    // Necesaria para `relations: ['sections']` en dashboard director y analytics.
    @OneToMany(() => Section, (section) => section.grade)
    sections: Section[];
}
