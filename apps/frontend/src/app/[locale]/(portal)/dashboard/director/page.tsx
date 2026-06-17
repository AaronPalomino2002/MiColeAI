"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { api } from "@/lib/api";

interface GradeStat {
    gradeId: string;
    name: string;
    students: number;
    avgScore: number | null;
    activeAlerts: number;
}

interface SubjectStat {
    id: string;
    name: string;
    icon: string;
    color: string;
    avgScore: number | null;
    totalMessages: number;
    topTopic: string | null;
}

interface DirectorData {
    kpis: { totalStudents: number; totalAlerts: number; totalMessages: number; overallAvg: number | null };
    grades: GradeStat[];
    subjects: SubjectStat[];
}

function ProgressBar({ value, color }: { value: number; color: string }) {
    return (
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className={`bg-${color}-500 h-full rounded-full`} style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
    );
}

const EMPTY_STAFF = { role: "teacher", firstName: "", lastName: "", email: "", password: "" };

export default function DirectorDashboard() {
    const [data, setData] = useState<DirectorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"grades" | "subjects">("grades");
    const [user, setUser] = useState<any>(null);

    // Modal registrar staff (docente / tutor)
    const [staffModalOpen, setStaffModalOpen] = useState(false);
    const [staffForm, setStaffForm] = useState(EMPTY_STAFF);
    const [savingStaff, setSavingStaff] = useState(false);
    const [staffError, setStaffError] = useState<string | null>(null);
    const [staffOk, setStaffOk] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        api.get("/dashboard/director")
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    async function handleCreateStaff(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!staffForm.email.trim() || !staffForm.password.trim()) return;
        setSavingStaff(true);
        setStaffError(null);
        try {
            await api.post("/users", staffForm);
            setStaffOk(true);
            setStaffForm(EMPTY_STAFF);
            setTimeout(() => { setStaffModalOpen(false); setStaffOk(false); }, 1200);
        } catch (err: unknown) {
            setStaffError(err instanceof Error ? err.message : "No se pudo registrar el usuario");
        } finally {
            setSavingStaff(false);
        }
    }

    // Exporta el reporte institucional como CSV (sin dependencias).
    function exportReport() {
        if (!data) return;
        const rows: string[] = [];
        rows.push("Reporte institucional — EduInsight AI");
        rows.push(`Generado,${new Date().toLocaleString("es-PE")}`);
        rows.push("");
        rows.push("KPIs");
        rows.push(`Total estudiantes,${data.kpis.totalStudents}`);
        rows.push(`Promedio general,${data.kpis.overallAvg ?? "—"}`);
        rows.push(`Consultas a la IA,${data.kpis.totalMessages}`);
        rows.push(`Alertas activas,${data.kpis.totalAlerts}`);
        rows.push("");
        rows.push("Por grado,Estudiantes,Promedio,Alertas activas");
        data.grades.forEach((g) => rows.push(`${g.name},${g.students},${g.avgScore ?? "—"},${g.activeAlerts}`));
        rows.push("");
        rows.push("Por materia,Promedio,Consultas IA,Tema más consultado");
        data.subjects.forEach((s) => rows.push(`${s.name},${s.avgScore ?? "—"},${s.totalMessages},${s.topTopic ?? "—"}`));

        const blob = new Blob(["﻿" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte-institucional-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    if (loading) return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
            <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />)}
            </div>
        </div>
    );

    const worstGrade = data?.grades
        .filter((g) => g.avgScore !== null)
        .sort((a, b) => (a.avgScore ?? 100) - (b.avgScore ?? 100))[0];

    return (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-1">Panel del Director</p>
                    <h2 className="text-3xl font-extrabold tracking-tight">Hola, {user?.firstName ?? "Director"} 👋</h2>
                    <p className="text-slate-500 mt-1">PAMER — Visión institucional 2026</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={exportReport} className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Exportar reporte
                    </button>
                    <button
                        onClick={() => { setStaffForm(EMPTY_STAFF); setStaffError(null); setStaffOk(false); setStaffModalOpen(true); }}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        Registrar docente
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: "group", label: "Total estudiantes", value: data?.kpis.totalStudents ?? 0, sub: `${data?.grades.length ?? 0} grados`, iconColor: "text-primary" },
                    { icon: "trending_up", label: "Promedio general", value: data?.kpis.overallAvg !== null ? `${data?.kpis.overallAvg}%` : "—", sub: "meta: 75%", iconColor: "text-emerald-500" },
                    { icon: "smart_toy", label: "Consultas a la IA", value: data?.kpis.totalMessages ?? 0, sub: "período actual", iconColor: "text-blue-500" },
                    { icon: "warning", label: "Alertas activas", value: data?.kpis.totalAlerts ?? 0, sub: "requieren intervención", iconColor: "text-red-500" },
                ].map(({ icon, label, value, sub, iconColor }) => (
                    <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                        <div className={`flex items-center gap-2 mb-2 ${iconColor}`}>
                            <span className="material-symbols-outlined">{icon}</span>
                            <p className="text-sm text-slate-500">{label}</p>
                        </div>
                        <p className="text-3xl font-extrabold">{value}</p>
                        <p className="text-xs text-slate-400 mt-1">{sub}</p>
                    </div>
                ))}
            </div>

            {/* Highlight crítico */}
            {worstGrade && (
                <div className="relative overflow-hidden rounded-xl bg-slate-900 text-white p-8">
                    <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-primary via-transparent to-purple-700" />
                    <div className="absolute right-6 bottom-0 opacity-10">
                        <span className="material-symbols-outlined text-[8rem]">analytics</span>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">Atención institucional</p>
                            <h3 className="text-2xl font-bold mb-1">
                                {worstGrade.name} requiere atención
                            </h3>
                            <p className="text-slate-300 text-sm">
                                {worstGrade.activeAlerts} alertas activas · Promedio {worstGrade.avgScore}% ·{" "}
                                {worstGrade.avgScore !== null && worstGrade.avgScore < 75
                                    ? `Brecha de ${75 - worstGrade.avgScore}pp respecto a la meta institucional (75%)`
                                    : "Por encima de la meta"}
                            </p>
                        </div>
                        <Link href={`/manage/grades/${worstGrade.gradeId}`} className="shrink-0 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined">open_in_new</span>
                            Ver detalle del grado
                        </Link>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div>
                <div className="flex gap-1 mb-6">
                    {(["grades", "subjects"] as const).map((v) => (
                        <button key={v} onClick={() => setView(v)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${view === v ? "bg-primary text-white shadow-md shadow-primary/20" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                            {v === "grades" ? "Por grado" : "Por materia"}
                        </button>
                    ))}
                </div>

                {view === "grades" && (
                    <div className="space-y-3">
                        {data?.grades.map((row) => {
                            const score = row.avgScore ?? 0;
                            const color = score >= 75 ? "emerald" : score >= 60 ? "yellow" : "red";
                            return (
                                <div key={row.gradeId} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="w-44 shrink-0">
                                        <p className="font-bold text-sm">{row.name}</p>
                                        <p className="text-xs text-slate-400">{row.students} estudiantes</p>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Promedio</span>
                                            <span className="font-bold">{row.avgScore !== null ? `${row.avgScore}%` : "Sin datos"}</span>
                                        </div>
                                        {row.avgScore !== null && <ProgressBar value={row.avgScore} color={color} />}
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        {row.activeAlerts > 0 ? (
                                            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                                <span className="material-symbols-outlined text-sm">warning</span>
                                                {row.activeAlerts} alertas
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                Sin alertas
                                            </span>
                                        )}
                                        <Link href={`/manage/grades/${row.gradeId}`} className="text-xs font-semibold text-primary hover:underline whitespace-nowrap">Ver detalle →</Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {view === "subjects" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {data?.subjects.map((s) => {
                            const score = s.avgScore ?? 0;
                            const color = score >= 75 ? "emerald" : score >= 60 ? "yellow" : "red";
                            return (
                                <div key={s.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-2xl">{s.icon ?? "book"}</span>
                                        </div>
                                        {s.avgScore !== null && (
                                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-400`}>
                                                {s.avgScore}%
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-base mb-1">{s.name}</h4>
                                    <p className="text-xs text-slate-500 mb-4">
                                        {s.topTopic
                                            ? <>Tema más consultado: <span className="font-semibold text-slate-700 dark:text-slate-300">{s.topTopic}</span></>
                                            : "Sin consultas registradas"}
                                    </p>
                                    {s.avgScore !== null && <ProgressBar value={s.avgScore} color={color} />}
                                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                                        <span>{s.totalMessages} consultas IA</span>
                                        <span>Meta: 75%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CTA */}
            <section className="bg-primary/5 rounded-xl border border-primary/20 p-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="hidden sm:flex size-14 rounded-full bg-primary/20 items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">insights</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">Reporte institucional completo</h4>
                        <p className="text-slate-500 text-sm">Descarga el resumen ejecutivo del período con todas las métricas del colegio.</p>
                    </div>
                </div>
                <button onClick={exportReport} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md whitespace-nowrap flex items-center gap-2">
                    <span className="material-symbols-outlined">download</span>
                    Descargar reporte
                </button>
            </section>

            {/* Modal: registrar staff (docente / tutor) */}
            {staffModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">person_add</span>
                                </div>
                                <h3 className="text-lg font-bold">Registrar personal</h3>
                            </div>
                            <button onClick={() => setStaffModalOpen(false)}
                                className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateStaff} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rol</label>
                                <select
                                    value={staffForm.role}
                                    onChange={(e) => setStaffForm((f) => ({ ...f, role: e.target.value }))}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors">
                                    <option value="teacher">Docente</option>
                                    <option value="tutor">Tutor</option>
                                    <option value="director">Director</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombres</label>
                                    <input value={staffForm.firstName}
                                        onChange={(e) => setStaffForm((f) => ({ ...f, firstName: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Apellidos</label>
                                    <input value={staffForm.lastName}
                                        onChange={(e) => setStaffForm((f) => ({ ...f, lastName: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input type="email" required value={staffForm.email}
                                    onChange={(e) => setStaffForm((f) => ({ ...f, email: e.target.value }))}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Contraseña temporal <span className="text-red-500">*</span>
                                </label>
                                <input type="text" required value={staffForm.password}
                                    onChange={(e) => setStaffForm((f) => ({ ...f, password: e.target.value }))}
                                    placeholder="El usuario podrá cambiarla luego"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                            </div>

                            {staffError && (
                                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{staffError}</p>
                            )}
                            {staffOk && (
                                <p className="text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>Usuario registrado
                                </p>
                            )}

                            <div className="flex gap-3 pt-1">
                                <button type="button" onClick={() => setStaffModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={savingStaff || !staffForm.email.trim() || !staffForm.password.trim()}
                                    className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {savingStaff ? (
                                        <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>Guardando...</>
                                    ) : (
                                        <><span className="material-symbols-outlined text-sm">person_add</span>Registrar</>
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
