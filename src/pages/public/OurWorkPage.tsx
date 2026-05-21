import { ActivityCard } from "@/components/ui/ActivityCard";
import { PageMeta } from "@/components/ui/PageMeta";
import { Section } from "@/components/ui/Section";
import { STORE_KEYS } from "@/constants/storeKeys";
import { fallbackActivities } from "@/data/fallbackActivities";
import { useApiData } from "@/hooks/useApiData";
import { type Activity } from "@/types";

export default function OurWorkPage() {
  const { data: activities, loading } = useApiData<Activity[]>("/activities", fallbackActivities, STORE_KEYS.activities);
  const featured = activities.filter((item) => item.featured);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10">
      <PageMeta title="Our Work" />
      <h1 className="text-3xl font-bold">Our Work</h1>
      <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">Real activity stories from feeding, plantation, distribution, and community missions.</p>
      <Section title="Featured Campaigns" subtitle="Current focus areas needing support."><div className="grid gap-4 md:grid-cols-3">{(featured.length ? featured : activities.slice(0, 3)).map((item) => <ActivityCard key={item._id} item={item} />)}</div></Section>
      <Section title="All Activities" subtitle="Dates, locations, and category-wise impact.">{loading ? <div className="grid gap-3 md:grid-cols-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />)}</div> : <div className="grid gap-4 md:grid-cols-2">{activities.map((item) => <ActivityCard key={item._id} item={item} />)}</div>}</Section>
    </div>
  );
}