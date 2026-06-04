import Image from "next/image";
import Link from "next/link";
import styles from "./TeacherAnalytics.module.css";
import teacherAvatar from "./assets/image_1.png";
import studentLiam from "./assets/image_2.png";
import studentAva from "./assets/image_3.png";
import studentNoah from "./assets/image_4.png";
import studentSophia from "./assets/image_0.png";

export default function TeacherAnalyticsPage() {
    return (
        <div className="flex h-full min-h-screen w-full flex-col bg-background-subtle font-display text-text-dark">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="size-9 bg-accent-blue rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary font-bold">
                                analytics
                            </span>
                        </div>
                        <h2 className="text-text-dark text-lg font-bold leading-tight tracking-tight">
                            Teacher Analytics
                        </h2>
                    </div>
                    <label className="flex flex-col min-w-40 h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden bg-slate-100">
                            <div className="text-slate-400 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent text-text-dark focus:ring-0 h-full placeholder:text-slate-500 px-4 text-sm font-normal"
                                placeholder="Search students, subjects..."
                                type="text"
                            />
                        </div>
                    </label>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            className="text-primary text-sm font-semibold border-b-2 border-primary pb-1"
                            href="/admin/dashboard"
                        >
                            Overview
                        </Link>
                        <Link
                            className="text-text-muted text-sm font-medium hover:text-primary transition-colors"
                            href="/admin/dashboard"
                        >
                            Classes
                        </Link>
                        <Link
                            className="text-text-muted text-sm font-medium hover:text-primary transition-colors"
                            href="/admin/students"
                        >
                            Students
                        </Link>
                    </nav>
                    <div className="relative border-2 border-white ring-1 ring-slate-200 rounded-full size-10 flex items-center justify-center overflow-hidden">
                        <Image
                            src={teacherAvatar}
                            alt="Teacher Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 border-r border-slate-200 bg-white p-4 hidden lg:flex flex-col justify-between">
                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">
                                Navigation
                            </p>
                            <nav className="flex flex-col gap-1">
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white shadow-sm cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        dashboard
                                    </span>
                                    <span className="text-sm font-medium">Home</span>
                                </Link>
                                <Link
                                    href="/admin/analytics"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:bg-accent-blue hover:text-primary cursor-pointer transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        trending_up
                                    </span>
                                    <span className="text-sm font-medium">Growth</span>
                                </Link>
                            </nav>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col overflow-y-auto max-h-[calc(100vh-64px)] custom-scrollbar">
                    <div className="p-8">
                        <h1 className="text-3xl font-extrabold text-text-dark tracking-tight">
                            Academic Performance
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-xs font-bold text-slate-400 uppercase">
                                    Avg Score
                                </p>
                                <h3 className="text-2xl font-extrabold mt-1 text-slate-900">
                                    74.2%
                                </h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-bold mb-6">Subject Performance</h2>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span>Physics</span>
                                            <span className="text-primary">82%</span>
                                        </div>
                                        <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                                            <div
                                                className="bg-primary h-full rounded-full"
                                                style={{ width: "82%" }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-bold mb-6">At-Risk Students</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-red-50/30">
                                        <div className="relative size-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                                            <Image
                                                src={studentLiam}
                                                alt="Liam"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold truncate">Liam Wilson</h4>
                                            <p className="text-[10px] text-slate-500">45% Score</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
