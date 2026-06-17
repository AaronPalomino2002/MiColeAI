"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { api } from "@/lib/api";

interface Attempt {
    id: string;
    score: number | null;
    timeSpentSeconds: number;
    startedAt: string;
    completedAt: string | null;
    exam: { id: string; title: string; subject?: { name: string } } | null;
}

export default function ExamHistoryPage() {
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/exam-attempts")
            .then(setAttempts)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-4xl mx-auto w-full p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold">Historial de evaluaciones</h1>
                    <p className="text-slate-500 text-sm mt-1">Tus intentos y resultados</p>
                </div>
                <Link href="/exams" className="text-sm font-semibold text-primary hover:underline">Ver exámenes</Link>
            </div>

            {loading ? (
                <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
                </div>
            ) : attempts.length === 0 ? (
                <p className="text-slate-400 text-center py-16">Aún no has rendido ningún examen.</p>
            ) : (
                <div className="space-y-3">
                    {attempts.map((a) => {
                        const done = !!a.completedAt;
                        const score = a.score ?? 0;
                        const color = !done ? "slate" : score >= 75 ? "emerald" : score >= 55 ? "yellow" : "red";
                        const mins = Math.floor(a.timeSpentSeconds / 60);
                        return (
                            <div key={a.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4">
                                <div className={`size-14 rounded-xl flex flex-col items-center justify-center bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 shrink-0`}>
                                    <span className="text-lg font-black leading-none">{done ? `${score}%` : "—"}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate">{a.exam?.title ?? "Examen"}</p>
                                    <p className="text-xs text-slate-500">
                                        {a.exam?.subject?.name ?? ""} · {done ? `${mins} min · ${new Date(a.completedAt!).toLocaleDateString("es-PE")}` : "En progreso"}
                                    </p>
                                </div>
                                {done && (
                                    <Link href={`/exams/${a.exam?.id}/result?attemptId=${a.id}`}
                                        className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
                                        Ver resultado →
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
