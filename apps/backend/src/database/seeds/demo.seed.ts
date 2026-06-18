/**
 * SEED SUPREMO — Colegio demo "Innova Schools" (año académico 2026).
 *
 * Demo enfocada y PROFUNDA para presentación de startup: 1 colegio modelo
 * con datos densos y realistas para que director, tutor y docente vean
 * dashboards y analíticas llenos de información coherente.
 *
 *   - 3 grados (1°-3° Sec), 2 secciones c/u, tutor por sección
 *   - ~8 estudiantes por sección con PERFILES variados
 *     (destacado / promedio / en riesgo / inactivo)
 *   - 5 materias, cada una con agente IA, docente y temas semanales
 *   - Exámenes por materia con preguntas + opciones
 *   - Intentos repartidos en VARIAS SEMANAS (gráfica de evolución rica)
 *   - Chats pre-escritos con topicId (alimentan analítica de dudas)
 *   - Alertas tempranas automáticas para estudiantes en riesgo
 *
 * Todo se inserta DIRECTO en la BD: los mensajes del chat son texto
 * pre-escrito (NO se llama a OpenAI), y el feedback IA también es estático.
 * Rápido, gratis y reproducible.
 *
 * Ejecutar:  npm run seed:demo
 * Idempotente: si ya existe el colegio demo, aborta.
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
    synchronize: true,
});

const PASS = 'demo2026';
const SCHOOL_NAME = 'Innova Schools';

// ── Utilidades ──────────────────────────────────────────────────────────────
const pick = <T>(arr: T[], i: number) => arr[i % arr.length];
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
/** Fecha hace N días (para repartir intentos en el tiempo). */
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);

// Perfiles de rendimiento → determinan notas, actividad y alertas.
type Profile = 'top' | 'avg' | 'risk' | 'inactive';
const PROFILE_SCORE: Record<Profile, [number, number]> = {
    top: [85, 100],
    avg: [60, 80],
    risk: [25, 50],
    inactive: [0, 0], // sin intentos
};

// Nombres para generar estudiantes variados
const FIRST_NAMES = ['Juan', 'María', 'Diego', 'Lucía', 'Carlos', 'Sofía', 'Mateo', 'Valeria', 'Sebastián', 'Camila', 'Andrés', 'Daniela', 'Gabriel', 'Fernanda', 'Joaquín', 'Antonella'];
const LAST_NAMES = ['Mendoza', 'Flores', 'Ramos', 'Castro', 'Vargas', 'Rojas', 'Díaz', 'Quispe', 'Huamán', 'Salazar', 'Torres', 'Chávez', 'Reyes', 'Campos', 'Núñez', 'Paredes'];
const DISTRICTS = ['San Juan de Lurigancho', 'Comas', 'Ate', 'San Martín de Porres', 'Villa El Salvador', 'Los Olivos', 'Surco', 'Miraflores'];

