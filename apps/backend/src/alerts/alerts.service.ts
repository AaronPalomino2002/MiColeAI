import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert, AlertType } from '../domain/entities/alert.entity';

export interface CreateAlertDto {
    studentId: string;
    tutorId: string;
    subjectId?: string;
    type: AlertType;
    description: string;
}

@Injectable()
export class AlertsService {
    constructor(
        @InjectRepository(Alert)
        private readonly alertRepository: Repository<Alert>,
    ) {}

    async create(dto: CreateAlertDto): Promise<Alert> {
        const alert = this.alertRepository.create(dto);
        return this.alertRepository.save(alert);
    }

    async resolve(id: string): Promise<Alert> {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) throw new NotFoundException('Alert not found');

        alert.resolved = true;
        alert.resolvedAt = new Date();
        return this.alertRepository.save(alert);
    }
}
