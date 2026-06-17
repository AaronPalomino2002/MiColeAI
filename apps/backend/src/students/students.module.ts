import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from '../domain/entities/student.entity';
import { Enrollment } from '../domain/entities/enrollment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Student, Enrollment])],
    controllers: [StudentsController],
    providers: [StudentsService],
    exports: [StudentsService],
})
export class StudentsModule {}
