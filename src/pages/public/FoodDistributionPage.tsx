import { FaHandsHelping } from "react-icons/fa";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { Counter } from "@/components/ui/Counter";
import { InitiativeHero } from "@/components/ui/InitiativeHero";
import { PageMeta } from "@/components/ui/PageMeta";
import { Section } from "@/components/ui/Section";
import { SupportPrompt } from "@/components/ui/SupportPrompt";
import { STORE_KEYS } from "@/constants/storeKeys";
import { fallbackActivities } from "@/data/fallbackActivities";
import { useApiData } from "@/hooks/useApiData";
import { type Activity, type Testimonial } from "@/types";

export default function FoodDistributionPage() {
  const { data: activities } = useApiData<Activity[]>("/activities", fallbackActivities, STORE_KEYS.activities);
  const { data: testimonials } = useApiData<Testimonial[]>("/testimonials", [], STORE_KEYS.testimonials);
  const foodActivities = activities.filter((item) => item.category.toLowerCase().includes("food") || item.category.toLowerCase().includes("meal"));

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-12 lg:px-10">
      <PageMeta title="Food Distribution" />
      <InitiativeHero icon={<FaHandsHelping />} title="No One Should Sleep Hungry" subtitle="Food drives are organized to support families and individuals with dignity and consistency." primaryTo="/support-us" primaryLabel="Support Meal Drives" secondaryTo="/volunteer" secondaryLabel="Join Distribution" />
      <Section title="Why Food Support Matters" subtitle="Timely meals create immediate relief."><p className="max-w-3xl leading-7 text-slate-700 dark:text-slate-300">Hunger affects health and stability. Community-led meal support helps families and workers recover during difficult phases.</p></Section>
      <Section title="Food Distribution Activities" subtitle="Recent drives and support campaigns."><div className="grid gap-4 md:grid-cols-2">{(foodActivities.length ? foodActivities : activities.slice(0, 4)).map((item) => <ActivityCard key={item._id} item={item} />)}</div></Section>
      <Section title="Community Stories" subtitle="Voices from field work."><div className="grid gap-4 md:grid-cols-3">{(testimonials.length ? testimonials : [{ _id: "s1", name: "Local Volunteer", content: "A warm meal can bring real hope during hard times." } as Testimonial]).slice(0, 3).map((item) => <div key={item._id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><p className="text-sm text-slate-700 dark:text-slate-300">{item.content}</p><p className="mt-2 text-sm font-semibold">{item.name}</p></div>)}</div></Section>
      <Section title="Statistics" subtitle="Food support outcomes."><div className="grid gap-4 sm:grid-cols-3"><Counter label="Meals Distributed" value={foodActivities.length * 90 + 220} /><Counter label="Families Helped" value={foodActivities.length * 20 + 60} /><Counter label="Distribution Drives" value={foodActivities.length * 2 + 12} /></div></Section>
      <SupportPrompt message="Your support helps procure and distribute meals where they are needed most." />
    </div>
  );
}