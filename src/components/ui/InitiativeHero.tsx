import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/siteConfig";

export function InitiativeHero({
  title,
  subtitle,
  primaryTo,
  primaryLabel,
  secondaryTo,
  secondaryLabel,
  icon,
}: {
  title: string;
  subtitle: string;
  primaryTo: string;
  primaryLabel: string;
  secondaryTo: string;
  secondaryLabel: string;
  icon: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-emerald-50 p-8 text-slate-900 shadow-2xl shadow-slate-200/70 dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white dark:shadow-cyan-950/40 md:p-12">
      <motion.div animate={{ x: [0, 16, 0], y: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -left-10 top-8 h-44 w-44 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-400/20" />
      <motion.div animate={{ x: [0, -14, 0], y: [0, 10, 0] }} transition={{ duration: 9, repeat: Infinity }} className="absolute -right-14 top-16 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-400/20" />
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-sm font-semibold text-cyan-700 shadow-sm dark:border-white/20 dark:bg-white/10 dark:text-cyan-100">{icon} {siteConfig.appName}</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-200/95">{subtitle}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to={primaryTo} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30">{primaryLabel}</Link>
          <Link to={secondaryTo} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">{secondaryLabel}</Link>
        </div>
      </div>
    </section>
  );
}
