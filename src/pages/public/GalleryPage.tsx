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
  const filtered = useMemo(() => {
    const source = category === "all" ? data : data.filter((item) => item.category.toLowerCase().includes(category.toLowerCase()));
    return source.slice(0, visible);
  }, [category, data, visible]);
  const categories = ["all", "animal", "tree", "food", "community", ...new Set(data.map((item) => item.category))];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10">
      <PageMeta title="Gallery" />
      <InitiativeHero icon={<FaHandsHelping />} title="Stories in Frames: Kindness in Action" subtitle="Visual highlights from animal help, tree plantation, food distribution, and community support." primaryTo="/support-us" primaryLabel="Support Activities" secondaryTo="/volunteer" secondaryLabel="Join Campaign" />
      <Section title="Filter by Initiative" subtitle="Find moments by activity category."><div className="mt-4 flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className="rounded-full border border-slate-300 px-4 py-1 text-sm capitalize dark:border-slate-700">{item}</button>)}</div></Section>
      {loading ? <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-52 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />)}</div> : filtered.length === 0 ? <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">No gallery images found for this category.</div> : <div className="mt-6 columns-1 gap-3 space-y-3 sm:columns-2 lg:columns-3">{filtered.map((item) => {
          const imageSrc = asset(item.imageUrl) || IMAGE_FALLBACK;
          return (
            <motion.button key={item._id} type="button" whileHover={{ scale: 1.01 }} onClick={() => setSelected(item)} className="group relative block w-full overflow-hidden rounded-2xl text-left">
              <img
                src={imageSrc}
                alt={item.title || "Gallery image"}
                loading="lazy"
                className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = IMAGE_FALLBACK;
                }}
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 text-sm text-white opacity-0 transition group-hover:opacity-100">{item.title}</div>
            </motion.button>
          );
        })}</div>}
      {visible < data.length && <button type="button" onClick={() => setVisible((state) => state + 6)} className="mt-6 rounded-full bg-emerald-600 px-6 py-2 text-white">Load More</button>}
      <div className="mt-10"><SupportPrompt message="Your support helps us continue documenting and expanding real on-ground impact." /></div>
      <AnimatePresence>{selected && <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><img src={asset(selected.imageUrl) || IMAGE_FALLBACK} alt={selected.title || "Gallery image"} className="max-h-[90vh] rounded-2xl" loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = IMAGE_FALLBACK; }} /></motion.button>}</AnimatePresence>
    </div>
  );
}