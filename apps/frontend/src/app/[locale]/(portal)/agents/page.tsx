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

const THEME_STYLES: Record<string, { gradient: string; icon: string; button: string }> = {
    blue:    { gradient: "from-blue-400 to-blue-600",       icon: "text-blue-600",    button: "bg-blue-600"    },
    green:   { gradient: "from-emerald-400 to-emerald-600", icon: "text-emerald-600", button: "bg-emerald-600" },
    emerald: { gradient: "from-emerald-400 to-emerald-600", icon: "text-emerald-600", button: "bg-emerald-600" },
    purple:  { gradient: "from-purple-400 to-purple-600",   icon: "text-purple-600",  button: "bg-purple-600"  },
    red:     { gradient: "from-rose-400 to-rose-600",       icon: "text-rose-600",    button: "bg-rose-600"    },
    amber:   { gradient: "from-amber-400 to-amber-600",     icon: "text-amber-600",   button: "bg-amber-600"   },
    primary: { gradient: "from-blue-400 to-primary",        icon: "text-primary",     button: "bg-primary"     },
};

const COLOR_OPTIONS = [
    { value: "primary", label: "Azul",    dot: "bg-blue-500"    },
    { value: "emerald", label: "Verde",   dot: "bg-emerald-500" },
    { value: "purple",  label: "Morado",  dot: "bg-purple-500"  },
    { value: "amber",   label: "Naranja", dot: "bg-amber-500"   },
    { value: "red",     label: "Rojo",    dot: "bg-rose-500"    },
];

const MODEL_OPTIONS = [
    { value: "gpt-4o-mini",  label: "GPT-4o Mini  (rápido, económico)" },
    { value: "gpt-4o",       label: "GPT-4o       (más capaz)"         },
    { value: "gpt-4-turbo",  label: "GPT-4 Turbo  (equilibrado)"       },
];

const ICON_OPTIONS = [
    "smart_toy", "calculate", "science", "biotech", "history_edu",
    "psychology", "language", "code", "architecture", "music_note",
];

function getTheme(colorTheme: string) {
    return THEME_STYLES[colorTheme] ?? THEME_STYLES["primary"];
}

interface CreateForm {
    name: string;
    description: string;
    modelId: string;
    systemPrompt: string;
    iconName: string;
    colorTheme: string;
}

const EMPTY_FORM: CreateForm = {
    name: "",
    description: "",
    modelId: "gpt-4o-mini",
    systemPrompt: "",
    iconName: "smart_toy",
    colorTheme: "primary",
};

export default function AgentsPage() {
    const t = useTranslations("Agents");
    const router = useRouter();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<CreateForm>(EMPTY_FORM);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    function loadAgents() {
        setLoading(true);
        api.get("/agents")
            .then((data: Agent[]) => setAgents(data))
            .catch((e: Error) => setError(`No se pudieron cargar los agentes: ${e.message}`))
            .finally(() => setLoading(false));
    }

    useEffect(() => { loadAgents(); }, []);

    function handleStart(agentId: string) {
        router.push(`/chat?agentId=${agentId}`);
    }

    function openModal() {
        setForm(EMPTY_FORM);
        setCreateError(null);
        setModalOpen(true);
    }

    async function handleCreate(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!form.name.trim() || !form.systemPrompt.trim()) return;
        setCreating(true);
        setCreateError(null);
        try {
            await api.post("/agents", form);
            setModalOpen(false);
            loadAgents();
        } catch (err: unknown) {
            setCreateError(err instanceof Error ? err.message : "Error al crear el agente");
        } finally {
            setCreating(false);
        }
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

            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {agents.map((agent) => {
                        const theme = getTheme(agent.subject?.colorTheme);
                        const icon = agent.subject?.iconName ?? "smart_toy";
                        return (
                            <div key={agent.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={`h-32 bg-gradient-to-br ${theme.gradient} flex items-end px-6 relative overflow-hidden`}>
                                    <div className="absolute -right-4 -top-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
                                        <span className="material-symbols-outlined text-9xl text-white" style={{ fontVariationSettings: "'wght' 200" }}>
                                            {icon}
                                        </span>
                                    </div>
                                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center translate-y-1/2">
                                        <span className={`material-symbols-outlined text-3xl ${theme.icon}`}>{icon}</span>
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
                    <div
                        onClick={openModal}
                        className="group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-8 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </div>
                        <h3 className="text-lg font-bold">{t("custom.title")}</h3>
                        <p className="text-slate-400 text-sm text-center mt-2">{t("custom.desc")}</p>
                    </div>
                </div>
            )}

            {/* Create Agent Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">smart_toy</span>
                                </div>
                                <h3 className="text-lg font-bold">Crear Agente</h3>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-5">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Nombre del tutor / curso <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Ej: Tutor de Cálculo II"
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Descripción
                                </label>
                                <input
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Ej: Resuelve integrales y límites paso a paso"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            {/* Model */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Modelo GPT <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.modelId}
                                    onChange={e => setForm(f => ({ ...f, modelId: e.target.value }))}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                                >
                                    {MODEL_OPTIONS.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* System Prompt */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Instrucciones del agente (system prompt) <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={form.systemPrompt}
                                    onChange={e => setForm(f => ({ ...f, systemPrompt: e.target.value }))}
                                    placeholder="Ej: Eres un tutor experto en Cálculo II. Explica los conceptos paso a paso, usa ejemplos prácticos y responde siempre en español."
                                    required
                                    rows={4}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
                                />
                            </div>

                            {/* Icon + Color row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ícono</label>
                                    <select
                                        value={form.iconName}
                                        onChange={e => setForm(f => ({ ...f, iconName: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                                    >
                                        {ICON_OPTIONS.map(icon => (
                                            <option key={icon} value={icon}>{icon}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Color</label>
                                    <div className="flex gap-2 pt-1">
                                        {COLOR_OPTIONS.map(c => (
                                            <button
                                                key={c.value}
                                                type="button"
                                                title={c.label}
                                                onClick={() => setForm(f => ({ ...f, colorTheme: c.value }))}
                                                className={`size-8 rounded-full ${c.dot} transition-all ${form.colorTheme === c.value ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "opacity-60 hover:opacity-100"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                <div className={`h-16 bg-gradient-to-br ${getTheme(form.colorTheme).gradient} flex items-end px-4 relative overflow-hidden`}>
                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 shadow flex items-center justify-center translate-y-1/2">
                                        <span className={`material-symbols-outlined text-xl ${getTheme(form.colorTheme).icon}`}>{form.iconName}</span>
                                    </div>
                                </div>
                                <div className="pt-7 pb-3 px-4">
                                    <p className="font-bold text-sm">{form.name || "Nombre del agente"}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{form.description || "Descripción"}</p>
                                </div>
                            </div>

                            {createError && (
                                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{createError}</p>
                            )}

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating || !form.name.trim() || !form.systemPrompt.trim()}
                                    className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {creating ? (
                                        <>
                                            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                            Creando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-sm">add</span>
                                            Crear Agente
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
