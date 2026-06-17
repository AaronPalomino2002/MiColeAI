import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamAttempt } from '../domain/entities/exam-attempt.entity';
import { Answer } from '../domain/entities/answer.entity';
import { Message } from '../domain/entities/message.entity';
import { Grade } from '../domain/entities/grade.entity';
import { Student } from '../domain/entities/student.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(ExamAttempt)
        private readonly attemptRepo: Repository<ExamAttempt>,
        @InjectRepository(Answer)
        private readonly answerRepo: Repository<Answer>,
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,
        @InjectRepository(Grade)
        private readonly gradeRepo: Repository<Grade>,
        @InjectRepository(Student)
        private readonly studentRepo: Repository<Student>,
    ) {}

    /**
     * Serie temporal de promedio de notas por día.
     * Si se pasa studentId, filtra a ese estudiante; si no, agrega por colegio.
     */
    async performanceTimeline(opts: { studentId?: string; schoolId?: string }) {
        const qb = this.attemptRepo
            .createQueryBuilder('a')
            .select('DATE(a.completedAt)', 'date')
            .addSelect('AVG(a.score)', 'avgScore')
            .addSelect('COUNT(*)', 'attempts')
            .where('a.completedAt IS NOT NULL');

        if (opts.studentId) {
            qb.andWhere('a.studentId = :sid', { sid: opts.studentId });
        } else if (opts.schoolId) {
            qb.leftJoin('a.student', 'student').andWhere('student.schoolId = :school', { school: opts.schoolId });
        }

        const rows = await qb.groupBy('DATE(a.completedAt)').orderBy('date', 'ASC').getRawMany();

        return rows.map((r) => ({
            date: r.date,
            avgScore: Math.round(parseFloat(r.avgScore) || 0),
            attempts: parseInt(r.attempts, 10),
        }));
    }

    /** Preguntas más falladas de un examen (agregación sobre answers). */
    async examDifficulty(examId: string) {
        const rows = await this.answerRepo
            .createQueryBuilder('ans')
            .leftJoin('ans.attempt', 'attempt')
            .leftJoin('ans.question', 'question')
            .leftJoin('question.options', 'opt')
            .select('question.id', 'questionId')
            .addSelect('question.content', 'content')
            .addSelect('COUNT(ans.id)', 'total')
            .addSelect(
                'SUM(CASE WHEN ans.selectedOptionId = opt.id AND opt.isCorrect = true THEN 1 ELSE 0 END)',
                'correct',
            )
            .where('attempt.examId = :examId', { examId })
            .groupBy('question.id')
            .addGroupBy('question.content')
            .getRawMany();

        return rows
            .map((r) => {
                const total = parseInt(r.total, 10) || 0;
                const correct = parseInt(r.correct, 10) || 0;
                const failRate = total > 0 ? Math.round(((total - correct) / total) * 100) : 0;
                return { questionId: r.questionId, content: r.content, total, correct, failRate };
            })
            .sort((a, b) => b.failRate - a.failRate);
    }

    /** Temas que más dudas generan (agrupación de mensajes de estudiantes por tema). */
    async frequentDoubts(subjectId?: string) {
        const qb = this.messageRepo
            .createQueryBuilder('m')
            .leftJoin('m.topic', 'topic')
            .select('topic.id', 'topicId')
            .addSelect('topic.name', 'topicName')
            .addSelect('COUNT(*)', 'doubts')
            .where("m.sender = 'student'")
            .andWhere('topic.id IS NOT NULL');

        if (subjectId) qb.andWhere('topic.subjectId = :subjectId', { subjectId });

        const rows = await qb
            .groupBy('topic.id')
            .addGroupBy('topic.name')
            .orderBy('doubts', 'DESC')
            .limit(10)
            .getRawMany();

        return rows.map((r) => ({ topicId: r.topicId, topicName: r.topicName, doubts: parseInt(r.doubts, 10) }));
    }

    /** Comparativo de promedio por grado dentro de un colegio. */
    async compareGrades(schoolId: string) {
        const grades = await this.gradeRepo.find({ where: { schoolId }, relations: ['sections'], order: { name: 'ASC' } });

        return Promise.all(
            grades.map(async (grade) => {
                const sectionIds = (grade as any).sections?.map((s: any) => s.id) ?? [];
                if (sectionIds.length === 0) return { gradeId: grade.id, name: grade.name, avgScore: null };

                const studentRows = await this.studentRepo
                    .createQueryBuilder('s')
                    .select('s.id', 'id')
                    .where('s.sectionId IN (:...ids)', { ids: sectionIds })
                    .getRawMany();
                const studentIds = studentRows.map((s) => s.id);
                if (studentIds.length === 0) return { gradeId: grade.id, name: grade.name, avgScore: null };

                const raw = await this.attemptRepo
                    .createQueryBuilder('a')
                    .select('AVG(a.score)', 'avg')
                    .where('a.studentId IN (:...ids)', { ids: studentIds })
                    .andWhere('a.completedAt IS NOT NULL')
                    .getRawOne();

                return {
                    gradeId: grade.id,
                    name: grade.name,
                    avgScore: raw?.avg ? Math.round(parseFloat(raw.avg)) : null,
                };
            }),
        );
    }
}
