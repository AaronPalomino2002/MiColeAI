import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../domain/entities/user.entity';

export class CreateUserDto {
    @IsOptional() @IsString()
    schoolId: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsEmail()
    email: string;

    @IsString() @MinLength(6)
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
        const existing = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email already registered');

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({ ...dto, password: hashedPassword });

        const saved = await this.userRepository.save(user);
        const { password: _, ...result } = saved;
        return result;
    }

    async findBySchool(schoolId: string, role?: UserRole): Promise<Omit<User, 'password'>[]> {
        const where = role ? { schoolId, role } : { schoolId };
        return this.userRepository.find({ where, order: { lastName: 'ASC' } });
    }
}