async function seed() {
    await dataSource.initialize();
    console.log(`🌱 Conectado. Iniciando SEED SUPREMO (${SCHOOL_NAME})...`);
    const hash = await bcrypt.hash(PASS, 10);

    const schoolRepo = dataSource.getRepository(School);
    if (await schoolRepo.findOne({ where: { name: SCHOOL_NAME, academicYear: 2026 } })) {
        console.log(`⚠️  Ya existe "${SCHOOL_NAME}" (2026). Seed abortado.`);
        await dataSource.destroy();
        return;
    }

    // ── 1. Colegio ───────────────────────────────────────────────────────────
    const school = await schoolRepo.save(schoolRepo.create({
        name: SCHOOL_NAME, academicYear: 2026,
        logoUrl: 'https://cdn.innova.edu.pe/logo.png', district: 'Lima',
    }));

    // ── 2. Staff ───────────────────────────────────────────────────────────────
    const userRepo = dataSource.getRepository(User);
    const mk = (role: UserRole, email: string, first: string, last: string) =>
        userRepo.save(userRepo.create({ schoolId: school.id, role, email, password: hash, firstName: first, lastName: last }));

    const director = await mk(UserRole.DIRECTOR, 'director@innova.edu.pe', 'Roberto', 'Quispe');

    // Un tutor por sección (3 grados × 2 secciones = 6 tutores)
    const tutorDefs = [
        { email: 'tutor.1a@innova.edu.pe', first: 'María', last: 'López' },
        { email: 'tutor.1b@innova.edu.pe', first: 'Carlos', last: 'Rojas' },
        { email: 'tutor.2a@innova.edu.pe', first: 'Ana', last: 'Torres' },
        { email: 'tutor.2b@innova.edu.pe', first: 'Pedro', last: 'Gutiérrez' },
        { email: 'tutor.3a@innova.edu.pe', first: 'Lucía', last: 'Mendívil' },
        { email: 'tutor.3b@innova.edu.pe', first: 'Jorge', last: 'Salinas' },
    ];
    const tutors: User[] = [];
    for (const t of tutorDefs) tutors.push(await mk(UserRole.TUTOR, t.email, t.first, t.last));

    // Docentes (uno por materia)
    const docMate = await mk(UserRole.TEACHER, 'docente.mate@innova.edu.pe', 'Juan', 'Pérez');
    const docFis = await mk(UserRole.TEACHER, 'docente.fisica@innova.edu.pe', 'Rosa', 'Díaz');
    const docQui = await mk(UserRole.TEACHER, 'docente.quimica@innova.edu.pe', 'Luis', 'Vega');
    const docIng = await mk(UserRole.TEACHER, 'docente.ingles@innova.edu.pe', 'Elena', 'Ríos');
    const docHis = await mk(UserRole.TEACHER, 'docente.historia@innova.edu.pe', 'Marco', 'Aliaga');
    console.log(`👥 1 director, ${tutors.length} tutores, 5 docentes.`);

    // ── 3. Grados y secciones (con tutor) ──────────────────────────────────────
    const gradeRepo = dataSource.getRepository(Grade);
    const sectionRepo = dataSource.getRepository(Section);
    const gradeNames = ['1° Secundaria', '2° Secundaria', '3° Secundaria'];
    const sectionLetters = ['A', 'B'];

    const sectionList: { section: Section; tutor: User; gradeName: string }[] = [];
    let tutorIdx = 0;
    for (const gName of gradeNames) {
        const grade = await gradeRepo.save(gradeRepo.create({ schoolId: school.id, name: gName }));
        for (const letter of sectionLetters) {
            const tutor = tutors[tutorIdx++];
            const section = await sectionRepo.save(sectionRepo.create({
                gradeId: grade.id, name: letter, tutorId: tutor.id,
            }));
            sectionList.push({ section, tutor, gradeName: gName });
        }
    }
    console.log(`📚 ${gradeNames.length} grados, ${sectionList.length} secciones con tutor.`);

    // ── 4. Materias + agente IA + docente + temas ──────────────────────────────
    const subjectRepo = dataSource.getRepository(Subject);
    const agentRepo = dataSource.getRepository(AIAgent);
    const teacherSubjectRepo = dataSource.getRepository(TeacherSubject);
    const topicRepo = dataSource.getRepository(WeeklyTopic);

    const subjectDefs = [
        { name: 'Matemática', icon: 'calculate', color: '#2563eb', agent: 'MateIA', teacher: docMate,
          topics: ['Factorización', 'Productos notables', 'Ecuaciones lineales', 'Inecuaciones', 'Polinomios'] },
        { name: 'Física', icon: 'science', color: '#7c3aed', agent: 'FisiTutor', teacher: docFis,
          topics: ['Cinemática', 'Leyes de Newton', 'Energía', 'Movimiento circular'] },
        { name: 'Química', icon: 'biotech', color: '#16a34a', agent: 'QuimiBot', teacher: docQui,
          topics: ['Tabla periódica', 'Enlaces químicos', 'Reacciones', 'Estequiometría'] },
        { name: 'Inglés', icon: 'translate', color: '#ea580c', agent: 'English Coach', teacher: docIng,
          topics: ['Present Simple', 'Past Tense', 'Conditionals', 'Vocabulary'] },
        { name: 'Historia', icon: 'history_edu', color: '#b45309', agent: 'HistoriIA', teacher: docHis,
          topics: ['Culturas preincas', 'Imperio Inca', 'Conquista', 'Virreinato'] },
    ];

    const subjects: { subject: Subject; agent: AIAgent; topics: WeeklyTopic[]; teacher: User }[] = [];
    for (const def of subjectDefs) {
        const subject = await subjectRepo.save(subjectRepo.create({
            name: def.name, description: `Curso de ${def.name} - ${SCHOOL_NAME} 2026`,
            iconName: def.icon, colorTheme: def.color, totalLessons: def.topics.length * 4,
        }));
        const agent = await agentRepo.save(agentRepo.create({
            subjectId: subject.id, name: def.agent, modelId: 'gpt-4o-mini',
            systemPrompt: `Eres ${def.agent}, tutor de ${def.name} para secundaria. Explica claro y propón ejercicios.`,
        }));
        await teacherSubjectRepo.save(teacherSubjectRepo.create({
            teacherId: def.teacher.id, subjectId: subject.id, isPrimary: true,
        }));
        const topics: WeeklyTopic[] = [];
        for (let i = 0; i < def.topics.length; i++) {
            topics.push(await topicRepo.save(topicRepo.create({
                subjectId: subject.id, teacherId: def.teacher.id,
                name: def.topics[i], weekNumber: Math.floor(i / 2) + 1,
            })));
        }
        subjects.push({ subject, agent, topics, teacher: def.teacher });
    }
    console.log(`📖 ${subjects.length} materias con agente, docente y temas.`);

    // ── 5. Exámenes por materia (con preguntas + opciones) ─────────────────────
    const examRepo = dataSource.getRepository(Exam);
    const questionRepo = dataSource.getRepository(Question);
    const optionRepo = dataSource.getRepository(Option);

    // Genérico: por cada materia, 1 examen por cada par de temas (≈2-3 exámenes/materia)
    interface SeededExam { exam: Exam; questions: { q: Question; correctId: string; wrongId: string }[]; subjectId: string; }
    const exams: SeededExam[] = [];

    for (const s of subjects) {
        // 1 examen por tema (hasta 3 por materia para no saturar)
        const examTopics = s.topics.slice(0, 3);
        for (let e = 0; e < examTopics.length; e++) {
            const topic = examTopics[e];
            const exam = await examRepo.save(examRepo.create({
                subjectId: s.subject.id, topicId: topic.id,
                type: e === 0 ? ExamType.WEEKLY : ExamType.DAILY,
                title: `Evaluación: ${topic.name}`,
                description: `Tema: ${topic.name} (${s.subject.name})`,
                timeLimitMinutes: 30, totalPoints: 50, difficulty: pick(['easy', 'medium', 'hard'], e),
                scheduledFor: daysAgo(rand(1, 5)),
            }));
            // 5 preguntas por examen
            const qs: SeededExam['questions'] = [];
            for (let i = 1; i <= 5; i++) {
                const q = await questionRepo.save(questionRepo.create({
                    examId: exam.id, content: `${topic.name} — Pregunta ${i}`,
                    type: 'multiple_choice', points: 10,
                }));
                const opts = await optionRepo.save([
                    optionRepo.create({ questionId: q.id, content: 'Opción correcta', isCorrect: true }),
                    optionRepo.create({ questionId: q.id, content: 'Distractor A', isCorrect: false }),
                    optionRepo.create({ questionId: q.id, content: 'Distractor B', isCorrect: false }),
                    optionRepo.create({ questionId: q.id, content: 'Distractor C', isCorrect: false }),
                ]);
                qs.push({ q, correctId: opts[0].id, wrongId: opts[1].id });
            }
            exams.push({ exam, questions: qs, subjectId: s.subject.id });
        }
    }
    console.log(`📝 ${exams.length} exámenes (5 preguntas c/u).`);

    // ── 6. Estudiantes por sección, con perfiles variados ──────────────────────
    const studentRepo = dataSource.getRepository(Student);
    const enrollmentRepo = dataSource.getRepository(Enrollment);
    const sessionRepo = dataSource.getRepository(ChatSession);
    const messageRepo = dataSource.getRepository(Message);
    const attemptRepo = dataSource.getRepository(ExamAttempt);
    const answerRepo = dataSource.getRepository(Answer);
    const improvementRepo = dataSource.getRepository(ImprovementArea);
    const alertRepo = dataSource.getRepository(Alert);

    // Distribución de perfiles dentro de cada sección de ~8 alumnos
    const profilePattern: Profile[] = ['top', 'top', 'avg', 'avg', 'avg', 'risk', 'risk', 'inactive'];

    const chatQuestions = [
        'No entiendo este tema, ¿me lo explicas?',
        '¿Me das un ejemplo resuelto paso a paso?',
        '¿Puedes darme 3 ejercicios para practicar?',
        'No me salió el examen, ¿qué repaso?',
        'Explícame como si tuviera 12 años.',
    ];
    const chatAnswers = [
        'Claro, vamos por partes. Lo primero es identificar los datos del problema...',
        'Con gusto. Mira este ejemplo: aplicamos la fórmula y resolvemos cada paso...',
        'Aquí van 3 ejercicios graduados de menor a mayor dificultad. ¡Inténtalo!',
        'Te recomiendo repasar la teoría base y luego practicar con ejercicios resueltos.',
        'Imagina que es como repartir caramelos en partes iguales: ese es el concepto.',
    ];

    let totalStudents = 0, totalAttempts = 0, totalMessages = 0, totalAlerts = 0;
    let nameIdx = 0;

    for (const { section, tutor, gradeName } of sectionList) {
        const gradeLevel = gradeName;
        for (let i = 0; i < profilePattern.length; i++) {
            const profile = profilePattern[i];
            const first = pick(FIRST_NAMES, nameIdx);
            const last = pick(LAST_NAMES, nameIdx + 3);
            // Email sin tildes (quita marcas diacríticas combinantes U+0300–U+036F).
            const email = `${first.toLowerCase()}.${last.toLowerCase()}${nameIdx}@alumno.innova.edu.pe`
                .normalize('NFD').replace(/[̀-ͯ]/g, '');
            nameIdx++;

            const student = await studentRepo.save(studentRepo.create({
                schoolId: school.id, sectionId: section.id,
                email, password: hash, firstName: first, lastName: last,
                district: pick(DISTRICTS, nameIdx), schoolName: SCHOOL_NAME, gradeLevel,
                planType: profile === 'top' ? PlanType.PREMIUM : PlanType.FREE,
                tokensBalance: rand(20, 500),
                streakCount: profile === 'top' ? rand(5, 20) : profile === 'avg' ? rand(1, 6) : 0,
                lastLoginAt: profile === 'inactive' ? daysAgo(rand(12, 30)) : daysAgo(rand(0, 3)),
            }));
            totalStudents++;

            // Matrícula en todas las materias
            for (const s of subjects) {
                await enrollmentRepo.save(enrollmentRepo.create({
                    studentId: student.id, subjectId: s.subject.id,
                    completedLessons: rand(0, 10), status: 'active',
                }));
            }

            // Inactivo: sin intentos ni chats (aparecerá como inactivo en el dashboard del tutor)
            if (profile === 'inactive') continue;

            // Chats: 1-3 sesiones con mensajes anclados a un tema (alimenta analítica de dudas)
            const numChats = rand(1, 3);
            for (let c = 0; c < numChats; c++) {
                const s = pick(subjects, nameIdx + c);
                const topic = pick(s.topics, c);
                const session = await sessionRepo.save(sessionRepo.create({
                    studentId: student.id, agentId: s.agent.id, lastInteraction: daysAgo(rand(0, 14)),
                }));
                const turns = rand(1, 3);
                for (let m = 0; m < turns; m++) {
                    await messageRepo.save(messageRepo.create({
                        sessionId: session.id, topicId: topic.id,
                        sender: MessageSender.STUDENT, content: pick(chatQuestions, m),
                        sentAt: daysAgo(rand(0, 14)),
                    }));
                    await messageRepo.save(messageRepo.create({
                        sessionId: session.id, topicId: topic.id,
                        sender: MessageSender.AGENT, content: pick(chatAnswers, m),
                        tokensUsed: rand(80, 220), sentAt: daysAgo(rand(0, 14)),
                    }));
                    totalMessages += 2;
                }
            }

            // Intentos de examen repartidos en varias semanas (gráfica de evolución)
            const [lo, hi] = PROFILE_SCORE[profile];
            const examsToTake = exams.filter(() => Math.random() < 0.55); // ~55% de los exámenes
            for (let k = 0; k < examsToTake.length; k++) {
                const se = examsToTake[k];
                const score = rand(lo, hi);
                const completedAt = daysAgo(rand(1, 28)); // hasta 4 semanas atrás
                const attempt = await attemptRepo.save(attemptRepo.create({
                    studentId: student.id, examId: se.exam.id, score,
                    timeSpentSeconds: rand(300, 1500), completedAt,
                    aiFeedbackSummary: score >= 75
                        ? 'Buen desempeño. Sigue reforzando los temas con práctica constante.'
                        : 'Hay temas por reforzar. Revisa los ejercicios fallados y vuelve a intentar.',
                }));
                totalAttempts++;
                // Respuestas: aciertos proporcionales al score
                const correctCount = Math.round((score / 100) * se.questions.length);
                for (let qi = 0; qi < se.questions.length; qi++) {
                    const qq = se.questions[qi];
                    await answerRepo.save(answerRepo.create({
                        attemptId: attempt.id, questionId: qq.q.id,
                        selectedOptionId: qi < correctCount ? qq.correctId : qq.wrongId,
                    }));
                }
                // Área de mejora si reprobó
                if (score < 60) {
                    const s = subjects.find((x) => x.subject.id === se.subjectId)!;
                    const topic = pick(s.topics, k);
                    await improvementRepo.save(improvementRepo.create({
                        attemptId: attempt.id, topicId: topic.id, topicName: topic.name,
                        priority: score < 40 ? 'high' : 'moderate',
                        aiSuggestion: `Refuerza "${topic.name}" con ejercicios guiados y revisa la teoría base.`,
                    }));
                }
            }

            // Alerta temprana para estudiantes en riesgo
            if (profile === 'risk') {
                const s = pick(subjects, nameIdx);
                await alertRepo.save(alertRepo.create({
                    studentId: student.id, tutorId: tutor.id, subjectId: s.subject.id,
                    type: pick([AlertType.LOW_PERFORMANCE, AlertType.PERFORMANCE_DROP], nameIdx),
                    description: `${first} ${last} presenta bajo rendimiento sostenido en ${s.subject.name}. Se recomienda intervención del tutor.`,
                    resolved: false,
                }));
                totalAlerts++;
            }
        }
    }

    console.log(`🎓 ${totalStudents} estudiantes | 📝 ${totalAttempts} intentos | 💬 ${totalMessages} mensajes | 🚨 ${totalAlerts} alertas.`);
    console.log('\n✅ SEED SUPREMO completado.');
    console.log(`   Password (todos): ${PASS}`);
    console.log('   Director: director@innova.edu.pe');
    console.log('   Tutor:    tutor.3b@innova.edu.pe');
    console.log('   Docente:  docente.mate@innova.edu.pe');
    console.log('   (Alumnos: <nombre>.<apellido>N@alumno.innova.edu.pe — revisa la BD para emails exactos)');

    await dataSource.destroy();
}

seed().catch((err) => {
    console.error('❌ Error en el seed:', err);
    process.exit(1);
});
