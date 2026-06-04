"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function LandingPage() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">
                auto_awesome
              </span>
            </div>
            <span className="text-xl font-bold tracking-tight">EduAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-primary transition-colors">{t("nav.features")}</a>
            <a href="#about" className="hover:text-primary transition-colors">{t("nav.about")}</a>
            <a href="#pricing" className="hover:text-primary transition-colors">{t("nav.pricing")}</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <button className="px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                {t("nav.login")}
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="px-5 py-2.5 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5">
                {t("nav.register")}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-32">
        <section className="relative px-6 py-20 md:py-32 overflow-hidden">
          {/* Background Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
          </div>

          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t("nav.features")}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("description")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all transform hover:-translate-y-1 text-lg">
                  {t("getStarted")}
                </button>
              </Link>
              <Link href="/auth/login" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-lg">
                  {t("viewDemo")}
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section Short */}
        <section id="features" className="px-6 py-20 bg-white dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all">
              <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">quiz</span>
              </div>
              <h3 className="text-xl font-bold mb-4">{t("features.exams.title")}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {t("features.exams.description")}
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all">
              <div className="size-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">chat</span>
              </div>
              <h3 className="text-xl font-bold mb-4">{t("features.chat.title")}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {t("features.chat.description")}
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all">
              <div className="size-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <h3 className="text-xl font-bold mb-4">{t("features.analytics.title")}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {t("features.analytics.description")}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <div className="size-6 bg-slate-400 rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">
              auto_awesome
            </span>
          </div>
          <span className="font-bold text-sm">EduAI</span>
        </div>
        <p className="text-slate-500 text-xs">© 2024 EduAI. Todos los derechos reservados. Hecho con ❤️ para estudiantes.</p>
      </footer>
    </div>
  );
}
