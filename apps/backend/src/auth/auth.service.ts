import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Student } from '../domain/entities/student.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        private readonly jwtService: JwtService,
    ) { }

    async register(studentData: any) {
        const { email, password, firstName, lastName, school, gradeLevel } = studentData;

        const existingStudent = await this.studentRepository.findOne({ where: { email } });
        if (existingStudent) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = this.studentRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            school,
            gradeLevel,
        });

        const savedStudent = await this.studentRepository.save(student);

        // Remove password from response
        const { password: _, ...result } = savedStudent;
        return result;
    }

    async login(email: string, pass: string) {
        const student = await this.studentRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'firstName', 'lastName'],
        });

        if (!student || !(await bcrypt.compare(pass, student.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: student.id, email: student.email };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: student.id,
                email: student.email,
                firstName: student.firstName,
                lastName: student.lastName,
            },
        };
    }

    async validateUser(payload: any) {
        return this.studentRepository.findOneBy({ id: payload.sub });
    }
}
