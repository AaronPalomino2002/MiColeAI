"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { api } from "@/lib/api";
import { LineChart } from "@/components/Charts";

interface SubjectProgress {
    subjectId: string;
    name: string;
    icon: string;
    color: string;
    avgScore: number;
    totalAttempts: number;
}

interface UpcomingExam {
    id: string;
    title: string;
    type: string;
    scheduledFor: string;
    subject: { name: string; icon: string; color: string };
}

interface Improvement {
    topicName: string;
    priority: "low" | "moderate" | "high";
    aiSuggestion: string;
}

interface DashboardData {
    student: { firstName: string; lastName: string; streakCount: number; tokensBalance: number; section: string | null };
    subjectProgress: SubjectProgress[];
    upcomingExams: UpcomingExam[];
    improvements: Improvement[];
}

const PRIORITY_COLOR = { low: "blue", moderate: "yellow", high: "red" } as const;

interface TimelinePoint { date: string; avgScore: number; }

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/dashboard/student")
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
        api.get("/analytics/performance-timeline")
            .then(setTimeline)
            .catch(() => setTimeline([]));
    }, []);

    if (loading) return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
            <div className="grid grid-cols-3 gap-4">
                {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />)}
            </div>
        </div>
    );

    const student = data?.student;
    const name = student ? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() : "—";
    const bestSubject = data?.subjectProgress.sort((a, b) => b.totalAttempts - a.totalAttempts)[0];

    return (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">

            {/* Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Hola, {name} 👋</h2>
                    <p className="text-slate-500 mt-1">
                        {student?.section ? `${student.section} · ` : ""}Sigue así, vas muy bien.
                    </p>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        🔥 {student?.streakCount ?? 0} días seguidos
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        ⚡ {student?.tokensBalance?.toLocaleString() ?? 0} tokens
                    </span>
                </div>
            </div>

            {/* Highlight + Upcoming */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Materia más activa */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-slate-900 text-white p-8 group">
                    <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary via-transparent to-purple-600" />
                    <div className="absolute right-0 bottom-0 p-4 translate-y-4 translate-x-4 opacity-10 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[12rem]">
                            {bestSubject?.icon ?? "auto_awesome"}
                        </span>
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase">
                                Materia más frecuente
                            </span>
                            <h3 className="text-2xl font-bold">{bestSubject?.name ?? "—"}</h3>
                            <p className="text-slate-300 max-w-md">
                                Promedio: <strong>{bestSubject?.avgScore ?? 0}%</strong> · {bestSubject?.totalAttempts ?? 0} evaluaciones completadas
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-4">
                            <Link href="/agents" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2">
                                <span>Seguir aprendiendo</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                            <Link href="/exams" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg font-medium transition-all">
                                Ver exámenes
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Próximos exámenes */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">event_upcoming</span>
                        Próximos exámenes
                    </h4>
                    <div className="space-y-3 flex-1">
                        {data?.upcomingExams.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-6">Sin exámenes programados</p>
                        )}
                        {data?.upcomingExams.map((exam) => (
                            <div key={exam.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-2 rounded-lg">
                                    <span className="material-symbols-outlined">{exam.subject.icon ?? "assignment"}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold leading-tight truncate">{exam.title}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(exam.scheduledFor).toLocaleDateString("es-PE", { weekday: "long", month: "short", day: "numeric" })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link className="mt-4 text-center text-sm font-semibold text-primary hover:underline" href="/exams">
                        Ver todos los exámenes
                    </Link>
                </div>
            </section>

            {/* Progress grid */}
            <section>
                <h3 className="text-xl font-bold mb-6">Progreso por materia</h3>
                {data?.subjectProgress.length === 0 && (
                    <p className="text-slate-400 text-sm">Aún no tienes evaluaciones completadas.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data?.subjectProgress.map((s) => {
                        const barColor = s.avgScore >= 75 ? "emerald" : s.avgScore >= 55 ? "yellow" : "red";
                        return (
                            <div key={s.subjectId} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between mb-5">
                                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-3xl">{s.icon ?? "book"}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-slate-400 font-medium">Promedio</span>
                                        <p className="text-lg font-bold">{s.avgScore}%</p>
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold mb-1">{s.name}</h4>
                                <p className="text-sm text-slate-500 mb-4">{s.totalAttempts} evaluaciones completadas</p>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div className={`bg-${barColor}-500 h-full rounded-full`} style={{ width: `${s.avgScore}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Evolución académica */}
            {timeline.length > 1 && (
                <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">trending_up</span>
                        Tu evolución
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">Promedio de tus evaluaciones en el tiempo</p>
                    <LineChart data={timeline.map((t) => ({ label: new Date(t.date).toLocaleDateString("es-PE", { day: "2-digit", month: "short" }), value: t.avgScore }))} />
                </section>
            )}

            {/* Recomendaciones IA */}
            {(data?.improvements.length ?? 0) > 0 && (
                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">lightbulb</span>
                        Recomendaciones de tu tutor IA
                    </h3>
                    <div className="space-y-3">
                        {data?.improvements.map((imp, i) => {
                            const color = PRIORITY_COLOR[imp.priority] ?? "slate";
                            return (
                                <div key={i} className={`p-4 rounded-xl border border-${color}-100 dark:border-${color}-900/30 bg-${color}-50 dark:bg-${color}-900/10 flex gap-3`}>
                                    <span className={`material-symbols-outlined text-${color}-500 mt-0.5`}>recommend</span>
                                    <div>
                                        <p className={`text-xs font-bold text-${color}-600 dark:text-${color}-400 mb-1`}>{imp.topicName}</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{imp.aiSuggestion}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-primary/5 rounded-xl border border-primary/20 p-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="hidden sm:flex size-14 rounded-full bg-primary/20 items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">¿Listo para estudiar?</h4>
                        <p className="text-slate-500 text-sm">Chatea con tu agente IA o rinde una evaluación ahora mismo.</p>
                    </div>
                </div>
                <Link href="/agents" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap">
                    <span className="material-symbols-outlined">play_arrow</span>
                    Ir a materias
                </Link>
            </section>
        </div>
    );
}
