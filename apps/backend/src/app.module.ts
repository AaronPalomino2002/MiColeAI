import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ExamsModule } from './exams/exams.module';
import { ChatModule } from './chat/chat.module';
import { AgentsModule } from './agents/agents.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AlertsModule } from './alerts/alerts.module';
import { WeeklyTopicsModule } from './weekly-topics/weekly-topics.module';
import { UsersModule } from './users/users.module';
import { ExamAttemptsModule } from './exam-attempts/exam-attempts.module';
import { SchoolsModule } from './schools/schools.module';
import { AcademicsModule } from './academics/academics.module';
import { StudentsModule } from './students/students.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'project_moon',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only for development
    }),
    AuthModule,
    SubjectsModule,
    ExamsModule,
    ChatModule,
    AgentsModule,
    DashboardModule,
    AlertsModule,
    WeeklyTopicsModule,
    UsersModule,
    ExamAttemptsModule,
    SchoolsModule,
    AcademicsModule,
    StudentsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
