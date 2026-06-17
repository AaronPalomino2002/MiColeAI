"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Subject {
    id: string;
    name: string;
}
interface TeacherSubject {
    id: string;
    name: string;
}
interface Topic {
    id: string;
    name: string;
    weekNumber: number;
}

interface OptionForm {
    content: string;
    isCorrect: boolean;
}
interface QuestionForm {
    content: string;
    points: number;
    options: OptionForm[];
}

function emptyQuestion(): QuestionForm {
    return {
        content: "",
        points: 10,
        options: [
            { content: "", isCorrect: true },
            { content: "", isCorrect: false },
            { content: "", isCorrect: false },
            { content: "", isCorrect: false },
        ],
    };
}

const EXAM_TYPES = [
    { value: "daily", label: "Temas del día" },
    { value: "weekly", label: "Semanal" },
    { value: "mock", label: "Simulacro" },
    { value: "adaptive", label: "Adaptativa" },
];

export default function CreateExamPage() {
    const router = useRouter();

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);

    const [form, setForm] = useState({
        subjectId: "",
        topicId: "",
        type: "weekly",
        title: "",
        description: "",
        timeLimitMinutes: 30,
        difficulty: "medium",
        scheduledFor: "",
    });
    const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion()]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar materias del docente desde su dashboard
    useEffect(() => {
        api.get("/dashboard/teacher")
            .then((d: { subjects: TeacherSubject[] }) => {
                setSubjects(d.subjects ?? []);
                if (d.subjects?.length) setForm((f) => ({ ...f, subjectId: d.subjects[0].id }));
            })
            .catch(console.error);
    }, []);

    // Cargar temas de la materia seleccionada
    useEffect(() => {
        if (!form.subjectId) { setTopics([]); return; }
        api.get(`/weekly-topics?subjectId=${form.subjectId}`)
            .then(setTopics)
            .catch(() => setTopics([]));
    }, [form.subjectId]);

    function updateQuestion(qi: number, patch: Partial<QuestionForm>) {
        setQuestions((qs) => qs.map((q, i) => (i === qi ? { ...q, ...patch } : q)));
    }
    function updateOption(qi: number, oi: number, patch: Partial<OptionForm>) {
        setQuestions((qs) =>
            qs.map((q, i) =>
                i === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? { ...o, ...patch } : o)) } : q,
            ),
        );
    }
    function setCorrect(qi: number, oi: number) {
        setQuestions((qs) =>
            qs.map((q, i) =>
                i === qi ? { ...q, options: q.options.map((o, j) => ({ ...o, isCorrect: j === oi })) } : q,
            ),
        );
    }

    function valid(): boolean {
        if (!form.subjectId || !form.title.trim()) return false;
        return questions.every(
            (q) => q.content.trim() && q.options.filter((o) => o.content.trim()).length >= 2 && q.options.some((o) => o.isCorrect),
        );
    }

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!valid()) { setError("Completa todas las preguntas con al menos 2 opciones y una correcta."); return; }
        setSaving(true);
        setError(null);
        try {
            await api.post("/exams", {
                subjectId: form.subjectId,
                topicId: form.topicId || undefined,
                type: form.type,
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                timeLimitMinutes: Number(form.timeLimitMinutes),
                difficulty: form.difficulty,
                scheduledFor: form.scheduledFor || undefined,
                questions: questions.map((q) => ({
                    content: q.content.trim(),
                    type: "multiple_choice",
                    points: Number(q.points),
                    options: q.options.filter((o) => o.content.trim()).map((o) => ({ content: o.content.trim(), isCorrect: o.isCorrect })),
                })),
            });
            router.push("/exams");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "No se pudo crear el examen");
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto w-full p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Docente</p>
                    <h1 className="text-2xl font-extrabold">Crear examen</h1>
                </div>
                <button type="button" onClick={() => router.push("/exams")} className="text-sm font-semibold text-slate-500 hover:text-primary">
                    Cancelar
                </button>
            </div>

            {/* Datos del examen */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Materia *</label>
                        <select value={form.subjectId} onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value, topicId: "" }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary">
                            {subjects.length === 0 && <option value="">Sin materias asignadas</option>}
                            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Tema (opcional)</label>
                        <select value={form.topicId} onChange={(e) => setForm((f) => ({ ...f, topicId: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary">
                            <option value="">— Ninguno —</option>
                            {topics.map((t) => <option key={t.id} value={t.id}>Sem {t.weekNumber}: {t.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Título *</label>
                    <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required
                        placeholder="Ej: Evaluación semanal - Productos notables"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Descripción</label>
                    <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Tipo</label>
                        <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-sm outline-none focus:border-primary">
                            {EXAM_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Dificultad</label>
                        <select value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-sm outline-none focus:border-primary">
                            <option value="easy">Fácil</option>
                            <option value="medium">Media</option>
                            <option value="hard">Difícil</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Min.</label>
                        <input type="number" min={1} value={form.timeLimitMinutes}
                            onChange={(e) => setForm((f) => ({ ...f, timeLimitMinutes: Number(e.target.value) }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Fecha</label>
                        <input type="date" value={form.scheduledFor}
                            onChange={(e) => setForm((f) => ({ ...f, scheduledFor: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-sm outline-none focus:border-primary" />
                    </div>
                </div>
            </div>

            {/* Preguntas */}
            {questions.map((q, qi) => (
                <div key={qi} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center">{qi + 1}</span>
                            Pregunta
                        </h3>
                        {questions.length > 1 && (
                            <button type="button" onClick={() => setQuestions((qs) => qs.filter((_, i) => i !== qi))}
                                className="text-red-500 text-sm font-semibold hover:underline">Eliminar</button>
                        )}
                    </div>

                    <textarea value={q.content} onChange={(e) => updateQuestion(qi, { content: e.target.value })}
                        placeholder="Enunciado de la pregunta" rows={2}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none" />

                    <div className="space-y-2">
                        {q.options.map((o, oi) => (
                            <div key={oi} className="flex items-center gap-3">
                                <button type="button" onClick={() => setCorrect(qi, oi)}
                                    title="Marcar como correcta"
                                    className={`size-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${o.isCorrect ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}>
                                    {o.isCorrect && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                </button>
                                <input value={o.content} onChange={(e) => updateOption(qi, oi, { content: e.target.value })}
                                    placeholder={`Opción ${oi + 1}`}
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-500">Puntos:</label>
                        <input type="number" min={1} value={q.points} onChange={(e) => updateQuestion(qi, { points: Number(e.target.value) })}
                            className="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary" />
                    </div>
                </div>
            ))}

            <button type="button" onClick={() => setQuestions((qs) => [...qs, emptyQuestion()])}
                className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add</span> Añadir pregunta
            </button>

            {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={saving || !valid()}
                className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {saving ? (
                    <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>Creando...</>
                ) : (
                    <><span className="material-symbols-outlined text-sm">save</span>Crear examen</>
                )}
            </button>
        </form>
    );
}
