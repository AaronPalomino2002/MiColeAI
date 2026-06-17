import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeeklyTopicsController } from './weekly-topics.controller';
import { WeeklyTopicsService } from './weekly-topics.service';
import { WeeklyTopic } from '../domain/entities/weekly-topic.entity';

@Module({
    imports: [TypeOrmModule.forFeature([WeeklyTopic])],
    controllers: [WeeklyTopicsController],
    providers: [WeeklyTopicsService],
    exports: [WeeklyTopicsService],
})
export class WeeklyTopicsModule {}
