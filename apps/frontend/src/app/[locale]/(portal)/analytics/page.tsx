"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LineChart, BarChart } from "@/components/Charts";

interface TimelinePoint { date: string; avgScore: number; attempts: number; }
interface GradeCompare { gradeId: string; name: string; avgScore: number | null; }
interface Doubt { topicId: string; topicName: string; doubts: number; }

export default function AnalyticsPage() {
    const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
    const [grades, setGrades] = useState<GradeCompare[]>([]);
    const [doubts, setDoubts] = useState<Doubt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get("/analytics/performance-timeline").then(setTimeline).catch(() => setTimeline([])),
            api.get("/analytics/compare-grades").then(setGrades).catch(() => setGrades([])),
            api.get("/analytics/frequent-doubts").then(setDoubts).catch(() => setDoubts([])),
        ]).finally(() => setLoading(false));
    }, []);

    const maxDoubts = Math.max(1, ...doubts.map((d) => d.doubts));

    if (loading) return (
        <div className="p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto w-full p-6 md:p-8 space-y-8">
            <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Inteligencia académica</p>
                <h1 className="text-2xl font-extrabold">Analítica institucional</h1>
            </div>

            {/* Timeline */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="font-bold mb-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">trending_up</span>
                    Evolución del promedio
                </h3>
                <p className="text-xs text-slate-400 mb-4">Promedio de notas por fecha de evaluación</p>
                <LineChart data={timeline.map((t) => ({ label: new Date(t.date).toLocaleDateString("es-PE", { day: "2-digit", month: "short" }), value: t.avgScore }))} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Comparativo grados */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="font-bold mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">bar_chart</span>
                        Rendimiento por grado
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Promedio comparativo entre grados</p>
                    <BarChart data={grades.map((g) => ({ label: g.name, value: g.avgScore }))} />
                </section>

                {/* Dudas frecuentes */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="font-bold mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">help</span>
                        Temas con más dudas
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Consultas de estudiantes al agente IA, por tema</p>
                    {doubts.length === 0 ? (
                        <p className="text-sm text-slate-400 py-8 text-center">Sin consultas registradas.</p>
                    ) : (
                        <div className="space-y-3">
                            {doubts.map((d, i) => (
                                <div key={d.topicId} className="flex items-center gap-3">
                                    <span className={`size-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${i === 0 ? "bg-red-100 text-red-600" : i === 1 ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"}`}>{i + 1}</span>
                                    <span className="flex-1 text-sm font-medium truncate">{d.topicName}</span>
                                    <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                        <div className="bg-orange-400 h-full rounded-full" style={{ width: `${(d.doubts / maxDoubts) * 100}%` }} />
                                    </div>
                                    <span className="w-8 text-right text-sm font-bold">{d.doubts}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
