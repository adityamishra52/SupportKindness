import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiArrowUpRight, FiCalendar, FiMapPin, FiX } from "react-icons/fi";
import type { Activity } from "@/types";
import { asset } from "@/utils/asset";

export function ActivityCard({ item }: { item: Activity }) {
  const [open, setOpen] = useState(false);
  const imageSrc =
    asset(item.images?.[0]) ||
    "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=900&auto=format&fit=crop";
  const shortDescription =
    item.description.length > 110
      ? `${item.description.slice(0, 110).trim()}...`
      : item.description;
  const formattedDate = item.date
    ? new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(item.date))
    : null;

  return (
    <>
      <motion.article
        whileHover={{ y: -6 }}
        className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/70 transition hover:border-cyan-200 hover:shadow-2xl hover:shadow-cyan-950/15 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-black/25"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50 to-emerald-50 p-3 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950"
          aria-label={`Open ${item.title}`}
        >
          <img
            src={imageSrc}
            alt={item.title}
            className="h-full w-full rounded-[1.25rem] object-contain transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <span className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg shadow-slate-900/10 opacity-0 transition group-hover:opacity-100 dark:bg-slate-950/85 dark:text-white">
            <FiArrowUpRight className="h-5 w-5" />
          </span>
        </button>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
            {item.category}
          </p>
          <h3 className="mt-3 text-xl font-black leading-tight text-slate-950 dark:text-white">
            {item.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/10">
              <FiMapPin className="h-3.5 w-3.5" />
              {item.location || "Community area"}
            </span>
            {formattedDate && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/10">
                <FiCalendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30"
          >
            View campaign <FiArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </motion.article>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-md sm:p-5"
            onClick={() => setOpen(false)}
          >
            <motion.article
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="relative my-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl shadow-slate-950/30 dark:border-white/10 dark:bg-slate-950 lg:grid-cols-[1.05fr_0.95fr]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl shadow-slate-950/15 transition hover:bg-white dark:bg-slate-900/90 dark:text-white"
                aria-label="Close campaign popup"
              >
                <FiX className="h-5 w-5" />
              </button>

              <div className="flex min-h-[18rem] items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50 to-emerald-50 p-4 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950 sm:p-6">
                <img
                  src={imageSrc}
                  alt={item.title}
                  className="max-h-[64vh] w-full rounded-[1.5rem] object-contain shadow-2xl shadow-slate-950/15"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">
                  {item.category}
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 dark:text-white">
                  {item.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
                <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                    <FiMapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    {item.location || "Community area"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                    <FiCalendar className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                    {formattedDate || "Active campaign"}
                  </span>
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
