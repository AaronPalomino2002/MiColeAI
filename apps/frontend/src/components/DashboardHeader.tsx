"use client";

import { useTranslations } from "next-intl";
import { useSidebar } from "./SidebarContext";

export default function DashboardHeader() {
    const t = useTranslations("Portal");
    const { toggle } = useSidebar();

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shrink-0">
            {/* Botón hamburguesa (solo móvil) */}
            <button
                onClick={toggle}
                className="lg:hidden size-10 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 mr-1"
                aria-label="Abrir menú"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>

            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">
                        search
                    </span>
                    <input
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all"
                        placeholder={t("header.search")}
                        type="text"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    <span>{t("header.askAI")}</span>
                </button>
            </div>
        </header>
    );
}
