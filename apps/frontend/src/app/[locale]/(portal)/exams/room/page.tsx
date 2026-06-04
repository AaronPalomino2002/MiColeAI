import Image from "next/image";
import Link from "next/link";
import styles from "./ExamRoom.module.css";
import organelleImg from "./assets/image_0.png";
import studentImg from "./assets/image_1.png";

export default function ExamRoomPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
            {/* Header Section */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-3 lg:px-12">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-tight">AI Study Exam Room</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Advanced Biology: Cellular Respiration
                        </p>
                    </div>
                </div>
                {/* Timer and Progress Central Focus */}
                <div className="hidden md:flex flex-col items-center gap-1 min-w-[300px]">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold tracking-tight text-primary">
                                00:42:15
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                Remaining Time
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden mt-1">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: "45%" }}
                        ></div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined mr-2 text-sm">
                            pause_circle
                        </span>
                        Pause
                    </button>
                    <button className="flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
                        Finish Exam
                    </button>
                    <div className="h-10 w-10 relative rounded-full border-2 border-primary/20 overflow-hidden">
                        <Image
                            src={studentImg}
                            alt="User Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Question Map */}
                <aside className="hidden lg:flex w-72 flex-col border-r border-primary/10 bg-white dark:bg-background-dark p-6 overflow-y-auto">
                    <div className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                            Question Map
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">9 of 20 Completed</p>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {/* Question Bubbles */}
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <button
                                key={n}
                                className="flex aspect-square items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-sm border border-primary/30"
                            >
                                {n}
                            </button>
                        ))}
                        {/* Current */}
                        <button className="flex aspect-square items-center justify-center rounded-lg bg-primary text-white font-bold text-sm ring-4 ring-primary/20 scale-105">
                            9
                        </button>
                        {/* Unanswered */}
                        {[10, 11, 12].map((n) => (
                            <button
                                key={n}
                                className="flex aspect-square items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium text-sm hover:bg-slate-200 transition-colors"
                            >
                                {n}
                            </button>
                        ))}
                        {/* Flagged */}
                        <button className="relative flex aspect-square items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 font-medium text-sm border border-yellow-200">
                            13
                            <span className="absolute -top-1 -right-1 flex h-3 w-3 rounded-full bg-yellow-500"></span>
                        </button>
                        {[14, 15, 16, 17, 18, 19, 20].map((n) => (
                            <button
                                key={n}
                                className="flex aspect-square items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium text-sm"
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                    <div className="mt-auto pt-6 border-t border-primary/10">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="h-3 w-3 rounded bg-primary/20 border border-primary/30"></span>{" "}
                                Answered
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="h-3 w-3 rounded bg-primary"></span> Current
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="h-3 w-3 rounded bg-yellow-500"></span> Flagged
                                for Review
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="h-3 w-3 rounded bg-slate-100 dark:bg-slate-800"></span>{" "}
                                Not Answered
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Question Area */}
                <section className="flex flex-1 flex-col items-center bg-background-light dark:bg-background-dark p-6 lg:p-12 overflow-y-auto">
                    <div className="w-full max-w-3xl space-y-8">
                        {/* Question Header */}
                        <div className="flex items-center justify-between">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                Question 09 of 20
                            </span>
                            <button className="flex items-center text-slate-400 hover:text-yellow-500 transition-colors">
                                <span className="material-symbols-outlined text-xl mr-1">
                                    flag
                                </span>
                                <span className="text-sm font-medium">Mark for Review</span>
                            </button>
                        </div>
                        {/* Question Content */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold leading-relaxed text-slate-800 dark:text-slate-100">
                                What is the primary function of the mitochondria in a eukaryotic
                                cell, and how does its inner structure facilitate this process?
                            </h2>
                            <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-sm border border-primary/10 bg-white dark:bg-slate-900">
                                <Image
                                    src={organelleImg}
                                    alt="Cell Organelle Diagram"
                                    fill
                                    className="object-cover opacity-80"
                                />
                            </div>
                        </div>
                        {/* Answer Options */}
                        <div className="space-y-4">
                            <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all hover:border-primary/50 hover:bg-primary/5">
                                <input
                                    className="h-5 w-5 border-slate-300 text-primary focus:ring-primary"
                                    name="exam-option"
                                    type="radio"
                                />
                                <div className="flex-1">
                                    <p className="text-base font-medium text-slate-700 dark:text-slate-200">
                                        Production of ATP through oxidative phosphorylation using
                                        oxygen and glucose.
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-slate-300 group-hover:text-primary transition-colors">
                                    OPTION A
                                </span>
                            </label>
                            <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 border-primary bg-primary/5 p-5 transition-all shadow-md">
                                <input
                                    defaultChecked
                                    className="h-5 w-5 border-primary text-primary focus:ring-primary"
                                    name="exam-option"
                                    type="radio"
                                />
                                <div className="flex-1">
                                    <p className="text-base font-semibold text-primary">
                                        Synthesis of proteins and lipids for the cell membrane and
                                        export.
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-primary">SELECTED</span>
                            </label>
                            <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all hover:border-primary/50 hover:bg-primary/5">
                                <input
                                    className="h-5 w-5 border-slate-300 text-primary focus:ring-primary"
                                    name="exam-option"
                                    type="radio"
                                />
                                <div className="flex-1">
                                    <p className="text-base font-medium text-slate-700 dark:text-slate-200">
                                        Decomposition of cellular waste products via enzymatic
                                        hydrolysis.
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-slate-300 group-hover:text-primary transition-colors">
                                    OPTION C
                                </span>
                            </label>
                            <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all hover:border-primary/50 hover:bg-primary/5">
                                <input
                                    className="h-5 w-5 border-slate-300 text-primary focus:ring-primary"
                                    name="exam-option"
                                    type="radio"
                                />
                                <div className="flex-1">
                                    <p className="text-base font-medium text-slate-700 dark:text-slate-200">
                                        Storage of genetic information and coordination of cellular
                                        growth.
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-slate-300 group-hover:text-primary transition-colors">
                                    OPTION D
                                </span>
                            </label>
                        </div>
                        {/* Navigation Controls */}
                        <div className="flex items-center justify-between pt-8 border-t border-primary/10">
                            <button className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined mr-2">arrow_back</span>
                                Previous Question
                            </button>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-300 transition-colors">
                                    Skip
                                </button>
                                <button className="flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:brightness-110 transition-all">
                                    Save & Next
                                    <span className="material-symbols-outlined ml-2">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Footer Stats */}
                    <footer className="mt-auto w-full max-w-3xl pt-12 pb-4">
                        <div className="flex items-center justify-center gap-8 text-xs font-medium text-slate-400">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">
                                    visibility
                                </span>
                                Auto-saving active
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">wifi</span>
                                Connection Stable
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                Secure Exam Mode
                            </div>
                        </div>
                    </footer>
                </section>
            </main>
        </div>
    );
}
