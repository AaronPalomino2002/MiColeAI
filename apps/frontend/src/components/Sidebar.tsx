"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const ROLE_LABELS: Record<string, string> = {
    student: "Estudiante",
    tutor: "Tutor",
    teacher: "Docente",
    director: "Director",
};

const ROLE_DASHBOARD: Record<string, string> = {
    student: "/dashboard",
    tutor: "/dashboard/tutor",
    teacher: "/dashboard/teacher",
    director: "/dashboard/director",
};

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations("Portal");
    const [user, setUser] = useState<{ firstName?: string; lastName?: string; email?: string; role?: string } | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const role = user?.role ?? "student";
    const dashboardHref = ROLE_DASHBOARD[role] ?? "/dashboard";

    const menuItems = [
        { name: t("menu.dashboard"), href: dashboardHref, icon: "dashboard" },
        { name: t("menu.subjects"), href: "/agents", icon: "smart_toy" },
        { name: t("menu.exams"), href: "/exams", icon: "assignment" },
        { name: t("menu.studyPlan"), href: "/dashboard", icon: "schedule" },
    ];

    function handleLogout() {
        // Limpiar todo almacenamiento del cliente
        localStorage.clear();
        sessionStorage.clear();

        // Eliminar cookies de sesión (por si el backend o next-auth las usa)
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });

        router.push("/auth/login");
    }

    return (
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold leading-none">EduAI</h1>
                    <p className="text-xs text-slate-500 font-medium">
                        {ROLE_LABELS[role] ?? t("sidebar.studentPortal")}
                    </p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={`${item.href}-${index}`}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                                isActive
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

            {/* User + Logout */}
            <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800 space-y-1">
                {/* Perfil */}
                <div className="flex items-center gap-3 p-2 rounded-lg">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {user?.firstName?.[0] ?? "?"}{user?.lastName?.[0] ?? ""}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                            {user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "—"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            {ROLE_LABELS[role] ?? role}
                        </p>
                    </div>
                </div>

                {/* Cerrar sesión */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}
