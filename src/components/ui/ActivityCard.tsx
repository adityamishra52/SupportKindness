import { motion } from "framer-motion";
import { useState } from "react";
import type { Activity } from "@/types";
import { asset } from "@/utils/asset";

export function ActivityCard({ item }: { item: Activity }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article whileHover={{ y: -8 }} className="glass-surface overflow-hidden rounded-3xl transition hover:shadow-2xl hover:shadow-cyan-900/20">
      <img src={asset(item.images?.[0]) || "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=900&auto=format&fit=crop"} alt={item.title} className="h-40 w-full object-cover transition duration-500 hover:scale-105" loading="lazy" />
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-wide text-emerald-600">{item.category}</p>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{expanded ? item.description : `${item.description.slice(0, 90)}...`}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{item.location || "Community area"}</p>
        <button type="button" onClick={() => setExpanded((state) => !state)} className="text-sm font-medium text-emerald-600">
          {expanded ? "Read less" : "Read more"}
        </button>
      </div>
    </motion.article>
  );
}
