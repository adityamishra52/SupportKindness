import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { InitiativeHero } from "@/components/ui/InitiativeHero";
import { PageMeta } from "@/components/ui/PageMeta";
import { Section } from "@/components/ui/Section";
import { SupportPrompt } from "@/components/ui/SupportPrompt";
import { STORE_KEYS } from "@/constants/storeKeys";
import { useApiData } from "@/hooks/useApiData";
import { type GalleryItem } from "@/types";
import { asset } from "@/utils/asset";

const IMAGE_FALLBACK = "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=900&auto=format&fit=crop";

export default function GalleryPage() {
  const { data, loading } = useApiData<GalleryItem[]>("/gallery", [], STORE_KEYS.gallery);
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [visible, setVisible] = useState(6);
  const filteredSource = useMemo(
    () => category === "all" ? data : data.filter((item) => item.category.toLowerCase() === category.toLowerCase()),
    [category, data]
  );
  const filtered = useMemo(() => {
    return filteredSource.slice(0, visible);
  }, [filteredSource, visible]);
  const categories = useMemo(
    () => ["all", ...Array.from(new Set(data.map((item) => (item.category || "general").toLowerCase())))],
    [data]
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10">
      <PageMeta title="Gallery" />
      <InitiativeHero icon={<FaHandsHelping />} title="Stories in Frames: Kindness in Action" subtitle="Visual highlights from animal help, tree plantation, food distribution, and community support." primaryTo="/support-us" primaryLabel="Support Activities" secondaryTo="/volunteer" secondaryLabel="Join Campaign" />
      <Section title="Filter by Initiative" subtitle="Find moments by activity category."><div className="mt-4 flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-4 py-1 text-sm capitalize transition ${category === item ? "border-cyan-400 bg-cyan-50 text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-200" : "border-slate-300 dark:border-slate-700"}`}>{item}</button>)}</div></Section>
      {loading ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />)}</div> : filtered.length === 0 ? <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">No gallery images found for this category.</div> : <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => {
          const imageSrc = asset(item.imageUrl) || IMAGE_FALLBACK;
          const imageFit = item.thumbnailFit === "cover" ? "object-cover" : "object-contain";
          return (
            <motion.button key={item._id} type="button" whileHover={{ y: -4 }} onClick={() => setSelected(item)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={imageSrc}
                  alt={item.title || "Gallery image"}
                  loading="lazy"
                  className={`h-full w-full ${imageFit} transition duration-500 group-hover:scale-[1.03]`}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = IMAGE_FALLBACK;
                  }}
                />
              </div>
              <div className="p-4">
                <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{item.title || "Untitled image"}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">{item.category || "general"}</p>
                {item.caption && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.caption}</p>}
              </div>
            </motion.button>
          );
        })}</div>}
      {visible < filteredSource.length && <button type="button" onClick={() => setVisible((state) => state + 6)} className="mt-6 rounded-full bg-emerald-600 px-6 py-2 text-white">Load More</button>}
      <div className="mt-10"><SupportPrompt message="Your support helps us continue documenting and expanding real on-ground impact." /></div>
      <AnimatePresence>{selected && <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4 text-white"><img src={asset(selected.imageUrl) || IMAGE_FALLBACK} alt={selected.title || "Gallery image"} className="max-h-[78vh] max-w-[92vw] rounded-2xl object-contain" loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = IMAGE_FALLBACK; }} /><div className="mt-4 max-w-2xl text-center"><p className="font-semibold">{selected.title}</p>{selected.caption && <p className="mt-1 text-sm text-white/80">{selected.caption}</p>}</div></motion.button>}</AnimatePresence>
    </div>
  );
}
