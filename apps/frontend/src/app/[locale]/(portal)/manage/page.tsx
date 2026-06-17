"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Grade { id: string; name: string; }
interface Section { id: string; name: string; tutor?: { firstName: string; lastName: string } | null; }
interface Staff { id: string; firstName: string; lastName: string; email: string; role: string; }

type Tab = "school" | "structure" | "staff";

export default function ManagePage() {
    const [tab, setTab] = useState<Tab>("structure");

    // School
    const [school, setSchool] = useState<{ name: string; academicYear: number; district: string } | null>(null);

    // Structure
    const [grades, setGrades] = useState<Grade[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [newGrade, setNewGrade] = useState("");
    const [newSection, setNewSection] = useState("");

    // Staff
    const [staff, setStaff] = useState<Staff[]>([]);

    const [msg, setMsg] = useState<string | null>(null);

    function flash(text: string) {
        setMsg(text);
        setTimeout(() => setMsg(null), 2500);
    }

    useEffect(() => {
        api.get("/schools/me").then(setSchool).catch(() => setSchool(null));
        loadGrades();
        api.get("/users").then(setStaff).catch(() => setStaff([]));
    }, []);

    function loadGrades() {
        api.get("/grades").then((g: Grade[]) => {
            setGrades(g);
            setSelectedGrade((prev) => prev ?? (g.length ? g[0].id : null));
        }).catch(() => setGrades([]));
    }

    useEffect(() => {
        if (!selectedGrade) { setSections([]); return; }
        api.get(`/sections?gradeId=${selectedGrade}`).then(setSections).catch(() => setSections([]));
    }, [selectedGrade]);

    async function addGrade() {
        if (!newGrade.trim()) return;
        await api.post("/grades", { name: newGrade.trim() });
        setNewGrade("");
        loadGrades();
        flash("Grado creado");
    }

    async function addSection() {
        if (!newSection.trim() || !selectedGrade) return;
        await api.post("/sections", { gradeId: selectedGrade, name: newSection.trim() });
        setNewSection("");
        const s = await api.get(`/sections?gradeId=${selectedGrade}`);
        setSections(s);
        flash("Sección creada");
    }

    async function assignTutor(sectionId: string, tutorId: string) {
        if (!tutorId) return;
        await api.patch(`/sections/${sectionId}/tutor`, { tutorId });
        const s = await api.get(`/sections?gradeId=${selectedGrade}`);
        setSections(s);
        flash("Tutor asignado");
    }

    const tutors = staff.filter((s) => s.role === "tutor");

    return (
        <div className="max-w-5xl mx-auto w-full p-6 md:p-8 space-y-6">
            <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Director</p>
                <h1 className="text-2xl font-extrabold">Gestión institucional</h1>
            </div>

            {msg && (
                <p className="text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>{msg}
                </p>
            )}

            {/* Tabs */}
            <div className="flex gap-1">
                {([["structure", "Grados y secciones"], ["staff", "Personal"], ["school", "Colegio"]] as [Tab, string][]).map(([v, label]) => (
                    <button key={v} onClick={() => setTab(v)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${tab === v ? "bg-primary text-white" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* ── Estructura ── */}
            {tab === "structure" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Grados */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                        <h3 className="font-bold mb-4">Grados</h3>
                        <div className="space-y-1 mb-4">
                            {grades.map((g) => (
                                <button key={g.id} onClick={() => setSelectedGrade(g.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedGrade === g.id ? "bg-primary/10 text-primary" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                                    {g.name}
                                </button>
                            ))}
                            {grades.length === 0 && <p className="text-xs text-slate-400">Sin grados aún.</p>}
                        </div>
                        <div className="flex gap-2">
                            <input value={newGrade} onChange={(e) => setNewGrade(e.target.value)} placeholder="1° Secundaria"
                                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                            <button onClick={addGrade} className="px-3 rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                        </div>
                    </div>

                    {/* Secciones */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                        <h3 className="font-bold mb-4">Secciones {selectedGrade && `· ${grades.find((g) => g.id === selectedGrade)?.name ?? ""}`}</h3>
                        {!selectedGrade ? (
                            <p className="text-sm text-slate-400">Selecciona un grado.</p>
                        ) : (
                            <>
                                <div className="space-y-2 mb-4">
                                    {sections.map((s) => (
                                        <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                            <span className="font-bold size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{s.name}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-slate-500">Tutor</p>
                                                <select defaultValue="" onChange={(e) => assignTutor(s.id, e.target.value)}
                                                    className="text-sm bg-transparent outline-none font-medium">
                                                    <option value="">{s.tutor ? `${s.tutor.firstName} ${s.tutor.lastName}` : "— Asignar tutor —"}</option>
                                                    {tutors.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                    {sections.length === 0 && <p className="text-xs text-slate-400">Sin secciones.</p>}
                                </div>
                                <div className="flex gap-2">
                                    <input value={newSection} onChange={(e) => setNewSection(e.target.value)} placeholder="A"
                                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                                    <button onClick={addSection} className="px-3 rounded-lg bg-primary text-white">
                                        <span className="material-symbols-outlined text-lg">add</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── Personal ── */}
            {tab === "staff" && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                    <h3 className="font-bold mb-4">Personal del colegio</h3>
                    <p className="text-xs text-slate-400 mb-4">Usa el botón "Registrar docente" del dashboard para añadir personal.</p>
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
                            <th className="pb-2">Nombre</th><th className="pb-2">Email</th><th className="pb-2">Rol</th>
                        </tr></thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {staff.map((s) => (
                                <tr key={s.id}>
                                    <td className="py-2 font-medium">{s.firstName} {s.lastName}</td>
                                    <td className="py-2 text-slate-500">{s.email}</td>
                                    <td className="py-2"><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">{s.role}</span></td>
                                </tr>
                            ))}
                            {staff.length === 0 && <tr><td colSpan={3} className="py-6 text-center text-slate-400">Sin personal registrado.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Colegio ── */}
            {tab === "school" && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md">
                    {school ? (
                        <div className="space-y-3">
                            <div><p className="text-xs text-slate-400">Nombre</p><p className="font-bold">{school.name}</p></div>
                            <div><p className="text-xs text-slate-400">Año académico</p><p className="font-bold">{school.academicYear}</p></div>
                            <div><p className="text-xs text-slate-400">Distrito</p><p className="font-bold">{school.district ?? "—"}</p></div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">No hay colegio configurado.</p>
                    )}
                </div>
            )}
        </div>
    );
}
