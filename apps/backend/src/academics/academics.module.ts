import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicsController } from './academics.controller';
import { AcademicsService } from './academics.service';
import { Grade } from '../domain/entities/grade.entity';
import { Section } from '../domain/entities/section.entity';
import { TeacherSubject } from '../domain/entities/teacher-subject.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Grade, Section, TeacherSubject])],
    controllers: [AcademicsController],
    providers: [AcademicsService],
    exports: [AcademicsService],
})
export class AcademicsModule {}
