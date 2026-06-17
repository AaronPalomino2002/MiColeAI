"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface StudentRow {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    district: string;
    avgScore: number | null;
    lastActivity: string | null;
    isInactive: boolean;
    isRisk: boolean;
    isOutstanding: boolean;
}

interface Alert {
    id: string;
    type: string;
    description: string;
    resolved: boolean;
    createdAt: string;
    student: { firstName: string; lastName: string };
    subject: { name: string } | null;
}

interface TutorData {
    section: { name: string; grade: string } | null;
    stats: { total: number; active: number; inactive: number; atRisk: number; outstanding: number } | null;
    students: StudentRow[];
    alerts: Alert[];
}

const ALERT_COLORS: Record<string, string> = {
    low_performance: "red", performance_drop: "orange", inactivity: "yellow", upcoming_exam: "blue",
};
const ALERT_ICONS: Record<string, string> = {
    low_performance: "trending_down", performance_drop: "warning", inactivity: "schedule", upcoming_exam: "event",
};
const ALERT_LABELS: Record<string, string> = {
    low_performance: "Bajo rendimiento", performance_drop: "Descenso de desempeño",
    inactivity: "Inactividad", upcoming_exam: "Examen próximo",
};

export default function TutorDashboard() {
    const [data, setData] = useState<TutorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"all" | "risk" | "outstanding">("all");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        api.get("/dashboard/tutor")
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    async function resolveAlert(alertId: string) {
        // Optimista: marcar como resuelta de inmediato
        setData((prev) => prev ? ({
            ...prev,
            alerts: prev.alerts.map((a) => a.id === alertId ? { ...a, resolved: true } : a),
        }) : prev);

        try {
            await api.patch(`/alerts/${alertId}/resolve`, {});
        } catch (e) {
            console.error("No se pudo resolver la alerta:", e);
            // Revertir si falla
            setData((prev) => prev ? ({
                ...prev,
                alerts: prev.alerts.map((a) => a.id === alertId ? { ...a, resolved: false } : a),
            }) : prev);
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

    const filtered = data?.students.filter((s) =>
        tab === "risk" ? s.isRisk : tab === "outstanding" ? s.isOutstanding : true
    ) ?? [];

    const activeAlerts = data?.alerts.filter((a) => !a.resolved) ?? [];

    return (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-1">Panel del Tutor</p>
                    <h2 className="text-3xl font-extrabold tracking-tight">Hola, {user?.firstName ?? "Tutor"} 👋</h2>
                    <p className="text-slate-500 mt-1">
                        {data?.section ? `${data.section.grade} · Sección ${data.section.name}` : "Sin sección asignada"}
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                    <span className="material-symbols-outlined">add_alert</span>
                    Nueva intervención
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: "group", label: "Total estudiantes", value: data?.stats?.total ?? 0, color: "blue" },
                    { icon: "check_circle", label: "Activos", value: data?.stats?.active ?? 0, color: "emerald" },
                    { icon: "schedule", label: "Inactivos", value: data?.stats?.inactive ?? 0, color: "yellow" },
                    { icon: "warning", label: "En riesgo", value: data?.stats?.atRisk ?? 0, color: "red" },
                ].map(({ icon, label, value, color }) => (
                    <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4">
                        <div className={`size-12 rounded-xl flex items-center justify-center bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
                            <span className="material-symbols-outlined text-2xl">{icon}</span>
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold">{value}</p>
                            <p className="text-sm text-slate-500">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alerts */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">notifications_active</span>
                        Alertas activas
                        {activeAlerts.length > 0 && (
                            <span className="ml-auto bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                                {activeAlerts.length}
                            </span>
                        )}
                    </h3>
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-80">
                        {activeAlerts.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-8">Sin alertas activas 🎉</p>
                        )}
                        {activeAlerts.map((alert) => {
                            const color = ALERT_COLORS[alert.type] ?? "slate";
                            return (
                                <div key={alert.id} className={`p-4 rounded-xl border border-${color}-100 dark:border-${color}-900/30 bg-${color}-50 dark:bg-${color}-900/10`}>
                                    <div className="flex items-start gap-3">
                                        <span className={`material-symbols-outlined text-${color}-500 mt-0.5`}>{ALERT_ICONS[alert.type] ?? "info"}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-bold text-${color}-600 dark:text-${color}-400 mb-1`}>
                                                {ALERT_LABELS[alert.type] ?? alert.type} — {alert.student.firstName} {alert.student.lastName}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{alert.description}</p>
                                            {alert.subject && (
                                                <span className="inline-block mt-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                                                    {alert.subject.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => resolveAlert(alert.id)} className="mt-3 w-full text-xs font-semibold text-primary hover:underline text-left">
                                        Marcar como resuelta →
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Student table */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Estudiantes del aula</h3>
                        <div className="flex gap-1">
                            {(["all", "risk", "outstanding"] as const).map((t) => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === t ? "bg-primary text-white" : "border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                                    {t === "all" ? "Todos" : t === "risk" ? "🔴 Riesgo" : "⭐ Destacados"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 text-left">
                                    <th className="pb-3 font-semibold text-slate-500">Estudiante</th>
                                    <th className="pb-3 font-semibold text-slate-500">Promedio</th>
                                    <th className="pb-3 font-semibold text-slate-500 hidden md:table-cell">Distrito</th>
                                    <th className="pb-3 font-semibold text-slate-500">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filtered.length === 0 && (
                                    <tr><td colSpan={4} className="py-8 text-center text-slate-400 text-sm">Sin estudiantes en esta categoría</td></tr>
                                )}
                                {filtered.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-3 font-semibold">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {s.firstName[0]}{s.lastName[0]}
                                                </div>
                                                {s.firstName} {s.lastName}
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            {s.avgScore !== null
                                                ? <span className={`font-bold ${s.avgScore >= 75 ? "text-emerald-600" : s.avgScore >= 55 ? "text-yellow-600" : "text-red-600"}`}>{s.avgScore}%</span>
                                                : <span className="text-slate-400 text-xs">Sin datos</span>}
                                        </td>
                                        <td className="py-3 text-slate-500 hidden md:table-cell">{s.district ?? "—"}</td>
                                        <td className="py-3">
                                            {s.isRisk && <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">En riesgo</span>}
                                            {s.isOutstanding && !s.isRisk && <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">Destacado</span>}
                                            {s.isInactive && !s.isRisk && !s.isOutstanding && <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">Inactivo</span>}
                                            {!s.isRisk && !s.isOutstanding && !s.isInactive && <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">Activo</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <section className="bg-primary/5 rounded-xl border border-primary/20 p-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="hidden sm:flex size-14 rounded-full bg-primary/20 items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">school</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">¿Algún estudiante necesita apoyo?</h4>
                        <p className="text-slate-500 text-sm">Coordina una intervención antes de que sea tarde.</p>
                    </div>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md whitespace-nowrap flex items-center gap-2">
                    <span className="material-symbols-outlined">contact_support</span>
                    Registrar intervención
                </button>
            </section>
        </div>
    );
}
