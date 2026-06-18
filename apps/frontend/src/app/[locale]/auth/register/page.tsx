"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { api } from "@/lib/api";

export default function RegistrationPage() {
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        school: "",
        gradeLevel: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations("Auth.register");
    const tf = useTranslations("Auth");
    const te = useTranslations("Auth.errors");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/auth/register", formData);
            router.push("/auth/login");
        } catch (err: any) {
            setError(err.message || te("somethingWentWrong"));
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
                            MiColeAI
                        </h1>
                    </Link>
                </div>
                <div className="flex gap-3">
                    <Link href="/auth/login">
                        <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            {t("loginLink")}
                        </button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                    {/* Left Side: Visual/Marketing */}
                    <div className="hidden lg:flex flex-col justify-center p-12 bg-primary/5 relative overflow-hidden">
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-wider">{t("marketingBadge")}</span>
                            <h2 className="text-4xl xl:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                                {t.rich("marketingTitle", {
                                    span: (chunks) => <span className="text-primary">{chunks}</span>
                                })}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                                {t("marketingSubtitle")}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">check_circle</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{t("feature1")}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">check_circle</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{t("feature2")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t("title")}</h2>
                            <p className="text-slate-500 dark:text-slate-400">{t("subtitle")}</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center">
                                {te("somethingWentWrong")}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("firstName")}</label>
                                    <input
                                        name="firstName"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-all text-slate-900 dark:text-white"
                                        placeholder="Juan"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("lastName")}</label>
                                    <input
                                        name="lastName"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-all text-slate-900 dark:text-white"
                                        placeholder="Perez"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("email")}</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                                    <input
                                        name="email"
                                        required
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white"
                                        placeholder="student@school.edu"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("school")}</label>
                                    <input
                                        name="school"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white"
                                        placeholder="Lincoln High"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("grade")}</label>
                                    <select
                                        name="gradeLevel"
                                        required
                                        defaultValue=""
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white appearance-none"
                                        onChange={handleChange}
                                    >
                                        <option disabled value="">{t("selectGrade")}</option>
                                        <option value="9">Grade 9</option>
                                        <option value="10">Grade 10</option>
                                        <option value="11">Grade 11</option>
                                        <option value="12">Grade 12</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("password")}</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                                    <input
                                        name="password"
                                        required
                                        type="password"
                                        className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? t("creatingAccount") : t("createAccount")}
                            </button>
                        </form>
                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-slate-600 dark:text-slate-400">{t("haveAccount")} <Link className="text-primary font-bold hover:underline ml-1" href="/auth/login">{t("loginLink")}</Link></p>
                        </div>
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
