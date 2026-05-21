import { FaHandsHelping } from "react-icons/fa";
import { Counter } from "@/components/ui/Counter";
import { InitiativeHero } from "@/components/ui/InitiativeHero";
import { PageMeta } from "@/components/ui/PageMeta";
import { Section } from "@/components/ui/Section";
import { SupportPrompt } from "@/components/ui/SupportPrompt";
import { STORE_KEYS } from "@/constants/storeKeys";
import { useApiData } from "@/hooks/useApiData";
import { type TransparencyReport } from "@/types";
import { asset } from "@/utils/asset";

export default function TransparencyPage() {
  const { data: reports } = useApiData<TransparencyReport[]>("/transparency/reports", [], STORE_KEYS.reports);
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10">
      <PageMeta title="Transparency" />
      <InitiativeHero icon={<FaHandsHelping />} title="Transparency Builds Trust, Trust Sustains Impact" subtitle="Every contribution is directed toward real activities and shared through clear monthly progress updates." primaryTo="/support-us" primaryLabel="Support with Confidence" secondaryTo="/our-work" secondaryLabel="See Field Work" />
      <Section title="How Support Is Used" subtitle="Direct activity usage focus."><div className="grid gap-3 md:grid-cols-4">{["Animal feeding and care essentials", "Food distribution and emergency support", "Saplings and aftercare", "Community support operations"].map((item) => <div key={item} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800">{item}</div>)}</div></Section>
      <Section title="Monthly Updates" subtitle="Reports, expenses, and outcomes."><div className="mt-6 grid gap-4 md:grid-cols-3">{reports.map((item) => <div key={item._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"><p className="text-xs uppercase tracking-wide text-emerald-600">{item.month}</p><p className="mt-2 text-sm">{item.summary}</p><p className="mt-2 text-xs text-slate-500">Used: {item.totalSupportUsed || 0}</p>{item.imageUrl && <div className="mt-3 flex h-32 items-center justify-center rounded-lg bg-slate-50 p-2 dark:bg-white/[0.04]"><img src={asset(item.imageUrl)} alt={item.month} className="h-full w-full object-contain" loading="lazy" /></div>}</div>)}</div></Section>
      <Section title="Progress Overview" subtitle="Key transparency indicators."><div className="grid gap-4 sm:grid-cols-3"><Counter label="Reports Published" value={reports.length || 1} /><Counter label="Total Support Used" value={reports.reduce((sum, item) => sum + (item.totalSupportUsed || 0), 0) || 100} /><Counter label="Total Support Received" value={reports.reduce((sum, item) => sum + (item.totalSupportReceived || 0), 0) || 150} /></div></Section>
      <SupportPrompt message="Consistent reporting is possible because supporters help sustain on-ground documentation." />
    </div>
  );
}
