import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Student } from '../domain/entities/student.entity';
import { Alert } from '../domain/entities/alert.entity';
import { ExamAttempt } from '../domain/entities/exam-attempt.entity';
import { Message } from '../domain/entities/message.entity';
import { WeeklyTopic } from '../domain/entities/weekly-topic.entity';
import { Subject } from '../domain/entities/subject.entity';
import { Grade } from '../domain/entities/grade.entity';
import { ImprovementArea } from '../domain/entities/improvement-area.entity';
import { User, UserRole } from '../domain/entities/user.entity';
import { TeacherSubject } from '../domain/entities/teacher-subject.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepo: Repository<Student>,
        @InjectRepository(Alert)
        private readonly alertRepo: Repository<Alert>,
        @InjectRepository(ExamAttempt)
        private readonly attemptRepo: Repository<ExamAttempt>,
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,
        @InjectRepository(WeeklyTopic)
        private readonly topicRepo: Repository<WeeklyTopic>,
        @InjectRepository(Subject)
        private readonly subjectRepo: Repository<Subject>,
        @InjectRepository(Grade)
        private readonly gradeRepo: Repository<Grade>,
        @InjectRepository(ImprovementArea)
        private readonly improvementRepo: Repository<ImprovementArea>,
    ) {}

    // ── STUDENT DASHBOARD ────────────────────────────────────────────────────

    async getStudentDashboard(studentId: string) {
        const student = await this.studentRepo.findOne({
            where: { id: studentId },
            relations: ['section', 'section.grade'],
        });

        // Progreso por materia: promedio de notas agrupado por subject
        const attempts = await this.attemptRepo
            .createQueryBuilder('a')
            .leftJoinAndSelect('a.exam', 'exam')
            .leftJoinAndSelect('exam.subject', 'subject')
            .where('a.studentId = :studentId', { studentId })
            .andWhere('a.completedAt IS NOT NULL')
            .orderBy('a.completedAt', 'DESC')
            .getMany();

        const subjectMap = new Map<string, { name: string; icon: string; color: string; scores: number[] }>();
        for (const att of attempts) {
            const s = att.exam?.subject;
            if (!s) continue;
            if (!subjectMap.has(s.id)) {
                subjectMap.set(s.id, { name: s.name, icon: s.iconName ?? 'book', color: s.colorTheme ?? '#2b8dee', scores: [] });
            }
            subjectMap.get(s.id)!.scores.push(att.score ?? 0);
        }

        const subjectProgress = [...subjectMap.entries()].map(([id, v]) => ({
            subjectId: id,
            name: v.name,
            icon: v.icon,
            color: v.color,
            avgScore: Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length),
            totalAttempts: v.scores.length,
        }));

        // Próximos exámenes (desde hoy)
        const upcomingExams = await this.attemptRepo.manager
            .getRepository('Exam')
            .createQueryBuilder('e')
            .leftJoinAndSelect('e.subject', 'subject')
            .where('e.scheduledFor >= CURDATE()')
            .orderBy('e.scheduledFor', 'ASC')
            .limit(5)
            .getMany();

        // Áreas de mejora recientes
        const improvements = await this.improvementRepo
            .createQueryBuilder('i')
            .leftJoinAndSelect('i.topic', 'topic')
            .leftJoinAndSelect('i.attempt', 'attempt')
            .where('attempt.studentId = :studentId', { studentId })
            .orderBy('attempt.completedAt', 'DESC')
            .limit(3)
            .getMany();

        // Stats: racha y tokens del propio student
        return {
            student: {
                firstName: student?.firstName,
                lastName: student?.lastName,
                streakCount: student?.streakCount ?? 0,
                tokensBalance: student?.tokensBalance ?? 0,
                section: student?.section
                    ? `${student.section.grade?.name ?? ''} ${student.section.name}`
                    : null,
            },
            subjectProgress,
            upcomingExams: upcomingExams.map((e: any) => ({
                id: e.id,
                title: e.title,
                type: e.type,
                scheduledFor: e.scheduledFor,
                subject: { name: e.subject?.name, icon: e.subject?.iconName, color: e.subject?.colorTheme },
            })),
            improvements: improvements.map((i) => ({
                topicName: i.topic?.name ?? i.topicName,
                priority: i.priority,
                aiSuggestion: i.aiSuggestion,
            })),
        };
    }

    // ── TUTOR DASHBOARD ───────────────────────────────────────────────────────

    async getTutorDashboard(tutorId: string) {
        // Encontrar la sección del tutor
        const section = await this.studentRepo.manager
            .getRepository('Section')
            .findOne({ where: { tutorId }, relations: ['grade'] });

        if (!section) return { section: null, stats: null, students: [], alerts: [] };

        const students = await this.studentRepo.find({
            where: { sectionId: section.id },
            order: { lastName: 'ASC' },
        });

        const studentIds = students.map((s) => s.id);

        // Alertas activas del aula
        const alerts = await this.alertRepo.find({
            where: { tutorId, resolved: false },
            relations: ['student', 'subject'],
            order: { createdAt: 'DESC' },
        });

        // Última actividad por estudiante (último mensaje)
        const lastMessages = studentIds.length
            ? await this.messageRepo
                .createQueryBuilder('m')
                .leftJoin('m.session', 'session')
                .select(['session.studentId as studentId', 'MAX(m.sentAt) as lastActivity'])
                .where('session.studentId IN (:...ids)', { ids: studentIds })
                .groupBy('session.studentId')
                .getRawMany()
            : [];

        const activityMap = new Map(lastMessages.map((r) => [r.studentId, r.lastActivity]));
        const inactiveThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 días

        // Promedio de notas por estudiante
        const avgScores = studentIds.length
            ? await this.attemptRepo
                .createQueryBuilder('a')
                .select(['a.studentId as studentId', 'AVG(a.score) as avgScore'])
                .where('a.studentId IN (:...ids)', { ids: studentIds })
                .andWhere('a.completedAt IS NOT NULL')
                .groupBy('a.studentId')
                .getRawMany()
            : [];

        const scoreMap = new Map(avgScores.map((r) => [r.studentId, Math.round(parseFloat(r.avgScore) || 0)]));
        const riskStudentIds = new Set(alerts.map((a) => a.studentId));

        const enrichedStudents = students.map((s) => {
            const lastActivity = activityMap.get(s.id);
            const isInactive = !lastActivity || new Date(lastActivity) < inactiveThreshold;
            const avgScore = scoreMap.get(s.id) ?? null;
            const isRisk = riskStudentIds.has(s.id) || (avgScore !== null && avgScore < 55);
            const isOutstanding = avgScore !== null && avgScore >= 85;
            return {
                id: s.id,
                firstName: s.firstName,
                lastName: s.lastName,
                email: s.email,
                district: s.district,
                avgScore,
                lastActivity: lastActivity ?? null,
                isInactive,
                isRisk,
                isOutstanding,
            };
        });

        const activeCount = enrichedStudents.filter((s) => !s.isInactive).length;
        const inactiveCount = enrichedStudents.filter((s) => s.isInactive).length;
        const riskCount = enrichedStudents.filter((s) => s.isRisk).length;
        const outstandingCount = enrichedStudents.filter((s) => s.isOutstanding).length;

        return {
            section: { id: section.id, name: section.name, grade: (section as any).grade?.name },
            stats: {
                total: students.length,
                active: activeCount,
                inactive: inactiveCount,
                atRisk: riskCount,
                outstanding: outstandingCount,
            },
            students: enrichedStudents,
            alerts: alerts.map((a) => ({
                id: a.id,
                type: a.type,
                description: a.description,
                resolved: a.resolved,
                createdAt: a.createdAt,
                student: { id: a.student?.id, firstName: a.student?.firstName, lastName: a.student?.lastName },
                subject: a.subject ? { name: a.subject.name } : null,
            })),
        };
    }

    // ── TEACHER DASHBOARD ────────────────────────────────────────────────────

    async getTeacherDashboard(teacherId: string) {
        // Materias del docente
        const teacherSubjects = await this.subjectRepo.manager
            .getRepository('TeacherSubject')
            .find({ where: { teacherId }, relations: ['subject'] });

        const subjects = teacherSubjects.map((ts: any) => ts.subject).filter(Boolean);

        const result = await Promise.all(
            subjects.map(async (subject) => {
                const topics = await this.topicRepo.find({
                    where: { subjectId: subject.id },
                    order: { weekNumber: 'ASC', createdAt: 'ASC' },
                });

                // Dudas por tema (mensajes que referencian el topic)
                const messageCounts = topics.length
                    ? await this.messageRepo
                        .createQueryBuilder('m')
                        .select(['m.topicId as topicId', 'COUNT(*) as count'])
                        .where('m.topicId IN (:...ids)', { ids: topics.map((t) => t.id) })
                        .andWhere("m.sender = 'student'")
                        .groupBy('m.topicId')
                        .getRawMany()
                    : [];

                const messageMap = new Map(messageCounts.map((r) => [r.topicId, parseInt(r.count)]));

                // Promedio de score por tema
                const scoreByTopic = topics.length
                    ? await this.attemptRepo
                        .createQueryBuilder('a')
                        .leftJoin('a.exam', 'exam')
                        .select(['exam.topicId as topicId', 'AVG(a.score) as avgScore'])
                        .where('exam.topicId IN (:...ids)', { ids: topics.map((t) => t.id) })
                        .andWhere('a.completedAt IS NOT NULL')
                        .groupBy('exam.topicId')
                        .getRawMany()
                    : [];

                const topicScoreMap = new Map(scoreByTopic.map((r) => [r.topicId, Math.round(parseFloat(r.avgScore) || 0)]));

                const totalMessages = await this.messageRepo
                    .createQueryBuilder('m')
                    .leftJoin('m.session', 'session')
                    .leftJoin('m.topic', 'topic')
                    .where('topic.subjectId = :subjectId', { subjectId: subject.id })
                    .andWhere("m.sender = 'student'")
                    .getCount();

                const enrichedTopics = topics.map((t) => ({
                    id: t.id,
                    name: t.name,
                    weekNumber: t.weekNumber,
                    doubtsCount: messageMap.get(t.id) ?? 0,
                    avgScore: topicScoreMap.get(t.id) ?? null,
                }));

                const scores = enrichedTopics.map((t) => t.avgScore).filter((s): s is number => s !== null);
                const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

                return {
                    id: subject.id,
                    name: subject.name,
                    icon: subject.iconName,
                    color: subject.colorTheme,
                    totalMessages,
                    avgScore,
                    topics: enrichedTopics,
                };
            }),
        );

        return { subjects: result };
    }

    // ── DIRECTOR DASHBOARD ────────────────────────────────────────────────────

    async getDirectorDashboard(schoolId: string) {
        const grades = await this.gradeRepo.find({
            where: { schoolId },
            relations: ['sections'],
            order: { name: 'ASC' },
        });

        // Stats por grado
        const gradeStats = await Promise.all(
            grades.map(async (grade) => {
                const sectionIds = (grade as any).sections?.map((s: any) => s.id) ?? [];

                const students = sectionIds.length
                    ? await this.studentRepo
                        .createQueryBuilder('s')
                        .where('s.sectionId IN (:...ids)', { ids: sectionIds })
                        .getCount()
                    : 0;

                const studentList = sectionIds.length
                    ? await this.studentRepo
                        .createQueryBuilder('s')
                        .select('s.id')
                        .where('s.sectionId IN (:...ids)', { ids: sectionIds })
                        .getMany()
                    : [];

                const studentIds = studentList.map((s) => s.id);

                const avgScoreRaw = studentIds.length
                    ? await this.attemptRepo
                        .createQueryBuilder('a')
                        .select('AVG(a.score)', 'avg')
                        .where('a.studentId IN (:...ids)', { ids: studentIds })
                        .andWhere('a.completedAt IS NOT NULL')
                        .getRawOne()
                    : null;

                const alertCount = studentIds.length
                    ? await this.alertRepo
                        .createQueryBuilder('al')
                        .where('al.studentId IN (:...ids)', { ids: studentIds })
                        .andWhere('al.resolved = false')
                        .getCount()
                    : 0;

                return {
                    gradeId: grade.id,
                    name: grade.name,
                    students,
                    avgScore: avgScoreRaw?.avg ? Math.round(parseFloat(avgScoreRaw.avg)) : null,
                    activeAlerts: alertCount,
                };
            }),
        );

        // Stats por materia: docentes del colegio → sus materias.
        // En dos pasos explícitos para no depender de un JOIN por relación
        // (`ts.teacher`) que TypeORM no resuelve de forma fiable vía getRepository(string).
        const teachers = await this.subjectRepo.manager.getRepository(User).find({
            where: { schoolId, role: UserRole.TEACHER },
            select: ['id'],
        });
        const teacherIds = teachers.map((t) => t.id);

        const teacherSubjects = teacherIds.length
            ? await this.subjectRepo.manager.getRepository(TeacherSubject).find({
                where: { teacherId: In(teacherIds) },
                relations: ['subject'],
            })
            : [];

        const uniqueSubjectMap = new Map<string, any>();
        for (const ts of teacherSubjects as any[]) {
            if (ts.subject && !uniqueSubjectMap.has(ts.subject.id)) {
                uniqueSubjectMap.set(ts.subject.id, ts.subject);
            }
        }
        const subjects = [...uniqueSubjectMap.values()];

        const subjectStats = await Promise.all(
            subjects.map(async (subject) => {
                const avgRaw = await this.attemptRepo
                    .createQueryBuilder('a')
                    .leftJoin('a.exam', 'exam')
                    .select('AVG(a.score)', 'avg')
                    .where('exam.subjectId = :subjectId', { subjectId: subject.id })
                    .andWhere('a.completedAt IS NOT NULL')
                    .getRawOne();

                const msgCount = await this.messageRepo
                    .createQueryBuilder('m')
                    .leftJoin('m.topic', 'topic')
                    .where('topic.subjectId = :subjectId', { subjectId: subject.id })
                    .andWhere("m.sender = 'student'")
                    .getCount();

                const topTopic = await this.messageRepo
                    .createQueryBuilder('m')
                    .leftJoin('m.topic', 'topic')
                    .select(['topic.name as name', 'COUNT(*) as cnt'])
                    .where('topic.subjectId = :subjectId', { subjectId: subject.id })
                    .andWhere("m.sender = 'student'")
                    .andWhere('topic.id IS NOT NULL')
                    .groupBy('topic.id')
                    .orderBy('cnt', 'DESC')
                    .limit(1)
                    .getRawOne();

                return {
                    id: subject.id,
                    name: subject.name,
                    icon: subject.iconName,
                    color: subject.colorTheme,
                    avgScore: avgRaw?.avg ? Math.round(parseFloat(avgRaw.avg)) : null,
                    totalMessages: msgCount,
                    topTopic: topTopic?.name ?? null,
                };
            }),
        );

        const totalStudents = gradeStats.reduce((s, g) => s + g.students, 0);
        const totalAlerts = gradeStats.reduce((s, g) => s + g.activeAlerts, 0);
        const totalMessages = subjectStats.reduce((s, ss) => s + ss.totalMessages, 0);
        const validScores = gradeStats.map((g) => g.avgScore).filter((s): s is number => s !== null);
        const overallAvg = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : null;

        return {
            kpis: { totalStudents, totalAlerts, totalMessages, overallAvg },
            grades: gradeStats,
            subjects: subjectStats,
        };
    }
}
