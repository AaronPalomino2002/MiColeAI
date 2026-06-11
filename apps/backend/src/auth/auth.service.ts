import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Student } from '../domain/entities/student.entity';
import { User } from '../domain/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

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
            schoolName: school,
            gradeLevel,
        });

        const savedStudent = await this.studentRepository.save(student);
        const { password: _, ...result } = savedStudent;
        return result;
    }

    async login(email: string, pass: string) {
        // 1. Buscar en students (role = student)
        const student = await this.studentRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'firstName', 'lastName'],
        });

        if (student && await bcrypt.compare(pass, student.password)) {
            const payload = { sub: student.id, email: student.email, role: 'student' };
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: student.id,
                    email: student.email,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    role: 'student',
                },
            };
        }

        // 2. Buscar en users (director / tutor / teacher)
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'firstName', 'lastName', 'role'],
        });

        if (user && await bcrypt.compare(pass, user.password)) {
            const payload = { sub: user.id, email: user.email, role: user.role, schoolId: user.schoolId };
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            };
        }

        throw new UnauthorizedException('Invalid credentials');
    }

    async validateUser(payload: any) {
        if (payload.role === 'student') {
            return this.studentRepository.findOneBy({ id: payload.sub });
        }
        return this.userRepository.findOneBy({ id: payload.sub });
    }
}
