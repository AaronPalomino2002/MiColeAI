"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Subject {
    id: string;
    name: string;
    description: string;
    iconName: string;
    colorTheme: string;
}

interface Agent {
    id: string;
    name: string;
    subjectId: string;
    subject: Subject;
    modelId: string;
    systemPrompt: string;
    avatarUrl: string | null;
}

const THEME_STYLES: Record<string, { gradient: string; icon: string; button: string; accent: string }> = {
    blue:    { gradient: "from-blue-400 to-blue-600",    icon: "text-blue-600",    button: "bg-blue-600",    accent: "text-blue-600" },
    green:   { gradient: "from-emerald-400 to-emerald-600", icon: "text-emerald-600", button: "bg-emerald-600", accent: "text-emerald-600" },
    purple:  { gradient: "from-purple-400 to-purple-600",  icon: "text-purple-600",  button: "bg-purple-600",  accent: "text-purple-600" },
    red:     { gradient: "from-rose-400 to-rose-600",    icon: "text-rose-600",    button: "bg-rose-600",    accent: "text-rose-600" },
    amber:   { gradient: "from-amber-400 to-amber-600",  icon: "text-amber-600",  button: "bg-amber-600",  accent: "text-amber-600" },
    primary: { gradient: "from-blue-400 to-primary",     icon: "text-primary",     button: "bg-primary",     accent: "text-primary" },
};

function getTheme(colorTheme: string) {
    return THEME_STYLES[colorTheme] ?? THEME_STYLES["primary"];
}

export default function AgentsPage() {
    const t = useTranslations("Agents");
    const router = useRouter();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get("/agents")
            .then((data: Agent[]) => setAgents(data))
            .catch((e: Error) => {
                console.error("Error loading agents:", e);
                setError(`No se pudieron cargar los agentes: ${e.message}`);
            })
            .finally(() => setLoading(false));
    }, []);

    function handleStart(agentId: string) {
        router.push(`/chat?agentId=${agentId}`);
    }

    return (
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-2">{t("title")}</h2>
                <p className="text-slate-500 dark:text-slate-400">{t("subtitle")}</p>
            </div>

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-xl h-72 animate-pulse" />
                    ))}
                </div>
            )}

            {error && (
                <p className="text-red-500">{error}</p>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {agents.map((agent) => {
                        const theme = getTheme(agent.subject?.colorTheme);
                        const icon = agent.subject?.iconName ?? "smart_toy";
                        return (
                            <div
                                key={agent.id}
                                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`h-32 bg-gradient-to-br ${theme.gradient} flex items-end px-6 relative overflow-hidden`}>
                                    <div className="absolute -right-4 -top-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
                                        <span
                                            className="material-symbols-outlined text-9xl text-white"
                                            style={{ fontVariationSettings: "'wght' 200" }}
                                        >
                                            {icon}
                                        </span>
                                    </div>
                                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center translate-y-1/2">
                                        <span className={`material-symbols-outlined text-3xl ${theme.icon}`}>
                                            {icon}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-10 pb-6 px-6">
                                    <h3 className="text-xl font-bold mb-2">{agent.name}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                                        {agent.subject?.description ?? ""}
                                    </p>
                                    <button
                                        onClick={() => handleStart(agent.id)}
                                        className={`w-full ${theme.button} text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer`}
                                    >
                                        {t("startStudy")}
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Custom Agent Slot */}
                    <div className="group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-8 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </div>
                        <h3 className="text-lg font-bold">{t("custom.title")}</h3>
                        <p className="text-slate-400 text-sm text-center mt-2">{t("custom.desc")}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
