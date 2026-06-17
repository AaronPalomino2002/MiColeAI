"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { api } from "@/lib/api";

interface Section { id: string; name: string; tutor?: { firstName: string; lastName: string } | null; }
interface Student { id: string; firstName: string; lastName: string; email: string; district: string | null; }

export default function GradeDetailPage() {
    const params = useParams();
    const gradeId = params.gradeId as string;

    const [gradeName, setGradeName] = useState<string>("");
    const [sections, setSections] = useState<Section[]>([]);
    const [studentsBySection, setStudentsBySection] = useState<Record<string, Student[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const grades: { id: string; name: string }[] = await api.get("/grades");
                setGradeName(grades.find((g) => g.id === gradeId)?.name ?? "Grado");

                const secs: Section[] = await api.get(`/sections?gradeId=${gradeId}`);
                setSections(secs);

                const entries = await Promise.all(
                    secs.map(async (s) => {
                        const studs: Student[] = await api.get(`/students?sectionId=${s.id}`).catch(() => []);
                        return [s.id, studs] as const;
                    }),
                );
                setStudentsBySection(Object.fromEntries(entries));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [gradeId]);

    if (loading) return (
        <div className="p-8 max-w-4xl mx-auto space-y-4 animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
    );

    const totalStudents = Object.values(studentsBySection).reduce((n, arr) => n + arr.length, 0);

    return (
        <div className="max-w-4xl mx-auto w-full p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Link href="/dashboard/director" className="hover:text-primary">Panel</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{gradeName}</span>
            </div>

            <div>
                <h1 className="text-2xl font-extrabold">{gradeName}</h1>
                <p className="text-slate-500 text-sm mt-1">{sections.length} secciones · {totalStudents} estudiantes</p>
            </div>

            {sections.length === 0 && (
                <p className="text-slate-400 text-sm">Este grado no tiene secciones aún.</p>
            )}

            {sections.map((s) => {
                const studs = studentsBySection[s.id] ?? [];
                return (
                    <div key={s.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">{s.name}</span>
                                <div>
                                    <p className="font-bold">Sección {s.name}</p>
                                    <p className="text-xs text-slate-500">
                                        Tutor: {s.tutor ? `${s.tutor.firstName} ${s.tutor.lastName}` : "Sin asignar"}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-400">{studs.length} estudiantes</span>
                        </div>

                        {studs.length === 0 ? (
                            <p className="text-xs text-slate-400 py-2">Sin estudiantes en esta sección.</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
                                        <th className="pb-2 font-semibold">Estudiante</th>
                                        <th className="pb-2 font-semibold">Email</th>
                                        <th className="pb-2 font-semibold hidden md:table-cell">Distrito</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {studs.map((st) => (
                                        <tr key={st.id}>
                                            <td className="py-2 font-medium">{st.firstName} {st.lastName}</td>
                                            <td className="py-2 text-slate-500">{st.email}</td>
                                            <td className="py-2 text-slate-500 hidden md:table-cell">{st.district ?? "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
