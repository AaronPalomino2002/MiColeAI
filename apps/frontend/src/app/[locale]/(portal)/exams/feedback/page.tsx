import Image from "next/image";
import Link from "next/link";
import styles from "./Feedback.module.css";
import profileImg from "./assets/image_0.png";

export default function ExamFeedbackPage() {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <div className="layout-container flex h-full grow flex-col">
                {/* Header Section */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-10 py-3 sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 text-primary">
                            <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
                                <span className="material-symbols-outlined text-primary">
                                    school
                                </span>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                                StudyAI
                            </h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-9">
                            <Link
                                className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
                                href="/dashboard"
                            >
                                Dashboard
                            </Link>
                            <Link
                                className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
                                href="/dashboard"
                            >
                                Courses
                            </Link>
                            <Link
                                className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
                                href="/exams"
                            >
                                Exams
                            </Link>
                            <Link
                                className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
                                href="/dashboard"
                            >
                                Resources
                            </Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end gap-6 items-center">
                        <label className="flex flex-col min-w-40 h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                                <div className="text-slate-400 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                                    <span className="material-symbols-outlined text-xl">
                                        search
                                    </span>
                                </div>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-0 border-none bg-slate-100 dark:bg-slate-800 h-full placeholder:text-slate-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal"
                                    placeholder="Search topics..."
                                    type="text"
                                />
                            </div>
                        </label>
                        <div className="h-10 w-10 relative rounded-full border-2 border-primary/20 overflow-hidden">
                            <Image
                                src={profileImg}
                                alt="Profile photo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </header>

                <main className="flex flex-1 justify-center py-12 px-4 md:px-10">
                    <div className="layout-content-container flex flex-col max-w-[1000px] flex-1">
                        {/* Encouragement Hero Section */}
                        <div className="flex flex-col items-center text-center space-y-4 mb-10">
                            <div className="w-20 h-20 bg-accent-orange/10 rounded-full flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-accent-orange text-5xl">
                                    trending_up
                                </span>
                            </div>
                            <h1 className="text-slate-900 dark:text-white tracking-light text-[40px] font-bold leading-tight">
                                Almost There! Keep Going!
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg font-normal max-w-2xl">
                                You've made great progress on your Advanced Biology exam.
                                Mastering complex subjects takes time, and you're already halfway
                                to the finish line!
                            </p>
                        </div>

                        {/* Score Card */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 md:col-span-1">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                                    Your Score
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-slate-900 dark:text-white text-5xl font-bold">
                                        65%
                                    </p>
                                    <p className="text-slate-400 dark:text-slate-500 text-lg">
                                        / 100%
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                                    <span className="material-symbols-outlined text-sm">
                                        arrow_upward
                                    </span>
                                    <span>+8% from last attempt</span>
                                </div>
                            </div>
                            {/* Action Prompts */}
                            <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
                                <div className="flex-1 rounded-xl p-8 bg-primary text-white shadow-lg flex flex-col justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined">smart_toy</span>
                                            Tutoring Session
                                        </h3>
                                        <p className="text-white/80 text-sm mb-6">
                                            Let's review the topics you found challenging together.
                                        </p>
                                    </div>
                                    <Link
                                        href="/chat"
                                        className="w-full bg-white text-primary font-bold py-3 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Talk to your AI Tutor
                                    </Link>
                                </div>
                                <div className="flex-1 rounded-xl p-8 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined">replay</span>
                                            Ready to Retry?
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                            Take a break, review the materials, and try again when
                                            you're ready.
                                        </p>
                                    </div>
                                    <Link
                                        href="/exams/room"
                                        className="w-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center justify-center"
                                    >
                                        Retry Exam
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Section */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-accent-orange">
                                    lightbulb
                                </span>
                                <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">
                                    Areas for Improvement
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Improvement Item 1 */}
                                <div className="flex gap-4 p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/30 transition-all">
                                    <div className="size-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                                            microbiology
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white">
                                            Cellular Respiration
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                            "Focus on the Krebs cycle and Electron Transport Chain
                                            stages."
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-[10px] font-bold uppercase rounded text-slate-500 dark:text-slate-400">
                                                Moderate Priority
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Improvement Item 2 */}
                                <div className="flex gap-4 p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/30 transition-all">
                                    <div className="size-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">
                                            genetics
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white">
                                            Genetics & Heredity
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                            "Review Punnett squares and non-Mendelian inheritance
                                            patterns."
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-[10px] font-bold uppercase rounded text-slate-500 dark:text-slate-400">
                                                High Priority
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Improvement Item 3 */}
                                <div className="flex gap-4 p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/30 transition-all">
                                    <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                                            psychology
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white">
                                            Nervous System
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                            "Refresh your knowledge on action potential propagation."
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-[10px] font-bold uppercase rounded text-slate-500 dark:text-slate-400">
                                                Quick Review
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Improvement Item 4 */}
                                <div className="flex gap-4 p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/30 transition-all">
                                    <div className="size-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">
                                            eco
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white">
                                            Photosynthesis
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                            "Review the light-dependent reactions in the thylakoid."
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-[10px] font-bold uppercase rounded text-slate-500 dark:text-slate-400">
                                                Nearly Mastered
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommended Resources */}
                        <div className="mb-12">
                            <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-6">
                                Personalized Study Plan
                            </h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined text-primary">
                                            video_library
                                        </span>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white leading-none mb-1">
                                                Video: Mastering Cellular Metabolism
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                12 mins • Recommended based on your errors
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
                                        <span className="material-symbols-outlined">
                                            play_circle
                                        </span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined text-primary">
                                            menu_book
                                        </span>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white leading-none mb-1">
                                                Article: Genetic Inheritance Patterns
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                8 mins read • Essential for Next Attempt
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
                                        <span className="material-symbols-outlined">
                                            open_in_new
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Bottom Action Bar (Mobile/Secondary) */}
                <footer className="md:hidden sticky bottom-0 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 p-4 flex gap-3">
                    <button className="flex-1 bg-primary text-white font-bold py-3 rounded-lg">
                        AI Tutor
                    </button>
                    <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        Retry
                    </button>
                </footer>
            </div>
        </div>
    );
}
