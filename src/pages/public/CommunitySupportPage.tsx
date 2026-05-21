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
import { type Activity } from "@/types";

export default function CommunitySupportPage() {
  const { data: activities } = useApiData<Activity[]>("/activities", fallbackActivities, STORE_KEYS.activities);
  const communityActivities = activities.filter((item) => item.category.toLowerCase().includes("community") || item.category.toLowerCase().includes("support"));
  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-12 lg:px-10">
      <PageMeta title="Community Support" />
      <InitiativeHero icon={<FaHandsHelping />} title="Community Care During Everyday Struggles and Emergencies" subtitle="Coordinated support creates real relief for families and neighborhoods." primaryTo="/support-us" primaryLabel="Support a Community Drive" secondaryTo="/volunteer" secondaryLabel="Join as Volunteer" />
      <Section title="Helping Communities" subtitle="A practical and compassionate support model."><p className="max-w-3xl leading-7 text-slate-700 dark:text-slate-300">Emergency essentials, quick assistance, and organized volunteer action reduce stress for people facing difficult periods.</p></Section>
      <Section title="Community Activities" subtitle="Recent campaigns and support missions."><div className="grid gap-4 md:grid-cols-2">{(communityActivities.length ? communityActivities : activities.slice(0, 4)).map((item) => <ActivityCard key={item._id} item={item} />)}</div></Section>
      <Section title="Impact Numbers" subtitle="Visible outcomes from regular support."><div className="grid gap-4 sm:grid-cols-4"><Counter label="Emergency Cases" value={communityActivities.length * 8 + 20} /><Counter label="Support Drives" value={communityActivities.length * 2 + 10} /><Counter label="Families Reached" value={communityActivities.length * 15 + 65} /><Counter label="Volunteer Hours" value={communityActivities.length * 30 + 120} /></div></Section>
      <SupportPrompt message="Your support helps run emergency aid and neighborhood kindness missions." />
    </div>
  );
}