import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from '../domain/entities/grade.entity';
import { Section } from '../domain/entities/section.entity';
import { TeacherSubject } from '../domain/entities/teacher-subject.entity';

export interface CreateGradeDto {
    schoolId: string;
    name: string;
}
export interface CreateSectionDto {
    gradeId: string;
    name: string;
    tutorId?: string;
}
export interface AssignTeacherSubjectDto {
    teacherId: string;
    subjectId: string;
    isPrimary?: boolean;
}

@Injectable()
export class AcademicsService {
    constructor(
        @InjectRepository(Grade)
        private readonly gradeRepo: Repository<Grade>,
        @InjectRepository(Section)
        private readonly sectionRepo: Repository<Section>,
        @InjectRepository(TeacherSubject)
        private readonly teacherSubjectRepo: Repository<TeacherSubject>,
    ) {}

    // ── Grados ────────────────────────────────────────────────────────────────
    createGrade(dto: CreateGradeDto): Promise<Grade> {
        return this.gradeRepo.save(this.gradeRepo.create(dto));
    }

    findGradesBySchool(schoolId: string): Promise<Grade[]> {
        return this.gradeRepo.find({ where: { schoolId }, order: { name: 'ASC' } });
    }

    // ── Secciones ───────────────────────────────────────────────────────────
    createSection(dto: CreateSectionDto): Promise<Section> {
        return this.sectionRepo.save(this.sectionRepo.create(dto));
    }

    findSectionsByGrade(gradeId: string): Promise<Section[]> {
        return this.sectionRepo.find({
            where: { gradeId },
            relations: ['tutor'],
            order: { name: 'ASC' },
        });
    }

    async assignTutor(sectionId: string, tutorId: string): Promise<Section> {
        const section = await this.sectionRepo.findOne({ where: { id: sectionId } });
        if (!section) throw new NotFoundException('Section not found');
        section.tutorId = tutorId;
        return this.sectionRepo.save(section);
    }

    // ── Docente ↔ Materia ──────────────────────────────────────────────────
    assignTeacherSubject(dto: AssignTeacherSubjectDto): Promise<TeacherSubject> {
        return this.teacherSubjectRepo.save(this.teacherSubjectRepo.create(dto));
    }

    findSubjectsByTeacher(teacherId: string): Promise<TeacherSubject[]> {
        return this.teacherSubjectRepo.find({ where: { teacherId }, relations: ['subject'] });
    }
}
