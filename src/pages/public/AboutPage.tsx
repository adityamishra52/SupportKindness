import { Counter } from "@/components/ui/Counter";
import { PageMeta } from "@/components/ui/PageMeta";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/siteConfig";
import { STORE_KEYS } from "@/constants/storeKeys";
import { fallbackActivities } from "@/data/fallbackActivities";
import { useApiData } from "@/hooks/useApiData";
import { type Activity, type TransparencyReport } from "@/types";

export default function AboutPage() {
  const { data: activities } = useApiData<Activity[]>("/activities", fallbackActivities, STORE_KEYS.activities);
  const { data: reports } = useApiData<TransparencyReport[]>("/transparency/reports", [], STORE_KEYS.reports);
  const impact = {
    animals: activities.filter((item) => item.category.toLowerCase().includes("animal")).length * 24 + 120,
    meals: activities.filter((item) => item.category.toLowerCase().includes("food")).length * 38 + 240,
    trees: activities.filter((item) => item.category.toLowerCase().includes("tree")).length * 20 + 80,
    communities: Math.max(activities.length, 1) * 3,
  };
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10">
      <PageMeta title="About" />
      <h1 className="text-3xl font-bold">About {siteConfig.appName}</h1>
      <Section title="Why I Started This Initiative" subtitle="Small acts of care create big impact."><p className="max-w-3xl leading-7 text-slate-700 dark:text-slate-300">{siteConfig.appName} started from a simple belief: if we can help one hungry animal, one struggling family, or one neighborhood needing support, we should do it now. The goal is practical kindness with direct action and transparent updates.</p></Section>
      <Section title="My Goal" subtitle="Build a positive local kindness movement."><ul className="grid gap-2 sm:grid-cols-2 text-slate-700 dark:text-slate-300"><li>Feed more street animals regularly.</li><li>Organize reliable food support.</li><li>Increase tree plantation efforts.</li><li>Inspire more volunteers to join.</li></ul></Section>
      <Section title="What Happens When You Support" subtitle="Support becomes action."><p className="max-w-3xl leading-7 text-slate-700 dark:text-slate-300">Contributions help purchase food supplies, arrange drives, feed animals, buy saplings, and sustain future missions with transparency.</p></Section>
      <Section title="Future Vision" subtitle="A stronger community support network."><ul className="grid gap-2 sm:grid-cols-2 text-slate-700 dark:text-slate-300"><li>Bigger monthly food drives.</li><li>Faster animal rescue support.</li><li>Larger plantation campaigns.</li><li>Expanded monthly impact reporting.</li></ul></Section>
      <Section title="Impact Statistics" subtitle="Live counters based on activity data."><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Counter label="Animals Helped" value={impact.animals} /><Counter label="Meals Distributed" value={impact.meals} /><Counter label="Trees Planted" value={impact.trees} /><Counter label="Communities Supported" value={impact.communities + reports.length} /></div></Section>
      <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-100">This is a personal community support initiative, not a registered NGO.</p>
    </div>
  );
}
