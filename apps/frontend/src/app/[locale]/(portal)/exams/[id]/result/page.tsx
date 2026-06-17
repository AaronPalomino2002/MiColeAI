"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { api } from "@/lib/api";

interface Improvement {
    topicName: string;
    priority: "low" | "moderate" | "high";
    aiSuggestion: string;
}
interface ResultData {
    id: string;
    score: number;
    timeSpentSeconds: number;
    completedAt: string;
    aiFeedbackSummary: string;
    exam: { id: string; title: string; subject: string } | null;
    improvements: Improvement[];
}

const PRIORITY_COLOR = { low: "blue", moderate: "yellow", high: "red" } as const;

function ResultContent() {
    const searchParams = useSearchParams();
    const attemptId = searchParams.get("attemptId");
    const [data, setData] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!attemptId) { setLoading(false); return; }
        api.get(`/exam-attempts/${attemptId}`)
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [attemptId]);

    if (loading) return (
        <div className="flex items-center justify-center h-full text-slate-400 gap-2 p-12">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            Calificando...
        </div>
    );

    if (!data) return (
        <div className="p-12 text-center text-slate-500">No se encontró el resultado.</div>
    );

    const passed = data.score >= 60;
    const mins = Math.floor(data.timeSpentSeconds / 60);
    const secs = data.timeSpentSeconds % 60;

    return (
        <div className="max-w-2xl mx-auto w-full p-6 md:p-8 space-y-8">
            {/* Score hero */}
            <div className={`relative overflow-hidden rounded-3xl p-8 text-center ${passed ? "bg-emerald-600" : "bg-amber-600"} text-white`}>
                <span className="material-symbols-outlined text-6xl mb-2">{passed ? "celebration" : "psychology_alt"}</span>
                <p className="text-sm font-bold uppercase tracking-widest opacity-80">
                    {data.exam?.subject} · {data.exam?.title}
                </p>
                <p className="text-6xl font-black my-2">{data.score}%</p>
                <p className="font-semibold opacity-90">
                    {passed ? "¡Aprobado! Buen trabajo." : "Sigue practicando, vas a mejorar."}
                </p>
                <p className="text-xs opacity-70 mt-2">Tiempo: {mins}m {secs}s</p>
            </div>

            {/* AI feedback */}
            {data.aiFeedbackSummary && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">smart_toy</span>
                        Retroalimentación de tu tutor IA
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{data.aiFeedbackSummary}</p>
                </div>
            )}

            {/* Improvement areas */}
            {data.improvements.length > 0 && (
                <div>
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">target</span>
                        Áreas para reforzar
                    </h3>
                    <div className="space-y-3">
                        {data.improvements.map((imp, i) => {
                            const color = PRIORITY_COLOR[imp.priority] ?? "slate";
                            return (
                                <div key={i} className={`p-4 rounded-xl border border-${color}-100 dark:border-${color}-900/30 bg-${color}-50 dark:bg-${color}-900/10`}>
                                    <p className={`text-xs font-bold text-${color}-600 dark:text-${color}-400 mb-1`}>{imp.topicName}</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{imp.aiSuggestion}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <Link href="/exams" className="flex-1 text-center px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Volver a exámenes
                </Link>
                <Link href="/dashboard" className="flex-1 text-center px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors">
                    Ir al inicio
                </Link>
            </div>
        </div>
    );
}

export default function ExamResultPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-full text-slate-400 gap-2 p-12">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Cargando...
            </div>
        }>
            <ResultContent />
        </Suspense>
    );
}
