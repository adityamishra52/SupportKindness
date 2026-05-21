import { useState } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { InitiativeHero } from "@/components/ui/InitiativeHero";
import { PageMeta } from "@/components/ui/PageMeta";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/siteConfig";
import { useToast } from "@/context/ToastContext";

export default function VolunteerPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", interest: "Feeding drives", message: "" });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-12 lg:px-10">
      <PageMeta
        title="Volunteer"
        description={`Join ${siteConfig.appName} volunteer campaigns for feeding drives, tree plantations, and local community support.`}
        keywords="volunteer, community service, charity volunteering, NGO events, support initiatives"
      />
      <InitiativeHero icon={<FaHandsHelping />} title="Volunteer Your Time, Multiply Kindness" subtitle="Join feeding drives, plantation campaigns, food distribution events, and emergency support missions." primaryTo="/contact" primaryLabel="Talk to Coordinator" secondaryTo="/support-us" secondaryLabel="Support as Donor" />
      <Section title="Why Volunteer" subtitle="Direct action creates meaningful impact."><p className="max-w-3xl leading-7 text-slate-700 dark:text-slate-300">Volunteering builds empathy, purpose, and community connection. Even a few hours can help organize activities that bring relief and hope.</p></Section>
      <Section title="Volunteer Opportunities" subtitle="Choose where you want to contribute."><div className="grid gap-4 md:grid-cols-3">{["Animal feeding drives", "Plantation campaigns", "Food distribution events"].map((item) => <div key={item} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">{item}</div>)}</div></Section>
      <Section title="Join Form" subtitle="Share your details and interest area."><form className="grid gap-3 rounded-2xl border border-slate-200 p-5 md:grid-cols-2 dark:border-slate-800" onSubmit={(event) => { event.preventDefault(); setForm({ name: "", email: "", interest: "Feeding drives", message: "" }); showToast("Volunteer request received"); }}><input required value={form.name} onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))} placeholder="Name" className="rounded-lg border border-slate-300 px-3 py-2" /><input required type="email" value={form.email} onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))} placeholder="Email" className="rounded-lg border border-slate-300 px-3 py-2" /><select value={form.interest} onChange={(event) => setForm((state) => ({ ...state, interest: event.target.value }))} className="rounded-lg border border-slate-300 px-3 py-2"><option>Feeding drives</option><option>Plantation campaigns</option><option>Food distribution</option><option>Community support</option></select><input value={form.message} onChange={(event) => setForm((state) => ({ ...state, message: event.target.value }))} placeholder="Message" className="rounded-lg border border-slate-300 px-3 py-2" /><button type="submit" className="w-fit rounded-full bg-emerald-600 px-5 py-2 text-white">Submit Request</button></form></Section>
    </div>
  );
}
