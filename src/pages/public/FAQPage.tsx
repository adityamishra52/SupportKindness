import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageMeta } from "@/components/ui/PageMeta";
import { STORE_KEYS } from "@/constants/storeKeys";
import { useApiData } from "@/hooks/useApiData";
import { type FAQItem } from "@/types";

export default function FAQPage() {
  const { data: items } = useApiData<FAQItem[]>("/faqs", [], STORE_KEYS.faqs);
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <PageMeta title="FAQ" />
      <h1 className="text-3xl font-bold">FAQ</h1>
      <div className="mt-6 space-y-3">{items.map((item) => <div key={item._id} className="rounded-xl border border-slate-200 dark:border-slate-800"><button type="button" onClick={() => setOpen(open === item._id ? null : item._id)} className="w-full px-4 py-3 text-left font-medium">{item.question}</button><AnimatePresence>{open === item._id && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">{item.answer}</motion.p>}</AnimatePresence></div>)}</div>
    </div>
  );
}