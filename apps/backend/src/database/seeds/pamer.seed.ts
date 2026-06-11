/**
 * Seed de ejemplo: Colegio PAMER (año académico 2026).
 *
 * Crea un colegio completo y consistente para desarrollo y demos:
 *   - 1 colegio, grados 1°–5° de secundaria, secciones A–E
 *   - Director, tutores (por aula), docentes
 *   - Materias con su agente IA y temas semanales
 *   - Estudiantes con matrícula, chat de ejemplo, examen e intento
 *   - Una alerta temprana de ejemplo
 *
 * Ejecutar:  npm run seed
 *
 * IMPORTANTE: este seed es idempotente a nivel de colegio: si ya existe un
 * colegio "PAMER" para 2026, aborta para no duplicar datos.
 */
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

dotenv.config();

import { School } from '../../domain/entities/school.entity';
import { Grade } from '../../domain/entities/grade.entity';
import { Section } from '../../domain/entities/section.entity';
import { User, UserRole } from '../../domain/entities/user.entity';
import { Subject } from '../../domain/entities/subject.entity';
import { TeacherSubject } from '../../domain/entities/teacher-subject.entity';
import { AIAgent } from '../../domain/entities/ai-agent.entity';
import { WeeklyTopic } from '../../domain/entities/weekly-topic.entity';
import { Student, PlanType } from '../../domain/entities/student.entity';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import { ChatSession } from '../../domain/entities/chat-session.entity';
import { Message, MessageSender } from '../../domain/entities/message.entity';
import { Exam, ExamType } from '../../domain/entities/exam.entity';
import { Question } from '../../domain/entities/question.entity';
import { Option } from '../../domain/entities/option.entity';
import { ExamAttempt } from '../../domain/entities/exam-attempt.entity';
import { Answer } from '../../domain/entities/answer.entity';
import { ImprovementArea } from '../../domain/entities/improvement-area.entity';
import { Alert, AlertType } from '../../domain/entities/alert.entity';

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'project_moon',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: true, // crea las tablas si aún no existen (solo dev)
});

const DEFAULT_PASSWORD = 'pamer2026';

