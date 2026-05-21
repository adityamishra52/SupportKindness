import { FaLeaf } from "react-icons/fa";
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

export default function TreePlantationPage() {
  const { data: activities } = useApiData<Activity[]>("/activities", fallbackActivities, STORE_KEYS.activities);
  const { data: gallery } = useApiData<GalleryItem[]>("/gallery", [], STORE_KEYS.gallery);
  const treeActivities = activities.filter((item) => item.category.toLowerCase().includes("tree") || item.category.toLowerCase().includes("plant"));
  const treeGallery = gallery.filter((item) => item.category.toLowerCase().includes("tree")).slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-12 lg:px-10">
      <PageMeta title="Tree Plantation" />
      <InitiativeHero icon={<FaLeaf />} title="Plant Today for a Cooler, Greener Tomorrow" subtitle="Tree plantation for cleaner air, healthier neighborhoods, and climate resilience." primaryTo="/volunteer" primaryLabel="Join Green Campaign" secondaryTo="/support-us" secondaryLabel="Support Plantation" />
      <Section title="Why Trees Matter" subtitle="Local greenery improves environmental health."><p className="max-w-3xl leading-7 text-slate-700 dark:text-slate-300">Trees reduce heat, absorb pollutants, and support biodiversity. Small local plantation drives create meaningful long-term change.</p></Section>
      <Section title="Plantation Activities" subtitle="Campaigns with follow-up care."><div className="grid gap-4 md:grid-cols-2">{(treeActivities.length ? treeActivities : activities.slice(0, 4)).map((item) => <ActivityCard key={item._id} item={item} />)}</div></Section>
      <Section title="Progress Statistics" subtitle="Eco-impact indicators."><div className="grid gap-4 sm:grid-cols-4"><Counter label="Trees Planted" value={treeActivities.length * 40 + 100} /><Counter label="Areas Covered" value={treeActivities.length * 3 + 8} /><Counter label="Volunteers Joined" value={treeActivities.length * 15 + 45} /><Counter label="Oxygen Impact" value={treeActivities.length * 120 + 450} /></div></Section>
      <Section title="Gallery" subtitle="Visual highlights from drives."><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{(treeGallery.length ? treeGallery : gallery.slice(0, 6)).map((item) => <div key={item._id} className="flex h-52 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 dark:bg-white/[0.04]"><img src={asset(item.imageUrl)} alt={item.title} className="h-full w-full object-contain" loading="lazy" /></div>)}</div></Section>
      <SupportPrompt message="Your support helps purchase saplings, tools, and care supplies for long-term tree growth." />
    </div>
  );
}
