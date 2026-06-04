"use client";

import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import profilePic from "../assets/student_profile.png";

export default function Sidebar() {
    const pathname = usePathname();
    const t = useTranslations("Portal");

    const menuItems = [
        {
            name: t("menu.dashboard"),
            href: "/dashboard",
            icon: "dashboard",
        },
        {
            name: t("menu.subjects"),
            href: "/agents",
            icon: "smart_toy",
        },
        {
            name: t("menu.exams"),
            href: "/exams",
            icon: "assignment",
        },
        {
            name: t("menu.studyPlan"),
            href: "/dashboard", // Placeholder for now
            icon: "schedule",
        },
    ];

    return (
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
            <div className="p-6 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold leading-none">EduAI</h1>
                    <p className="text-xs text-slate-500 font-medium">{t("sidebar.studentPortal")}</p>
                </div>
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={`${item.href}-${index}`}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive
                                ? "bg-primary/10 text-primary"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                            href={item.href}
                        >
                            <span className={`material-symbols-outlined ${isActive ? "fill-1" : ""}`}>
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                    <div className="relative size-10 rounded-full overflow-hidden">
                        <Image
                            src={profilePic}
                            alt="Student profile avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">Alex Johnson</p>
                        <p className="text-xs text-slate-500 truncate">{t("sidebar.premiumPlan")}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">settings</span>
                </div>
            </div>
        </aside>
    );
}
