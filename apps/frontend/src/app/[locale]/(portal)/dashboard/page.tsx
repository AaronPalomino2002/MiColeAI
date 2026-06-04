"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function DashboardPage() {
    const t = useTranslations("Dashboard");

    return (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">
                        {t("welcome", { name: "Alex" })}
                    </h2>
                    <p className="text-slate-500 mt-1">
                        {t("studyGoal", { percent: 85 })}
                    </p>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {t("streak", { days: 12 })}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {t("tokens", { count: "2,450" })}
                    </span>
                </div>
            </div>

            {/* Highlight Card */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-slate-900 text-white p-8 group">
                    <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary via-transparent to-purple-600"></div>
                    <div className="absolute right-0 bottom-0 p-4 translate-y-4 translate-x-4 opacity-10 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[12rem]">functions</span>
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase">
                                    {t("mostFrequent")}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold">{t("subjects.math")}</h3>
                            <p className="text-slate-300 max-w-md">
                                {t("frequentDesc", { hours: 12.4 })}
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-4">
                            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2">
                                <span>{t("continueLearning")}</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg font-medium transition-all">
                                {t("viewAnalytics")}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                            event_upcoming
                        </span>
                        {t("upcomingExams")}
                    </h4>
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-2 rounded-lg">
                                <span className="material-symbols-outlined">science</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold leading-tight">{t("subjects.physics")} Midterm</p>
                                <p className="text-xs text-slate-500">Tomorrow, 09:00 AM</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                                <span className="material-symbols-outlined">language</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold leading-tight">{t("subjects.history")}</p>
                                <p className="text-xs text-slate-500">Thursday, Oct 24</p>
                            </div>
                        </div>
                    </div>
                    <Link
                        className="mt-4 text-center text-sm font-semibold text-primary hover:underline"
                        href="/exams"
                    >
                        {t("viewAllSchedule")}
                    </Link>
                </div>
            </section>

            {/* Subject Grid */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">{t("subjectProgressTitle")}</h3>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">grid_view</span>
                        </button>
                        <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">list</span>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Math Card */}
                    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-6">
                            <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined text-3xl">calculate</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-slate-400 font-medium">{t("progress")}</span>
                                <p className="text-lg font-bold">78%</p>
                            </div>
                        </div>
                        <h4 className="text-lg font-bold mb-1">{t("subjects.math")}</h4>
                        <p className="text-sm text-slate-500 mb-6">
                            Mastering {t("subjects.calculus")} & {t("subjects.linearAlgebra")} with Newton AI.
                        </p>
                        <div className="space-y-2">
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full w-[78%]"></div>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                                <span>{t("nextGoal", { goal: "Integration" })}</span>
                                <span>{t("lessons", { current: 12, total: 15 })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Science/Physics Card */}
                    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-6">
                            <div className="size-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined text-3xl">
                                    rocket_launch
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-slate-400 font-medium">{t("progress")}</span>
                                <p className="text-lg font-bold">45%</p>
                            </div>
                        </div>
                        <h4 className="text-lg font-bold mb-1">{t("subjects.physics")}</h4>
                        <p className="text-sm text-slate-500 mb-6">
                            Exploring {t("subjects.quantum")} with Curie AI.
                        </p>
                        <div className="space-y-2">
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className="bg-purple-500 h-full rounded-full w-[45%]"></div>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                                <span>{t("nextGoal", { goal: "Particle Physics" })}</span>
                                <span>{t("lessons", { current: 8, total: 18 })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Biology Card */}
                    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-6">
                            <div className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <span className="material-symbols-outlined text-3xl">biotech</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-slate-400 font-medium">{t("progress")}</span>
                                <p className="text-lg font-bold">92%</p>
                            </div>
                        </div>
                        <h4 className="text-lg font-bold mb-1">{t("subjects.biology")}</h4>
                        <p className="text-sm text-slate-500 mb-6">
                            {t("subjects.cell")} & {t("subjects.genetics")} with Darwin AI Agent.
                        </p>
                        <div className="space-y-2">
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full w-[92%]"></div>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                                <span>{t("nextGoal", { goal: "Final Review" })}</span>
                                <span>{t("lessons", { current: 24, total: 26 })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Link Section */}
            <section className="bg-primary/5 rounded-xl border border-primary/20 p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex size-14 rounded-full bg-primary/20 items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">{t("readyStudy")}</h4>
                        <p className="text-slate-500">
                            {t.rich("pickUp", {
                                topic: "Integration Techniques",
                                span: (chunks) => <span className="text-primary font-bold">{chunks}</span>
                            })}
                        </p>
                    </div>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap">
                    <span className="material-symbols-outlined">play_arrow</span>
                    {t("quickResume")}
                </button>
            </section>
        </div>
    );
}
