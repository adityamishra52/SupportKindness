import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { InitiativeHero } from "@/components/ui/InitiativeHero";
import { PageMeta } from "@/components/ui/PageMeta";
import { Section } from "@/components/ui/Section";
import { SupportPrompt } from "@/components/ui/SupportPrompt";
import { STORE_KEYS } from "@/constants/storeKeys";
import { useApiData } from "@/hooks/useApiData";
import { type Testimonial } from "@/types";

export default function TestimonialsPage() {
  const { data: testimonials } = useApiData<Testimonial[]>("/testimonials", [], STORE_KEYS.testimonials);
  const [index, setIndex] = useState(0);
  const items = testimonials.length ? testimonials : [
    { _id: "t1", name: "Volunteer", role: "Feeding Team", content: "Small efforts became a reliable support system for many lives." },
    { _id: "t2", name: "Community Member", role: "Local Resident", content: "The transparency and consistency made me trust this initiative." },
    { _id: "t3", name: "Supporter", role: "Monthly Contributor", content: "Seeing real updates encouraged me to keep supporting." },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), 3200);
    return () => window.clearInterval(timer);
  }, [items.length]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-12 lg:px-10">
      <PageMeta title="Testimonials" />
      <InitiativeHero icon={<FaHandsHelping />} title="Stories from Volunteers, Neighbors, and Supporters" subtitle="Real feedback from people who participated in activities and saw the outcomes directly." primaryTo="/support-us" primaryLabel="Support This Work" secondaryTo="/volunteer" secondaryLabel="Become a Volunteer" />
      <Section title="Featured Story" subtitle="Community voice carousel."><motion.div key={items[index]._id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800"><p className="text-lg leading-8 text-slate-700 dark:text-slate-300">"{items[index].content}"</p><p className="mt-4 font-semibold">{items[index].name}</p><p className="text-sm text-slate-500">{items[index].role || "Community"}</p></motion.div></Section>
      <Section title="More Community Feedback" subtitle="Experiences from diverse participants."><div className="grid gap-4 md:grid-cols-3">{items.map((item) => <motion.div key={item._id} whileHover={{ y: -4 }} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><p className="text-sm text-slate-700 dark:text-slate-300">{item.content}</p><p className="mt-3 font-semibold">{item.name}</p></motion.div>)}</div></Section>
      <SupportPrompt message="Support helps us continue transparent and consistent community kindness work." />
    </div>
  );
}