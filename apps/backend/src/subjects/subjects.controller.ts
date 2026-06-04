import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) { }

    @Get()
    async findAll() {
        return this.subjectsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.subjectsService.findOne(id);
    }
}
