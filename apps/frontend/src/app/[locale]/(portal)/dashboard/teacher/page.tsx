"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Topic {
    id: string;
    name: string;
    weekNumber: number;
    doubtsCount: number;
    avgScore: number | null;
}

interface SubjectData {
    id: string;
    name: string;
    icon: string;
    color: string;
    totalMessages: number;
    avgScore: number | null;
    topics: Topic[];
}

interface TeacherData {
    subjects: SubjectData[];
}

function ProgressBar({ value, color }: { value: number; color: string }) {
    return (
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className={`bg-${color}-500 h-full rounded-full`} style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
    );
}

export default function TeacherDashboard() {
    const [data, setData] = useState<TeacherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [weekFilter, setWeekFilter] = useState<number | "all">("all");
    const [user, setUser] = useState<any>(null);

    // Modal registrar tema semanal
    const [topicModalOpen, setTopicModalOpen] = useState(false);
    const [topicForm, setTopicForm] = useState({ name: "", weekNumber: 1 });
    const [savingTopic, setSavingTopic] = useState(false);
    const [topicError, setTopicError] = useState<string | null>(null);

    function loadDashboard() {
        return api.get("/dashboard/teacher")
            .then((d: TeacherData) => {
                setData(d);
                setSelectedId((prev) => prev ?? (d.subjects.length > 0 ? d.subjects[0].id : null));
            })
            .catch(console.error);
    }

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        loadDashboard().finally(() => setLoading(false));
    }, []);

    async function handleCreateTopic(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!topicForm.name.trim() || !selectedId) return;
        setSavingTopic(true);
        setTopicError(null);
        try {
            await api.post("/weekly-topics", {
                subjectId: selectedId,
                name: topicForm.name.trim(),
                weekNumber: Number(topicForm.weekNumber),
            });
            setTopicModalOpen(false);
            setTopicForm({ name: "", weekNumber: 1 });
            await loadDashboard();
        } catch (err: unknown) {
            setTopicError(err instanceof Error ? err.message : "No se pudo registrar el tema");
        } finally {
            setSavingTopic(false);
        }
    }

    if (loading) return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
            <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />)}
            </div>
        </div>
    );

    const selected = data?.subjects.find((s) => s.id === selectedId) ?? data?.subjects[0] ?? null;
    const weeks = selected ? [...new Set(selected.topics.map((t) => t.weekNumber))].sort() : [];
    const filteredTopics = selected?.topics.filter((t) => weekFilter === "all" || t.weekNumber === weekFilter) ?? [];
    const topDoubt = selected ? [...selected.topics].sort((a, b) => b.doubtsCount - a.doubtsCount).slice(0, 3) : [];
    const hardestTopic = selected ? [...selected.topics].filter(t => t.avgScore !== null).sort((a, b) => (a.avgScore ?? 100) - (b.avgScore ?? 100))[0] : null;

    return (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-1">Panel del Docente</p>
                    <h2 className="text-3xl font-extrabold tracking-tight">Hola, {user?.firstName ?? "Docente"} 👋</h2>
                    <p className="text-slate-500 mt-1">Analítica de temas y desempeño de tus materias</p>
                </div>
                <button
                    onClick={() => { setTopicForm({ name: "", weekNumber: 1 }); setTopicError(null); setTopicModalOpen(true); }}
                    disabled={!selectedId}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="material-symbols-outlined">add</span>
                    Registrar tema semanal
                </button>
            </div>

            {/* Subject tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {data?.subjects.length === 0 && (
                    <p className="text-slate-400 text-sm">Sin materias asignadas.</p>
                )}
                {data?.subjects.map((s) => (
                    <button key={s.id} onClick={() => { setSelectedId(s.id); setWeekFilter("all"); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                            selectedId === s.id
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}>
                        <span className="material-symbols-outlined text-sm">{s.icon ?? "book"}</span>
                        {s.name}
                    </button>
                ))}
            </div>

            {selected && (
                <>
                    {/* KPIs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                            <p className="text-xs text-slate-500 mb-1">Consultas al agente IA</p>
                            <p className="text-3xl font-extrabold text-primary">{selected.totalMessages}</p>
                            <p className="text-xs text-slate-400 mt-1">mensajes de estudiantes</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                            <p className="text-xs text-slate-500 mb-1">Promedio general</p>
                            <p className="text-3xl font-extrabold">{selected.avgScore ?? "—"}%</p>
                            {selected.avgScore !== null && <div className="mt-2"><ProgressBar value={selected.avgScore} color="blue" /></div>}
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                            <p className="text-xs text-slate-500 mb-1">Tema más consultado</p>
                            <p className="text-lg font-extrabold leading-tight">{topDoubt[0]?.name ?? "—"}</p>
                            <p className="text-xs text-slate-400 mt-1">{topDoubt[0]?.doubtsCount ?? 0} dudas</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                            <p className="text-xs text-slate-500 mb-1">Tema más difícil</p>
                            <p className="text-lg font-extrabold leading-tight">{hardestTopic?.name ?? "—"}</p>
                            {hardestTopic?.avgScore !== undefined && hardestTopic?.avgScore !== null && (
                                <p className="text-xs text-red-500 mt-1">Promedio: {hardestTopic.avgScore}%</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Topics */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg">Temas registrados</h3>
                                <div className="flex gap-1">
                                    <button onClick={() => setWeekFilter("all")}
                                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${weekFilter === "all" ? "bg-primary text-white" : "border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                                        Todos
                                    </button>
                                    {weeks.map((w) => (
                                        <button key={w} onClick={() => setWeekFilter(w)}
                                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${weekFilter === w ? "bg-primary text-white" : "border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                                            Sem {w}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {filteredTopics.length === 0 && (
                                <p className="text-slate-400 text-sm text-center py-8">Sin temas registrados.</p>
                            )}
                            <div className="space-y-3">
                                {filteredTopics.map((topic) => {
                                    const score = topic.avgScore ?? 0;
                                    const barColor = score >= 75 ? "emerald" : score >= 55 ? "yellow" : "red";
                                    return (
                                        <div key={topic.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="font-semibold text-sm">{topic.name}</span>
                                                    <span className="text-xs text-slate-400">· Sem {topic.weekNumber}</span>
                                                </div>
                                                {topic.avgScore !== null
                                                    ? <ProgressBar value={topic.avgScore} color={barColor} />
                                                    : <p className="text-xs text-slate-400">Sin evaluaciones aún</p>}
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-400">Dudas</p>
                                                    <p className="text-sm font-bold">{topic.doubtsCount}</p>
                                                </div>
                                                {topic.avgScore !== null && (
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${barColor}-100 text-${barColor}-700 dark:bg-${barColor}-900/30 dark:text-${barColor}-400`}>
                                                        {topic.avgScore}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top dudas + recomendación */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">help</span>
                                Temas que más dudas generan
                            </h3>
                            <div className="space-y-4">
                                {topDoubt.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Sin datos de consultas.</p>}
                                {topDoubt.map((topic, i) => (
                                    <div key={topic.id} className="flex items-center gap-3">
                                        <span className={`size-7 rounded-full flex items-center justify-center text-xs font-black ${i === 0 ? "bg-red-100 text-red-600" : i === 1 ? "bg-orange-100 text-orange-600" : "bg-yellow-100 text-yellow-600"}`}>
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{topic.name}</p>
                                            <p className="text-xs text-slate-400">{topic.doubtsCount} consultas al agente IA</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {hardestTopic && (
                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-xs text-slate-500 font-semibold mb-3">Recomendación IA</p>
                                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                            <span className="font-bold text-primary">{hardestTopic.name}</span> tiene el promedio más bajo ({hardestTopic.avgScore}%). Se recomienda una clase de reforzamiento.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Modal: registrar tema semanal */}
            {topicModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">menu_book</span>
                                </div>
                                <h3 className="text-lg font-bold">Registrar tema semanal</h3>
                            </div>
                            <button onClick={() => setTopicModalOpen(false)}
                                className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateTopic} className="p-6 space-y-5">
                            <p className="text-sm text-slate-500">
                                Materia: <span className="font-semibold text-slate-700 dark:text-slate-300">{selected?.name}</span>
                            </p>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Nombre del tema <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={topicForm.name}
                                    onChange={(e) => setTopicForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="Ej: Factorización"
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Semana <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={52}
                                    value={topicForm.weekNumber}
                                    onChange={(e) => setTopicForm((f) => ({ ...f, weekNumber: Number(e.target.value) }))}
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            {topicError && (
                                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{topicError}</p>
                            )}

                            <div className="flex gap-3 pt-1">
                                <button type="button" onClick={() => setTopicModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={savingTopic || !topicForm.name.trim()}
                                    className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {savingTopic ? (
                                        <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>Guardando...</>
                                    ) : (
                                        <><span className="material-symbols-outlined text-sm">add</span>Registrar</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
