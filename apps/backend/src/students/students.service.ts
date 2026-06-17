import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Student } from '../domain/entities/student.entity';
import { Enrollment } from '../domain/entities/enrollment.entity';

export class CreateStudentDto {
    @IsOptional() @IsString() schoolId?: string;
    @IsOptional() @IsString() sectionId?: string;
    @IsEmail() email: string;
    @IsString() @MinLength(6) password: string;
    @IsString() firstName: string;
    @IsString() lastName: string;
    @IsOptional() @IsString() district?: string;
}

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepo: Repository<Student>,
        @InjectRepository(Enrollment)
        private readonly enrollmentRepo: Repository<Enrollment>,
    ) {}

    async create(dto: CreateStudentDto): Promise<Omit<Student, 'password'>> {
        const existing = await this.studentRepo.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email already registered');

        const password = await bcrypt.hash(dto.password, 10);
        const saved = await this.studentRepo.save(this.studentRepo.create({ ...dto, password }));
        const { password: _, ...result } = saved;
        return result;
    }

    findBySection(sectionId: string): Promise<Student[]> {
        return this.studentRepo.find({ where: { sectionId }, order: { lastName: 'ASC' } });
    }

    async assignSection(studentId: string, sectionId: string): Promise<Student> {
        const student = await this.studentRepo.findOne({ where: { id: studentId } });
        if (!student) throw new NotFoundException('Student not found');
        student.sectionId = sectionId;
        return this.studentRepo.save(student);
    }

    // ── Matrículas ────────────────────────────────────────────────────────────
    enroll(studentId: string, subjectId: string): Promise<Enrollment> {
        return this.enrollmentRepo.save(this.enrollmentRepo.create({ studentId, subjectId, status: 'active' }));
    }

    findEnrollments(studentId: string): Promise<Enrollment[]> {
        return this.enrollmentRepo.find({ where: { studentId }, relations: ['subject'] });
    }
}
