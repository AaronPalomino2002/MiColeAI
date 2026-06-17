"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Option {
    id: string;
    content: string;
}
interface Question {
    id: string;
    content: string;
    type: string;
    points: number;
    options: Option[];
}
interface ExamData {
    id: string;
    title: string;
    description: string | null;
    timeLimitMinutes: number;
    subject: { name: string } | null;
    questions: Question[];
}

function formatTime(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export default function ExamRoomPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.id as string;

    const [exam, setExam] = useState<ExamData | null>(null);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
    const [submitting, setSubmitting] = useState(false);
    const [remaining, setRemaining] = useState<number | null>(null);

    const startedAt = useRef<number>(Date.now());

    useEffect(() => {
        async function init() {
            try {
                const examData: ExamData = await api.get(`/exams/${examId}`);
                setExam(examData);
                setRemaining(examData.timeLimitMinutes * 60);
                const attempt: { id: string } = await api.post("/exam-attempts", { examId });
                setAttemptId(attempt.id);
                startedAt.current = Date.now();
            } catch (e) {
                setError(e instanceof Error ? e.message : "No se pudo cargar el examen");
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [examId]);

    // Temporizador
    useEffect(() => {
        if (remaining === null || submitting) return;
        if (remaining <= 0) { handleSubmit(); return; }
        const t = setTimeout(() => setRemaining((r) => (r ?? 0) - 1), 1000);
        return () => clearTimeout(t);
    }, [remaining, submitting]);

    function selectOption(questionId: string, optionId: string) {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    }

    async function handleSubmit() {
        if (!attemptId || !exam || submitting) return;
        setSubmitting(true);
        const timeSpentSeconds = Math.round((Date.now() - startedAt.current) / 1000);
        try {
            await api.post(`/exam-attempts/${attemptId}/submit`, {
                timeSpentSeconds,
                answers: exam.questions.map((q) => ({
                    questionId: q.id,
                    selectedOptionId: answers[q.id],
                })),
            });
            router.push(`/exams/${examId}/result?attemptId=${attemptId}`);
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo enviar el examen");
            setSubmitting(false);
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-full text-slate-400 gap-2 p-12">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            Cargando examen...
        </div>
    );

    if (error) return (
        <div className="p-12 max-w-xl mx-auto text-center">
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <button onClick={() => router.push("/exams")} className="text-primary font-bold hover:underline">Volver a exámenes</button>
        </div>
    );

    if (!exam || exam.questions.length === 0) return (
        <div className="p-12 max-w-xl mx-auto text-center text-slate-500">
            Este examen aún no tiene preguntas.
        </div>
    );

    const question = exam.questions[current];
    const answeredCount = Object.keys(answers).length;
    const progress = Math.round((answeredCount / exam.questions.length) * 100);
    const lowTime = remaining !== null && remaining < 60;

    return (
        <div className="max-w-3xl mx-auto w-full p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{exam.subject?.name}</p>
                    <h1 className="text-2xl font-extrabold">{exam.title}</h1>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold tabular-nums ${lowTime ? "bg-red-100 text-red-600 dark:bg-red-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
                    <span className="material-symbols-outlined text-xl">timer</span>
                    {remaining !== null ? formatTime(remaining) : "--:--"}
                </div>
            </div>

            {/* Progress */}
            <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Pregunta {current + 1} de {exam.questions.length}</span>
                    <span>{answeredCount} respondidas</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Question */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                <p className="text-lg font-semibold mb-6">{question.content}</p>
                <div className="space-y-3">
                    {question.options.map((opt) => {
                        const selected = answers[question.id] === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => selectOption(question.id, opt.id)}
                                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                                    selected
                                        ? "border-primary bg-primary/5"
                                        : "border-slate-200 dark:border-slate-700 hover:border-primary/40"
                                }`}
                            >
                                <span className={`size-5 rounded-full border-2 shrink-0 flex items-center justify-center ${selected ? "border-primary bg-primary" : "border-slate-300"}`}>
                                    {selected && <span className="size-2 rounded-full bg-white" />}
                                </span>
                                <span className="text-sm">{opt.content}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                    disabled={current === 0}
                    className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    Anterior
                </button>

                {current < exam.questions.length - 1 ? (
                    <button
                        onClick={() => setCurrent((c) => Math.min(exam.questions.length - 1, c + 1))}
                        className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors"
                    >
                        Siguiente
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {submitting ? (
                            <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>Enviando...</>
                        ) : (
                            <><span className="material-symbols-outlined text-sm">check</span>Finalizar examen</>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