async function seed() {
    await dataSource.initialize();
    console.log('🌱 Conectado a la base de datos. Iniciando seed PAMER...');

    const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    // ── Guard de idempotencia ──────────────────────────────────────────────
    const schoolRepo = dataSource.getRepository(School);
    const existing = await schoolRepo.findOne({ where: { name: 'PAMER', academicYear: 2026 } });
    if (existing) {
        console.log('⚠️  Ya existe el colegio PAMER (2026). Seed abortado para evitar duplicados.');
        await dataSource.destroy();
        return;
    }

    // ── 1. Colegio ─────────────────────────────────────────────────────────
    const school = await schoolRepo.save(schoolRepo.create({
        name: 'PAMER',
        academicYear: 2026,
        logoUrl: 'https://cdn.pamer.edu.pe/logo.png',
        district: 'Lima',
    }));
    console.log(`🏫 Colegio: ${school.name} (${school.academicYear})`);

    // ── 2. Grados y secciones ──────────────────────────────────────────────
    const gradeRepo = dataSource.getRepository(Grade);
    const sectionRepo = dataSource.getRepository(Section);

    const gradeNames = ['1° Secundaria', '2° Secundaria', '3° Secundaria', '4° Secundaria', '5° Secundaria'];
    const sectionLetters = ['A', 'B', 'C', 'D', 'E'];

    const grades: Grade[] = [];
    const sections: Section[] = [];
    for (const name of gradeNames) {
        const grade = await gradeRepo.save(gradeRepo.create({ schoolId: school.id, name }));
        grades.push(grade);
        for (const letter of sectionLetters) {
            const section = await sectionRepo.save(sectionRepo.create({ gradeId: grade.id, name: letter }));
            sections.push(section);
        }
    }
    console.log(`📚 ${grades.length} grados, ${sections.length} secciones.`);

    // Helper para localizar una sección por "3° Secundaria" + "B"
    const findSection = (gradeName: string, letter: string) => {
        const grade = grades.find((g) => g.name === gradeName)!;
        return sections.find((s) => s.gradeId === grade.id && s.name === letter)!;
    };

    // ── 3. Staff: director, tutores, docentes ──────────────────────────────
    const userRepo = dataSource.getRepository(User);

    const director = await userRepo.save(userRepo.create({
        schoolId: school.id, role: UserRole.DIRECTOR,
        email: 'director@pamer.edu.pe', password: hash,
        firstName: 'Roberto', lastName: 'Quispe',
    }));

    // Tutores: uno por aula de ejemplo
    const tutorMaria = await userRepo.save(userRepo.create({
        schoolId: school.id, role: UserRole.TUTOR,
        email: 'maria.lopez@pamer.edu.pe', password: hash,
        firstName: 'María', lastName: 'López',
    }));
    const tutorCarlos = await userRepo.save(userRepo.create({
        schoolId: school.id, role: UserRole.TUTOR,
        email: 'carlos.rojas@pamer.edu.pe', password: hash,
        firstName: 'Carlos', lastName: 'Rojas',
    }));
    const tutorAna = await userRepo.save(userRepo.create({
        schoolId: school.id, role: UserRole.TUTOR,
        email: 'ana.torres@pamer.edu.pe', password: hash,
        firstName: 'Ana', lastName: 'Torres',
    }));

    // Asignar tutores a secciones
    const sec1A = findSection('1° Secundaria', 'A');
    const sec1B = findSection('1° Secundaria', 'B');
    const sec3B = findSection('3° Secundaria', 'B');
    sec1A.tutorId = tutorMaria.id;
    sec1B.tutorId = tutorCarlos.id;
    sec3B.tutorId = tutorCarlos.id; // Carlos también tutorea 3°B (caso del Word)
    findSection('2° Secundaria', 'A').tutorId = tutorAna.id;
    await sectionRepo.save([sec1A, sec1B, sec3B, findSection('2° Secundaria', 'A')]);

    // Docentes
    const docJuan = await userRepo.save(userRepo.create({
        schoolId: school.id, role: UserRole.TEACHER,
        email: 'juan.perez@pamer.edu.pe', password: hash,
        firstName: 'Juan', lastName: 'Pérez',
    }));
    const docRosa = await userRepo.save(userRepo.create({
        schoolId: school.id, role: UserRole.TEACHER,
        email: 'rosa.diaz@pamer.edu.pe', password: hash,
        firstName: 'Rosa', lastName: 'Díaz',
    }));
    const docLuis = await userRepo.save(userRepo.create({
        schoolId: school.id, role: UserRole.TEACHER,
        email: 'luis.vega@pamer.edu.pe', password: hash,
        firstName: 'Luis', lastName: 'Vega',
    }));
    console.log('👥 1 director, 3 tutores, 3 docentes.');

    // ── 4. Materias + agente IA + asignación docente ───────────────────────
    const subjectRepo = dataSource.getRepository(Subject);
    const agentRepo = dataSource.getRepository(AIAgent);
    const teacherSubjectRepo = dataSource.getRepository(TeacherSubject);

    const subjectDefs = [
        { name: 'Matemática', icon: 'calculate', color: '#2563eb', agent: 'MateIA', teacher: docJuan },
        { name: 'Física', icon: 'science', color: '#7c3aed', agent: 'FisiTutor', teacher: docRosa },
        { name: 'Química', icon: 'biotech', color: '#16a34a', agent: 'QuimiBot', teacher: docRosa },
        { name: 'Inglés', icon: 'translate', color: '#ea580c', agent: 'English Coach', teacher: docLuis },
        { name: 'Historia', icon: 'history_edu', color: '#b45309', agent: 'HistoriIA', teacher: docLuis },
    ];

    const subjects: Record<string, Subject> = {};
    for (const def of subjectDefs) {
        const subject = await subjectRepo.save(subjectRepo.create({
            name: def.name, description: `Curso de ${def.name} - PAMER 2026`,
            iconName: def.icon, colorTheme: def.color,
        }));
        subjects[def.name] = subject;

        await agentRepo.save(agentRepo.create({
            subjectId: subject.id,
            name: def.agent,
            modelId: 'claude-sonnet-4-6',
            systemPrompt: `Eres ${def.agent}, tutor de ${def.name} para estudiantes de secundaria. ` +
                `Explica con claridad, adapta el nivel y propón ejercicios.`,
        }));

        await teacherSubjectRepo.save(teacherSubjectRepo.create({
            teacherId: def.teacher.id, subjectId: subject.id, isPrimary: true,
        }));
    }
    console.log(`📖 ${subjectDefs.length} materias con su agente IA y docente.`);

    // ── 5. Temas semanales (Matemática, según el Word) ─────────────────────
    const topicRepo = dataSource.getRepository(WeeklyTopic);
    const mate = subjects['Matemática'];
    const topicDefs = [
        { name: 'Factorización', week: 1 },
        { name: 'Productos notables', week: 1 },
        { name: 'Ecuaciones lineales', week: 1 },
        { name: 'Inecuaciones', week: 2 },
        { name: 'Polinomios', week: 2 },
    ];
    const topics: Record<string, WeeklyTopic> = {};
    for (const t of topicDefs) {
        topics[t.name] = await topicRepo.save(topicRepo.create({
            subjectId: mate.id, teacherId: docJuan.id, name: t.name, weekNumber: t.week,
        }));
    }
    console.log(`🗓️  ${topicDefs.length} temas semanales de Matemática.`);

    // ── 6. Estudiantes (3° B, tutor Carlos) ────────────────────────────────
    const studentRepo = dataSource.getRepository(Student);
    const enrollmentRepo = dataSource.getRepository(Enrollment);

    const studentDefs = [
        { first: 'Juan', last: 'Mendoza', email: 'juan.mendoza@alumno.pamer.edu.pe', district: 'San Juan de Lurigancho' },
        { first: 'María', last: 'Flores', email: 'maria.flores@alumno.pamer.edu.pe', district: 'Comas' },
        { first: 'Diego', last: 'Ramos', email: 'diego.ramos@alumno.pamer.edu.pe', district: 'Ate' },
    ];

    const students: Student[] = [];
    for (const s of studentDefs) {
        const studentEntity: Partial<Student> = {
            schoolId: school.id, sectionId: sec3B.id,
            email: s.email, password: hash,
            firstName: s.first, lastName: s.last,
            district: s.district, schoolName: 'PAMER', gradeLevel: '3° Secundaria',
            planType: PlanType.FREE, tokensBalance: 100, streakCount: 0,
        };
        const student = await studentRepo.save(studentRepo.create(studentEntity));
        students.push(student);

        // Matricular en todas las materias
        for (const subjName of Object.keys(subjects)) {
            await enrollmentRepo.save(enrollmentRepo.create({
                studentId: student.id, subjectId: subjects[subjName].id, status: 'active',
            }));
        }
    }
    console.log(`🎓 ${students.length} estudiantes en 3°B, matriculados en ${Object.keys(subjects).length} materias.`);

    // ── 7. Chat de ejemplo (Juan pregunta sobre factorización) ─────────────
    const sessionRepo = dataSource.getRepository(ChatSession);
    const messageRepo = dataSource.getRepository(Message);
    const mateAgent = await agentRepo.findOneByOrFail({ subjectId: mate.id });

    const session = await sessionRepo.save(sessionRepo.create({
        studentId: students[0].id, agentId: mateAgent.id, lastInteraction: new Date(),
    }));
    await messageRepo.save([
        messageRepo.create({
            sessionId: session.id, topicId: topics['Factorización'].id,
            sender: MessageSender.STUDENT, content: 'No entiendo cómo resolver una factorización.',
        }),
        messageRepo.create({
            sessionId: session.id, topicId: topics['Factorización'].id,
            sender: MessageSender.AGENT, tokensUsed: 180,
            content: 'Factorizar es escribir una expresión como producto de factores. Empecemos con factor común: en 6x + 9, el factor común es 3 → 3(2x + 3). ¿Quieres un ejercicio?',
        }),
    ]);
    console.log('💬 Sesión de chat de ejemplo creada.');

    // ── 8. Examen de Matemática (semanal) + intento ────────────────────────
    const examRepo = dataSource.getRepository(Exam);
    const questionRepo = dataSource.getRepository(Question);
    const optionRepo = dataSource.getRepository(Option);
    const attemptRepo = dataSource.getRepository(ExamAttempt);
    const answerRepo = dataSource.getRepository(Answer);
    const improvementRepo = dataSource.getRepository(ImprovementArea);

    const exam = await examRepo.save(examRepo.create({
        subjectId: mate.id, topicId: topics['Productos notables'].id,
        type: ExamType.WEEKLY, title: 'Evaluación semanal - Productos notables',
        description: 'Temas de la semana 1', timeLimitMinutes: 30, totalPoints: 20,
        difficulty: 'medium', scheduledFor: new Date('2026-06-12'),
    }));

    const q1 = await questionRepo.save(questionRepo.create({
        examId: exam.id, content: '¿Cuál es el resultado de (a + b)²?', type: 'multiple_choice', points: 10,
    }));
    const optsQ1 = await optionRepo.save([
        optionRepo.create({ questionId: q1.id, content: 'a² + 2ab + b²', isCorrect: true }),
        optionRepo.create({ questionId: q1.id, content: 'a² + b²', isCorrect: false }),
        optionRepo.create({ questionId: q1.id, content: 'a² - 2ab + b²', isCorrect: false }),
        optionRepo.create({ questionId: q1.id, content: '2a + 2b', isCorrect: false }),
    ]);

    const q2 = await questionRepo.save(questionRepo.create({
        examId: exam.id, content: '(x + 3)(x - 3) es igual a x² - 9', type: 'true_false', points: 10,
    }));
    const optsQ2 = await optionRepo.save([
        optionRepo.create({ questionId: q2.id, content: 'Verdadero', isCorrect: true }),
        optionRepo.create({ questionId: q2.id, content: 'Falso', isCorrect: false }),
    ]);

    // Intento de Juan: acierta la 1, falla la 2 → 10/20
    const attempt = await attemptRepo.save(attemptRepo.create({
        studentId: students[0].id, examId: exam.id, score: 10, timeSpentSeconds: 540,
        completedAt: new Date(),
        aiFeedbackSummary: 'Dominas el cuadrado de un binomio, pero confundiste la diferencia de cuadrados. Repasa (a+b)(a-b) = a² - b².',
    }));
    await answerRepo.save([
        answerRepo.create({ attemptId: attempt.id, questionId: q1.id, selectedOptionId: optsQ1[0].id }),
        answerRepo.create({ attemptId: attempt.id, questionId: q2.id, selectedOptionId: optsQ2[1].id }),
    ]);
    await improvementRepo.save(improvementRepo.create({
        attemptId: attempt.id, topicId: topics['Productos notables'].id,
        topicName: 'Productos notables', priority: 'high',
        aiSuggestion: 'Refuerza la diferencia de cuadrados con 5 ejercicios guiados.',
    }));
    console.log('📝 Examen, intento y área de mejora creados.');

    // ── 9. Alerta temprana de ejemplo (caso Juan, del Word) ────────────────
    const alertRepo = dataSource.getRepository(Alert);
    await alertRepo.save(alertRepo.create({
        studentId: students[0].id, tutorId: tutorCarlos.id, subjectId: mate.id,
        type: AlertType.PERFORMANCE_DROP,
        description: 'Juan presenta una disminución sostenida en Matemática durante las últimas tres semanas. Se recomienda intervención del tutor.',
        resolved: false,
    }));
    console.log('🚨 Alerta temprana de ejemplo creada.');

    console.log('\n✅ Seed PAMER completado.');
    console.log(`   Credenciales de prueba (password para todos): ${DEFAULT_PASSWORD}`);
    console.log('   Director: director@pamer.edu.pe');
    console.log('   Tutor:    carlos.rojas@pamer.edu.pe');
    console.log('   Docente:  juan.perez@pamer.edu.pe');
    console.log('   Alumno:   juan.mendoza@alumno.pamer.edu.pe');

    await dataSource.destroy();
}

seed().catch((err) => {
    console.error('❌ Error en el seed:', err);
    process.exit(1);
});
