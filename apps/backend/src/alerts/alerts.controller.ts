import { Controller, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import type { CreateAlertDto } from './alerts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../domain/entities/user.entity';

@Controller('alerts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TUTOR, UserRole.DIRECTOR)
export class AlertsController {
    constructor(private readonly alertsService: AlertsService) {}

    @Post()
    create(@Body() dto: CreateAlertDto) {
        return this.alertsService.create(dto);
    }

    @Patch(':id/resolve')
    resolve(@Param('id') id: string) {
        return this.alertsService.resolve(id);
    }
}
