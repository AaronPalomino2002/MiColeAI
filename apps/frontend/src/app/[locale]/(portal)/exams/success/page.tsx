import Image from "next/image";
import Link from "next/link";
import styles from "./Success.module.css";
import student0 from "./assets/image_0.png";
import student1 from "./assets/image_1.png";
import student2 from "./assets/image_2.png";
import student3 from "./assets/image_3.png";

export default function ExamSuccessPage() {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 bg-background-light dark:bg-background-dark px-6 md:px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="text-primary size-8">
                        <span className="material-symbols-outlined text-4xl">school</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
                        StudyAI
                    </h2>
                </div>
                <div className="flex flex-1 justify-end gap-8 items-center">
                    <nav className="hidden md:flex items-center gap-9">
                        <Link
                            className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
                            href="/dashboard"
                        >
                            Dashboard
                        </Link>
                        <Link
                            className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
                            href="/dashboard"
                        >
                            Courses
                        </Link>
                        <Link
                            className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
                            href="/exams"
                        >
                            Exams
                        </Link>
                        <Link
                            className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
                            href="/dashboard"
                        >
                            Reports
                        </Link>
                    </nav>
                    <div className="bg-primary/20 rounded-full p-1 border-2 border-primary">
                        <div className="relative size-8 rounded-full overflow-hidden">
                            <Image
                                src={student3}
                                alt="Student profile avatar"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="layout-container flex h-full grow flex-col items-center py-10 px-4">
                <div className="max-w-[800px] w-full flex flex-col items-center">
                    {/* Hero Celebration Section */}
                    <div className="relative w-full @container">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                            <span className="material-symbols-outlined text-[200px] text-accent-gold">
                                celebration
                            </span>
                        </div>
                        <div className="relative flex flex-col items-center text-center py-12 px-6 rounded-xl overflow-hidden mb-8">
                            <div className="mb-6 rounded-full bg-primary/20 p-6 inline-flex items-center justify-center border-4 border-primary">
                                <span
                                    className="material-symbols-outlined text-7xl text-primary"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    emoji_events
                                </span>
                            </div>
                            <h1 className="text-slate-900 dark:text-slate-100 tracking-tight text-5xl md:text-6xl font-black leading-tight mb-4">
                                Congratulations!
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-xl font-medium max-w-lg">
                                You've successfully mastered{" "}
                                <span className="text-primary font-bold italic">
                                    Advanced Neural Networks
                                </span>{" "}
                                with flying colors!
                            </p>
                        </div>
                    </div>

                    {/* Score Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
                        <div className="flex flex-col gap-3 rounded-xl p-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-center transform hover:scale-105 transition-transform">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
                                Final Score
                            </p>
                            <div className="flex flex-col items-center">
                                <p className="text-slate-900 dark:text-slate-100 text-5xl font-black leading-tight">
                                    95<span className="text-2xl text-slate-400">/100</span>
                                </p>
                                <div className="mt-2 px-3 py-1 bg-primary/10 rounded-full">
                                    <p className="text-primary text-sm font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">
                                            trending_up
                                        </span>{" "}
                                        +5% vs average
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-xl p-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-center transform hover:scale-105 transition-transform">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
                                Accuracy
                            </p>
                            <div className="flex flex-col items-center">
                                <p className="text-slate-900 dark:text-slate-100 text-5xl font-black leading-tight text-accent-gold">
                                    98<span className="text-2xl text-slate-400">%</span>
                                </p>
                                <div className="mt-2 px-3 py-1 bg-accent-gold/10 rounded-full">
                                    <p className="text-accent-gold text-sm font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">
                                            verified
                                        </span>{" "}
                                        Elite Performer
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-xl p-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-center transform hover:scale-105 transition-transform">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
                                Time Spent
                            </p>
                            <div className="flex flex-col items-center">
                                <p className="text-slate-900 dark:text-slate-100 text-5xl font-black leading-tight">
                                    18<span className="text-2xl text-slate-400">m</span>
                                </p>
                                <div className="mt-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                                    <p className="text-slate-600 dark:text-slate-300 text-sm font-bold">
                                        8m faster than avg
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="w-full bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">
                                analytics
                            </span>{" "}
                            Subject Mastery Breakdown
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">Architecture Design</span>
                                    <span className="text-sm font-bold text-primary">100%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">
                                        Backpropagation Algorithm
                                    </span>
                                    <span className="text-sm font-bold text-primary">92%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: "92%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">
                                        Hyperparameter Tuning
                                    </span>
                                    <span className="text-sm font-bold text-accent-gold">88%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                                    <div className="bg-accent-gold h-full rounded-full" style={{ width: "88%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center justify-center gap-2 px-10 py-4 bg-primary text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all text-lg group"
                        >
                            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
                                dashboard
                            </span>
                            Back to Dashboard
                        </Link>
                        <button className="flex items-center justify-center gap-2 px-10 py-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-600 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-all text-lg">
                            <span className="material-symbols-outlined text-primary">
                                share
                            </span>
                            Share Achievement
                        </button>
                    </div>

                    {/* Encouragement Footer */}
                    <div className="mt-16 flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex -space-x-2">
                            <div className="relative size-8 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden">
                                <Image src={student2} alt="Student" fill className="object-cover" />
                            </div>
                            <div className="relative size-8 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden">
                                <Image src={student1} alt="Student" fill className="object-cover" />
                            </div>
                            <div className="relative size-8 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden">
                                <Image src={student0} alt="Student" fill className="object-cover" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Join <span className="font-bold text-primary">1,240</span> other
                            students who passed this level today!
                        </p>
                    </div>
                </div>
            </main>

            {/* Decorative Elements */}
            <div className="fixed top-20 left-10 opacity-10 pointer-events-none hidden xl:block">
                <span className="material-symbols-outlined text-8xl text-primary animate-pulse">
                    star
                </span>
            </div>
            <div className="fixed bottom-20 right-10 opacity-10 pointer-events-none hidden xl:block">
                <span className="material-symbols-outlined text-8xl text-accent-gold animate-pulse">
                    auto_awesome
                </span>
            </div>
        </div>
    );
}
