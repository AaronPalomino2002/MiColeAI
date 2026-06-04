import Image from "next/image";
import Link from "next/link";
import mathImg from "./assets/image_0.png";
import econImg from "./assets/image_1.png";
import physicsImg from "./assets/image_2.png";
import chemImg from "./assets/image_3.png";

export default function ExamCenterPage() {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8">
            {/* Hero Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                        Exam Center
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                        Join your scheduled sessions or start a practice exam with AI-powered
                        proctoring and real-time guidance.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-xl">history</span>
                        Previous Attempts
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-xl">bolt</span>
                        Quick Practice
                    </button>
                </div>
            </div>

            {/* Filters/Tabs */}
            <div className="mb-8 border-b border-slate-200 dark:border-slate-800">
                <div className="flex gap-8">
                    <button className="border-b-2 border-transparent pb-4 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        All Exams
                    </button>
                    <button className="border-b-2 border-primary pb-4 text-sm font-bold text-primary">
                        Active Now <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">4</span>
                    </button>
                    <button className="border-b-2 border-transparent pb-4 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        Upcoming
                    </button>
                    <button className="border-b-2 border-transparent pb-4 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        Completed
                    </button>
                </div>
            </div>

            {/* Section Title */}
            <div className="mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">sensors</span>
                <h2 className="text-xl font-bold tracking-tight">Active Exam Sessions</h2>
            </div>

            {/* Exam Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Exam Card 1 */}
                <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <Image
                            src={mathImg}
                            alt="Mathematical equations"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1 uppercase tracking-wider">
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span> Live
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-1 text-lg font-bold">Advanced Mathematics</h3>
                        <div className="mb-4 flex flex-col gap-1 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">
                                    format_list_numbered
                                </span>
                                45 Questions
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">schedule</span>
                                60 Mins
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">robot_2</span>
                                Proctor: Dr. Math Bot
                            </div>
                        </div>
                        <button className="mt-auto w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/90">
                            Join Room
                        </button>
                    </div>
                </div>

                {/* Exam Card 2 */}
                <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <Image
                            src={physicsImg}
                            alt="Quantum particles"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1 uppercase tracking-wider">
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span> Live
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-1 text-lg font-bold">Quantum Physics</h3>
                        <div className="mb-4 flex flex-col gap-1 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">
                                    format_list_numbered
                                </span>
                                30 Questions
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">schedule</span>
                                45 Mins
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">robot_2</span>
                                Proctor: Physics Sage
                            </div>
                        </div>
                        <button className="mt-auto w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/90">
                            Join Room
                        </button>
                    </div>
                </div>

                {/* Exam Card 3 */}
                <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <Image
                            src={chemImg}
                            alt="Molecular structure"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute right-3 top-3 rounded-full bg-slate-500 px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1 uppercase tracking-wider">
                            Practice
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-1 text-lg font-bold">Organic Chemistry</h3>
                        <div className="mb-4 flex flex-col gap-1 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">
                                    format_list_numbered
                                </span>
                                50 Questions
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">schedule</span>
                                90 Mins
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">robot_2</span>
                                Proctor: Chem Master
                            </div>
                        </div>
                        <button className="mt-auto w-full rounded-lg bg-slate-200 dark:bg-slate-800 py-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-300 dark:hover:bg-slate-700">
                            Start Now
                        </button>
                    </div>
                </div>

                {/* Exam Card 4 */}
                <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <Image
                            src={econImg}
                            alt="Stock market charts"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute right-3 top-3 rounded-full bg-slate-500 px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1 uppercase tracking-wider">
                            Practice
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-1 text-lg font-bold">Macroeconomics</h3>
                        <div className="mb-4 flex flex-col gap-1 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">
                                    format_list_numbered
                                </span>
                                40 Questions
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">schedule</span>
                                60 Mins
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">robot_2</span>
                                Proctor: Econ Guide
                            </div>
                        </div>
                        <button className="mt-auto w-full rounded-lg bg-slate-200 dark:bg-slate-800 py-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-300 dark:hover:bg-slate-700">
                            Start Now
                        </button>
                    </div>
                </div>
            </div>

            {/* System Status Component */}
            <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6 dark:bg-primary/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <span className="material-symbols-outlined">verified_user</span>
                        </div>
                        <div>
                            <h4 className="font-bold">AI Proctoring Status</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                All systems are operational. Webcam and audio detection active.
                                Ensure you are in a quiet environment before starting.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Audio</p>
                            <p className="text-sm font-bold text-green-500 flex items-center justify-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Online
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Video</p>
                            <p className="text-sm font-bold text-green-500 flex items-center justify-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Online
                            </p>
                        </div>
                        <div className="text-center border-l border-slate-200 dark:border-slate-800 pl-4">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Network</p>
                            <p className="text-sm font-bold text-primary">24ms Latency</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
