import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import OpenAI from 'openai';
import { ExamAttempt } from '../domain/entities/exam-attempt.entity';
import { Answer } from '../domain/entities/answer.entity';
import { Question } from '../domain/entities/question.entity';
import { Option } from '../domain/entities/option.entity';
import { Exam } from '../domain/entities/exam.entity';
import { ImprovementArea } from '../domain/entities/improvement-area.entity';

export interface SubmitAnswerDto {
    questionId: string;
    selectedOptionId?: string;
    textContent?: string;
}

export interface SubmitAttemptDto {
    timeSpentSeconds: number;
    answers: SubmitAnswerDto[];
}

@Injectable()
export class ExamAttemptsService {
    private readonly openai: OpenAI;

    constructor(
        @InjectRepository(ExamAttempt)
        private readonly attemptRepo: Repository<ExamAttempt>,
        @InjectRepository(Answer)
        private readonly answerRepo: Repository<Answer>,
        @InjectRepository(Question)
        private readonly questionRepo: Repository<Question>,
        @InjectRepository(Option)
        private readonly optionRepo: Repository<Option>,
        @InjectRepository(Exam)
        private readonly examRepo: Repository<Exam>,
        @InjectRepository(ImprovementArea)
        private readonly improvementRepo: Repository<ImprovementArea>,
    ) {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    /** Inicia un intento (registra started_at). */
    async start(studentId: string, examId: string): Promise<ExamAttempt> {
        const exam = await this.examRepo.findOne({ where: { id: examId } });
        if (!exam) throw new NotFoundException('Exam not found');

        const attempt = this.attemptRepo.create({ studentId, examId, score: 0 });
        return this.attemptRepo.save(attempt);
    }

    /** Recibe respuestas, califica, cierra el intento y genera áreas de mejora con IA. */
    async submit(studentId: string, attemptId: string, dto: SubmitAttemptDto) {
        const attempt = await this.attemptRepo.findOne({
            where: { id: attemptId },
            relations: ['exam'],
        });
        if (!attempt) throw new NotFoundException('Attempt not found');
        if (attempt.studentId !== studentId) throw new ForbiddenException('Not your attempt');
        if (attempt.completedAt) throw new ForbiddenException('Attempt already submitted');

        const questionIds = dto.answers.map((a) => a.questionId);
        const questions = questionIds.length
            ? await this.questionRepo.find({ where: { id: In(questionIds) }, relations: ['options'] })
            : [];
        const questionMap = new Map(questions.map((q) => [q.id, q]));

        let earnedPoints = 0;
        const failedTopics: string[] = [];

        for (const ans of dto.answers) {
            const question = questionMap.get(ans.questionId);
            if (!question) continue;

            const correctOption = (question.options ?? []).find((o) => o.isCorrect);
            const isCorrect = correctOption && ans.selectedOptionId === correctOption.id;

            if (isCorrect) {
                earnedPoints += question.points ?? 0;
            } else {
                failedTopics.push(question.content);
            }

            await this.answerRepo.save(
                this.answerRepo.create({
                    attemptId: attempt.id,
                    questionId: ans.questionId,
                    selectedOptionId: ans.selectedOptionId,
                    textContent: ans.textContent,
                }),
            );
        }

        const totalPoints = attempt.exam?.totalPoints || 0;
        const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

        // Feedback con IA (best-effort: no bloquea el cierre del intento si falla).
        let aiFeedback = '';
        if (failedTopics.length > 0) {
            aiFeedback = await this.generateFeedback(score, failedTopics);
            await this.improvementRepo.save(
                this.improvementRepo.create({
                    attemptId: attempt.id,
                    topicId: attempt.exam?.topicId,
                    topicName: failedTopics[0].slice(0, 200),
                    priority: score < 50 ? 'high' : score < 70 ? 'moderate' : 'low',
                    aiSuggestion: aiFeedback,
                }),
            );
        }

        attempt.score = score;
        attempt.timeSpentSeconds = dto.timeSpentSeconds;
        attempt.completedAt = new Date();
        attempt.aiFeedbackSummary = aiFeedback;
        await this.attemptRepo.save(attempt);

        return {
            id: attempt.id,
            score,
            earnedPoints,
            totalPoints,
            correctCount: dto.answers.length - failedTopics.length,
            totalQuestions: dto.answers.length,
            timeSpentSeconds: dto.timeSpentSeconds,
            aiFeedbackSummary: aiFeedback,
        };
    }

    async findResult(attemptId: string) {
        const attempt = await this.attemptRepo.findOne({
            where: { id: attemptId },
            relations: ['exam', 'exam.subject'],
        });
        if (!attempt) throw new NotFoundException('Attempt not found');

        const improvements = await this.improvementRepo.find({ where: { attemptId } });

        return {
            id: attempt.id,
            score: attempt.score,
            timeSpentSeconds: attempt.timeSpentSeconds,
            completedAt: attempt.completedAt,
            aiFeedbackSummary: attempt.aiFeedbackSummary,
            exam: attempt.exam ? { id: attempt.exam.id, title: attempt.exam.title, subject: attempt.exam.subject?.name } : null,
            improvements: improvements.map((i) => ({
                topicName: i.topicName,
                priority: i.priority,
                aiSuggestion: i.aiSuggestion,
            })),
        };
    }

    async findByStudent(studentId: string) {
        return this.attemptRepo.find({
            where: { studentId },
            relations: ['exam', 'exam.subject'],
            order: { startedAt: 'DESC' },
        });
    }

    private async generateFeedback(score: number, failedTopics: string[]): Promise<string> {
        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content:
                            'Eres un tutor académico. Da retroalimentación breve (máx 3 frases), motivadora y concreta en español sobre qué reforzar.',
                    },
                    {
                        role: 'user',
                        content: `El estudiante obtuvo ${score}%. Falló preguntas sobre: ${failedTopics
                            .slice(0, 5)
                            .join('; ')}. Sugiere qué repasar.`,
                    },
                ],
            });
            return completion.choices[0].message.content ?? '';
        } catch (err: any) {
            console.error('OpenAI feedback error:', err?.message);
            return 'Revisa los temas en los que fallaste y vuelve a intentarlo. ¡Tú puedes!';
        }
    }
}
