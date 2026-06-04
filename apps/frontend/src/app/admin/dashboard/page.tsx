import Image from "next/image";
import Link from "next/link";
import styles from "./AdminDashboard.module.css";
import teacherImg from "./assets/image_0.png";

export default function AdminDashboardPage() {
    return (
        <div className="flex h-full min-h-screen w-full flex-col bg-background-light text-slate-800 font-display">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white px-8 py-4 sticky top-0 z-50">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary font-bold">
                                school
                            </span>
                        </div>
                        <h2 className="text-slate-900 text-xl font-extrabold leading-tight tracking-tight">
                            EduInsight
                        </h2>
                    </div>
                    <label className="flex flex-col min-w-64 h-11">
                        <div className="flex w-full flex-1 items-stretch rounded-xl h-full overflow-hidden border border-slate-200 bg-slate-50 transition-focus focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                            <div className="text-slate-400 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent text-slate-900 focus:ring-0 h-full placeholder:text-slate-400 px-3 text-sm font-normal"
                                placeholder="Search courses or student performance..."
                                type="text"
                            />
                        </div>
                    </label>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            className="text-primary text-sm font-bold relative after:content-[''] after:absolute after:-bottom-[19px] after:left-0 after:w-full after:h-0.5 after:bg-primary"
                            href="/admin/dashboard"
                        >
                            Courses
                        </Link>
                        <Link
                            className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors"
                            href="/admin/dashboard"
                        >
                            Live Sessions
                        </Link>
                        <Link
                            className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors"
                            href="/admin/analytics"
                        >
                            AI Lab
                        </Link>
                        <Link
                            className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors"
                            href="/admin/dashboard"
                        >
                            Resources
                        </Link>
                    </nav>
                    <div className="h-6 w-px bg-slate-200 mx-2"></div>
                    <div className="flex gap-3">
                        <button className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-[22px]">
                                notifications
                            </span>
                        </button>
                        <button className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-[22px]">mail</span>
                        </button>
                    </div>
                    <div className="relative bg-white border-2 border-slate-100 rounded-xl size-10 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
                        <Image
                            src={teacherImg}
                            alt="Teacher Avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                <aside className="w-72 border-r border-slate-200 bg-white p-6 hidden lg:flex flex-col justify-between">
                    <div className="flex flex-col gap-8">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-5 px-4">
                                Management Hub
                            </p>
                            <nav className="flex flex-col gap-1.5">
                                <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 cursor-pointer">
                                    <span className="material-symbols-outlined text-[22px]">
                                        analytics
                                    </span>
                                    <span className="text-sm font-bold">Course Insight</span>
                                </Link>
                                <Link href="/admin/students" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-primary cursor-pointer transition-colors group">
                                    <span className="material-symbols-outlined text-[22px] group-hover:text-primary">
                                        groups
                                    </span>
                                    <span className="text-sm font-semibold">Student Management</span>
                                </Link>
                                <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-primary cursor-pointer transition-colors group">
                                    <span className="material-symbols-outlined text-[22px] group-hover:text-primary">
                                        psychology
                                    </span>
                                    <span className="text-sm font-semibold">AI Study Agents</span>
                                </Link>
                                <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-primary cursor-pointer transition-colors group">
                                    <span className="material-symbols-outlined text-[22px] group-hover:text-primary">
                                        quiz
                                    </span>
                                    <span className="text-sm font-semibold">Assessments</span>
                                    <span className="ml-auto bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                                        4
                                    </span>
                                </Link>
                            </nav>
                        </div>
                    </div>
                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-primary text-xl font-bold">
                                auto_awesome
                            </span>
                            <p className="text-[11px] font-black text-primary uppercase tracking-wider">
                                Smart Insight
                            </p>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                            "Physics 2 students are spending 40% more time on
                            'Electromagnetism' than expected. Reviewing the core module might
                            help."
                        </p>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col overflow-y-auto max-h-[calc(100vh-73px)] custom-scrollbar">
                    <div className="p-8 lg:p-10">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
                            <div>
                                <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
                                    <span className="hover:text-primary cursor-pointer">
                                        Dashboard
                                    </span>
                                    <span className="material-symbols-outlined text-sm">
                                        chevron_right
                                    </span>
                                    <span className="text-slate-600">Courses</span>
                                </nav>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                    Course Insight
                                </h1>
                                <p className="text-slate-500 mt-2 font-medium">
                                    Real-time performance tracking and AI engagement metrics.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                                    <span className="material-symbols-outlined text-xl">add</span>
                                    New Course
                                </button>
                                <button className="flex items-center gap-2 rounded-xl bg-primary text-white px-6 py-3 text-sm font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    <span className="material-symbols-outlined text-xl">send</span>
                                    Message All Classes
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Mathematics Card */}
                            <div className="bg-white rounded-3xl border border-green-200 health-glow-green p-7 flex flex-col gap-6 card-hover">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                                            <span className="material-symbols-outlined text-3xl">
                                                functions
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900">
                                                Mathematics 101
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-[10px] font-black border border-green-200 tracking-wider">
                                                    HEALTHY
                                                </span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-xs font-bold text-slate-500">
                                                    124 Students enrolled
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6 py-6 border-y border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">
                                            Class Average
                                        </p>
                                        <p className="text-2xl font-black text-slate-900">84.2%</p>
                                        <div className="mt-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm text-green-600 font-bold">
                                                trending_up
                                            </span>
                                            <span className="text-[10px] text-green-600 font-black">
                                                +2.4%
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">
                                            AI Adoption
                                        </p>
                                        <p className="text-2xl font-black text-slate-900">92%</p>
                                        <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                                            High Intensity
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Physics Card */}
                            <div className="bg-white rounded-3xl border border-amber-200 health-glow-yellow p-7 flex flex-col gap-6 card-hover">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                                            <span className="material-symbols-outlined text-3xl">
                                                science
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900">
                                                Physics 2 (Adv)
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-black border border-amber-200 tracking-wider">
                                                    AT RISK
                                                </span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-xs font-bold text-slate-500">
                                                    88 Students enrolled
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6 py-6 border-y border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">
                                            Class Average
                                        </p>
                                        <p className="text-2xl font-black text-slate-900">68.5%</p>
                                        <div className="mt-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm text-red-500 font-bold">
                                                trending_down
                                            </span>
                                            <span className="text-[10px] text-red-500 font-black">
                                                -5.2%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Participation Table */}
                        <div className="mt-12 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary font-bold">
                                        query_stats
                                    </span>
                                    <h2 className="text-lg font-black text-slate-900">
                                        Class Participation & AI Synergy
                                    </h2>
                                </div>
                                <button className="text-xs font-black text-primary hover:underline px-4 py-2 bg-primary/5 rounded-lg transition-colors">
                                    View Detailed Analytics
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <tr>
                                            <th className="px-8 py-4">Course Name</th>
                                            <th className="px-8 py-4">Class Size</th>
                                            <th className="px-8 py-4">AI Interaction Rate</th>
                                            <th className="px-8 py-4">Avg Completion</th>
                                            <th className="px-8 py-4 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
                                        <tr className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                                                        <span className="material-symbols-outlined text-lg">
                                                            functions
                                                        </span>
                                                    </div>
                                                    <span className="font-bold text-slate-900">
                                                        Mathematics 101
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 font-semibold">124</td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-green-500 h-full rounded-full"
                                                            style={{ width: "92%" }}
                                                        ></div>
                                                    </div>
                                                    <span className="font-bold text-slate-700">92%</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 font-semibold">88%</td>
                                            <td className="px-8 py-5 text-center">
                                                <button className="text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-xl">
                                                        open_in_new
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
