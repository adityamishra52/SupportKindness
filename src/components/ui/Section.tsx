import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Section({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto w-full max-w-7xl px-6 py-20 lg:px-10 ${className ?? ""}`}>
      <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">{title}</h2>
      {subtitle && <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{subtitle}</p>}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6">
        {children}
      </motion.div>
    </section>
  );
}
