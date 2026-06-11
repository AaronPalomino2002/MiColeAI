"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { api } from "@/lib/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations("Auth.login");
    const tf = useTranslations("Auth");
    const te = useTranslations("Auth.errors");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await api.post("/auth/login", { email, password });
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            const roleRoutes: Record<string, string> = {
                student: "/dashboard",
                tutor: "/dashboard/tutor",
                teacher: "/dashboard/teacher",
                director: "/dashboard/director",
            };
            router.push(roleRoutes[data.user.role] ?? "/dashboard");
        } catch (err: any) {
            setError(err.message || te("invalidCredentials"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            {/* Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-20 py-4 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center gap-3 text-primary">
                    <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">
                            auto_awesome
                        </span>
                    </div>
                    <Link href="/">
                        <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight cursor-pointer">
                            EduAI
                        </h1>
                    </Link>
                </div>
                <div className="flex gap-3">
                    <Link href="/auth/register">
                        <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            {t("signUpNow")}
                        </button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-10">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {t("title")}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            {t("subtitle")}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {t("emailLabel")}
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    mail
                                </span>
                                <input
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white"
                                    placeholder="student@school.edu"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {t("passwordLabel")}
                                </label>
                                <Link href="/auth/register" className="text-xs text-primary hover:underline">
                                    {t("forgotPassword")}
                                </Link>
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    lock
                                </span>
                                <input
                                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                    type="button"
                                >
                                    <span className="material-symbols-outlined">visibility</span>
                                </button>
                            </div>
                        </div>
                        <button
                            className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? t("loggingIn") : t("loginButton")}
                        </button>
                    </form>
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {t("noAccount")}
                            <Link
                                className="text-primary font-bold hover:underline ml-1"
                                href="/auth/register"
                            >
                                {t("signUpNow")}
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-10 px-6 text-center text-slate-500 dark:text-slate-500 text-sm">
                <p>{tf("footer")}</p>
            </footer>
        </div>
    );
}
