import Image from "next/image";
import Link from "next/link";
import styles from "./AdminStudents.module.css";
import adminAvatar from "./assets/image_1.png";
import studentLiam from "./assets/image_2.png";
import studentAva from "./assets/image_3.png";
import studentNoah from "./assets/image_4.png";
import studentSophia from "./assets/image_0.png";

export default function AdminStudentsPage() {
    return (
        <div className="flex h-full min-h-screen w-full flex-col bg-background-main font-display text-slate-800">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white px-6 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary font-bold">
                                school
                            </span>
                        </div>
                        <h2 className="text-slate-900 text-xl font-extrabold tracking-tight">
                            EduPulse
                        </h2>
                    </div>
                    <label className="flex flex-col min-w-48 h-10 max-w-72">
                        <div className="flex w-full flex-1 items-stretch rounded-xl h-full overflow-hidden border border-slate-200 bg-slate-50">
                            <div className="text-slate-400 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent text-slate-900 focus:ring-0 h-full placeholder:text-slate-400 px-3 text-sm font-normal"
                                placeholder="Search students..."
                                type="text"
                            />
                        </div>
                    </label>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors"
                            href="/admin/dashboard"
                        >
                            Dashboard
                        </Link>
                        <Link
                            className="text-primary text-sm font-bold relative after:absolute after:bottom-[-13px] after:left-0 after:w-full after:h-0.5 after:bg-primary"
                            href="/admin/dashboard"
                        >
                            Students
                        </Link>
                        <Link
                            className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors"
                            href="/admin/dashboard"
                        >
                            Curriculum
                        </Link>
                        <Link
                            className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors"
                            href="/admin/dashboard"
                        >
                            AI Labs
                        </Link>
                    </nav>
                    <div className="flex gap-3">
                        <button className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-all">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="relative border-2 border-white ring-1 ring-slate-200 rounded-full size-10 flex items-center justify-center overflow-hidden">
                            <Image
                                src={adminAvatar}
                                alt="Admin Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
                <aside className="w-80 border-r border-slate-200 bg-white flex flex-col">
                    <div className="p-5 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">group</span>{" "}
                                Student Directory
                            </h3>
                            <button className="text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">tune</span>
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-lg uppercase tracking-wider">
                                Grade 11
                            </span>
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-lg uppercase tracking-wider">
                                Science
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Student List Items */}
                        <div className="p-4 border-b border-slate-100 bg-primary/[0.03] border-l-4 border-l-primary cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="relative size-12 rounded-2xl overflow-hidden bg-slate-200 border border-white shadow-sm">
                                    <Image
                                        src={studentLiam}
                                        alt="Liam Wilson"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">
                                        Liam Wilson
                                    </h4>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Progress: <span className="text-primary font-bold">78%</span>
                                    </p>
                                    <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-primary h-full rounded-full"
                                            style={{ width: "78%" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-all border-l-4 border-l-transparent">
                            <div className="flex items-center gap-3">
                                <div className="relative size-12 rounded-2xl overflow-hidden bg-slate-100">
                                    <Image
                                        src={studentAva}
                                        alt="Ava Robinson"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">
                                        Ava Robinson
                                    </h4>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Progress: <span className="text-rose-500 font-bold">42%</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col overflow-y-auto bg-background-main custom-scrollbar">
                    <div className="p-8 max-w-6xl mx-auto w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div className="flex items-center gap-6">
                                <div className="relative size-28 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                                    <Image
                                        src={studentLiam}
                                        alt="Liam Wilson Large"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                            Liam Wilson
                                        </h1>
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-2xl border border-slate-200 p-7 card-shadow">
                                    <h3 className="text-xl font-extrabold flex items-center gap-3 mb-8">
                                        <span className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined font-bold">
                                                analytics
                                            </span>
                                        </span>
                                        Subject Mastery
                                    </h3>
                                    <div className="space-y-8">
                                        <div>
                                            <div className="flex justify-between items-end mb-3">
                                                <span className="text-sm font-extrabold">Physics</span>
                                                <span className="text-primary font-black">85%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-primary h-full rounded-full"
                                                    style={{ width: "85%" }}
                                                ></div>
                                            </div>
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
