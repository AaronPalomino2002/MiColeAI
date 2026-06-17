"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useTranslations } from "next-intl";

interface Exam {
    id: string;
    title: string;
    description: string;
    timeLimitMinutes: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

export default function ExamsPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const t = useTranslations("Exams");

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const data = await api.get('/exams');
                setExams(data);
            } catch (error) {
                console.error('Error fetching exams:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const difficultyMap = {
        easy: { label: t("difficulty.easy"), color: "bg-emerald-500/10 text-emerald-500" },
        medium: { label: t("difficulty.medium"), color: "bg-amber-500/10 text-amber-500" },
        hard: { label: t("difficulty.hard"), color: "bg-rose-500/10 text-rose-500" },
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            {/* Header section with stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">
                        {t("title")}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {t("subtitle")}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t("stats.available")}</p>
                        <p className="text-2xl font-black">{exams.length}</p>
                    </div>
                    <div className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-primary">
                        <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">{t("stats.completed")}</p>
                        <p className="text-2xl font-black">12</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map((exam) => (
                        <div
                            key={exam.id}
                            className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-8xl rotate-12">assignment</span>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${difficultyMap[exam.difficulty].color}`}>
                                        {difficultyMap[exam.difficulty].label}
                                    </span>
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        <span className="text-xs font-bold">{exam.timeLimitMinutes} {t("minutes")}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {exam.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 min-h-[40px]">
                                    {exam.description}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-sm">checklist</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                            {difficultyMap[exam.difficulty].label}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/exams/${exam.id}`}
                                        className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black hover:scale-105 active:scale-95 transition-all"
                                    >
                                        {t("startExam")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
