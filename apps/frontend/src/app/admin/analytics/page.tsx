import Image from "next/image";
import Link from "next/link";
import styles from "./AdminAnalytics.module.css";
import adminImg from "./assets/image_0.png";

export default function AdminAnalyticsPage() {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <div className="layout-container flex h-full grow flex-col">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 lg:px-10 py-3 sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 text-primary">
                            <div className="size-6">
                                <span className="material-symbols-outlined text-3xl">school</span>
                            </div>
                            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em]">
                                StudyAI Admin
                            </h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-9">
                            <Link
                                className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium leading-normal"
                                href="/admin/dashboard"
                            >
                                Dashboard
                            </Link>
                            <Link
                                className="text-primary text-sm font-bold border-b-2 border-primary leading-normal"
                                href="/admin/dashboard"
                            >
                                Evaluations
                            </Link>
                            <Link
                                className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium leading-normal"
                                href="/admin/dashboard"
                            >
                                Students
                            </Link>
                            <Link
                                className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium leading-normal"
                                href="/admin/dashboard"
                            >
                                Subjects
                            </Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end gap-4 lg:gap-8">
                        <label className="hidden sm:flex flex-col min-w-40 h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                                <div className="text-slate-400 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                                    <span className="material-symbols-outlined text-[20px]">
                                        search
                                    </span>
                                </div>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-0 border-none bg-slate-100 dark:bg-slate-800 focus:border-none h-full placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal"
                                    placeholder="Search evaluations..."
                                    type="text"
                                />
                            </div>
                        </label>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                                <span className="material-symbols-outlined text-[20px]">
                                    notifications
                                </span>
                            </button>
                            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                                <span className="material-symbols-outlined text-[20px]">
                                    settings
                                </span>
                            </button>
                        </div>
                        <div className="relative bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20 overflow-hidden">
                            <Image
                                src={adminImg}
                                alt="Administrator profile avatar"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-4 lg:px-40 py-8">
                    <div className="layout-content-container flex flex-col max-w-[1200px] mx-auto flex-1">
                        {/* Breadcrumbs */}
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <Link
                                className="text-slate-500 dark:text-slate-400 text-sm font-medium"
                                href="/admin/dashboard"
                            >
                                Dashboard
                            </Link>
                            <span className="material-symbols-outlined text-slate-400 text-sm">
                                chevron_right
                            </span>
                            <Link
                                className="text-slate-500 dark:text-slate-400 text-sm font-medium"
                                href="/admin/dashboard"
                            >
                                Evaluations
                            </Link>
                            <span className="material-symbols-outlined text-slate-400 text-sm">
                                chevron_right
                            </span>
                            <span className="text-primary text-sm font-bold">
                                Physics Final Exam Detailed Insights
                            </span>
                        </div>

                        {/* Page Title and Actions */}
                        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">
                                    Evaluation: Quantum Mechanics Intro
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 text-base">
                                    Performance analysis for Section A-12, Semester Spring 2024
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                    <span className="material-symbols-outlined text-[18px]">
                                        share
                                    </span>
                                    <span>Share Insights</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
                                    <span className="material-symbols-outlined text-[18px]">
                                        file_download
                                    </span>
                                    <span>Export Report</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                        Average Score
                                    </p>
                                    <span className="material-symbols-outlined text-primary">
                                        assessment
                                    </span>
                                </div>
                                <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
                                    74.2/100
                                </p>
                                <div className="flex items-center gap-1 text-red-500 text-xs font-bold">
                                    <span className="material-symbols-outlined text-[14px]">
                                        trending_down
                                    </span>
                                    <span>-2.4% vs last week</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                        Completion Rate
                                    </p>
                                    <span className="material-symbols-outlined text-primary">
                                        check_circle
                                    </span>
                                </div>
                                <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
                                    96.8%
                                </p>
                                <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                                    <span className="material-symbols-outlined text-[14px]">
                                        trending_up
                                    </span>
                                    <span>+1.2% vs last week</span>
                                </div>
                            </div>
                        </div>

                        {/* Difficulty Analysis */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8">
                            <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-6">
                                Difficulty Analysis: Most Missed Questions
                            </h3>
                            <div className="flex flex-col gap-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            Q7: Wave-Particle Duality Equation
                                        </span>
                                        <span className="text-red-500 font-bold">68% Failed</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                                        <div
                                            className="bg-red-500 h-3 rounded-full"
                                            style={{ width: "68%" }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            Q12: Schrödinger’s Cat Paradox
                                        </span>
                                        <span className="text-red-500 font-bold">54% Failed</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                                        <div
                                            className="bg-red-500 h-3 rounded-full"
                                            style={{ width: "54%" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="mt-auto px-6 lg:px-40 py-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © 2024 StudyAI Learning Systems. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link
                                className="text-slate-500 hover:text-primary text-sm transition-colors"
                                href="/admin/dashboard"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                className="text-slate-500 hover:text-primary text-sm transition-colors"
                                href="/admin/dashboard"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
