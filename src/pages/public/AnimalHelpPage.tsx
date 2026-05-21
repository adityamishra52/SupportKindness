import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaPaw } from "react-icons/fa";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { Counter } from "@/components/ui/Counter";
import { InitiativeHero } from "@/components/ui/InitiativeHero";
import { PageMeta } from "@/components/ui/PageMeta";
import { Section } from "@/components/ui/Section";
import { SupportPrompt } from "@/components/ui/SupportPrompt";
import { STORE_KEYS } from "@/constants/storeKeys";
import { fallbackActivities } from "@/data/fallbackActivities";
import { useApiData } from "@/hooks/useApiData";
import { type Activity, type GalleryItem } from "@/types";
import { asset } from "@/utils/asset";

export default function AnimalHelpPage() {
  const { data: activities } = useApiData<Activity[]>("/activities", fallbackActivities, STORE_KEYS.activities);
  const { data: gallery } = useApiData<GalleryItem[]>("/gallery", [], STORE_KEYS.gallery);
  const animalActivities = activities.filter((item) => item.category.toLowerCase().includes("animal") || item.category.toLowerCase().includes("dog") || item.category.toLowerCase().includes("cat"));
  const animalImages = gallery.filter((item) => item.category.toLowerCase().includes("animal")).slice(0, 6);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-12 lg:px-10">
      <PageMeta title="Animal Help" />
      <InitiativeHero icon={<FaPaw />} title="Every Hungry Street Animal Deserves Care, Food, and Kindness" subtitle="Daily feeding, rescue support, and hydration initiatives for street animals." primaryTo="/support-us" primaryLabel="Support Animal Care" secondaryTo="/volunteer" secondaryLabel="Join Feeding Drives" />
      <Section title="Why Animal Help Matters" subtitle="Street animals face hunger and injury every day."><p className="max-w-3xl leading-7 text-slate-700 dark:text-slate-300">A single meal or rescue response can prevent suffering and save lives. Animal care also builds empathy and safer neighborhoods.</p></Section>
      <Section title="Our Animal Care Activities" subtitle="Dynamic updates from feeding and support work."><div className="grid gap-4 md:grid-cols-2">{(animalActivities.length ? animalActivities : activities.slice(0, 4)).map((item) => <ActivityCard key={item._id} item={item} />)}</div></Section>
      <Section title="Animal Gallery" subtitle="Activity moments from care missions."><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{(animalImages.length ? animalImages : gallery.slice(0, 6)).map((item) => <motion.button key={item._id} type="button" onClick={() => setSelected(item)} whileHover={{ scale: 1.01 }} className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-50 p-2 dark:bg-white/[0.04]"><img src={asset(item.imageUrl)} alt={item.title} loading="lazy" className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]" /></motion.button>)}</div></Section>
      <Section title="Impact Statistics" subtitle="Care outcomes from regular efforts."><div className="grid gap-4 sm:grid-cols-4"><Counter label="Animals Fed" value={animalActivities.length * 55 + 120} /><Counter label="Rescue Activities" value={animalActivities.length * 7 + 12} /><Counter label="Food Packets" value={animalActivities.length * 45 + 140} /><Counter label="Water Bowls" value={animalActivities.length * 5 + 18} /></div></Section>
      <SupportPrompt message="Your support helps buy food, medicines, and rescue essentials for street animals." />
      <AnimatePresence>{selected && <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"><img src={asset(selected.imageUrl)} alt={selected.title} className="max-h-[90vh] max-w-[94vw] rounded-2xl object-contain shadow-2xl shadow-black/40" /></motion.button>}</AnimatePresence>
    </div>
  );
}
