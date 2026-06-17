import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../domain/entities/school.entity';

export interface UpsertSchoolDto {
    name: string;
    academicYear: number;
    logoUrl?: string;
    district?: string;
}

@Injectable()
export class SchoolsService {
    constructor(
        @InjectRepository(School)
        private readonly schoolRepository: Repository<School>,
    ) {}

    create(dto: UpsertSchoolDto): Promise<School> {
        return this.schoolRepository.save(this.schoolRepository.create(dto));
    }

    async findOne(id: string): Promise<School> {
        const school = await this.schoolRepository.findOne({ where: { id } });
        if (!school) throw new NotFoundException('School not found');
        return school;
    }

    async update(id: string, dto: Partial<UpsertSchoolDto>): Promise<School> {
        const school = await this.findOne(id);
        Object.assign(school, dto);
        return this.schoolRepository.save(school);
    }
}
