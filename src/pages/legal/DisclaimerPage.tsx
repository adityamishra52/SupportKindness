import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiAlertTriangle, FiExternalLink, FiInfo, FiShield, FiUsers } from "react-icons/fi";
import { PageMeta } from "@/components/ui/PageMeta";
import { siteConfig } from "@/config/siteConfig";

const getItems = (appName: string) => [
  { icon: FiInfo, title: "General Information", text: "The content shared on this website is intended to inform visitors about personal community support activities and updates." },
  { icon: FiAlertTriangle, title: "No Official NGO Status", text: `${appName} is a personal community support initiative, not a registered NGO. Activities are initiative-driven and volunteer-supported.` },
  { icon: FiUsers, title: "Voluntary Support", text: "All contributions are voluntary and intended to support community-driven activities. Supporting does not create a commercial service agreement." },
  { icon: FiShield, title: "Transparency and Accuracy", text: "We aim to keep information accurate and transparent. Activity reports reflect best available records and may be updated when needed." },
  { icon: FiExternalLink, title: "External Links", text: "External platforms linked from this website are governed by their own policies. We are not responsible for third-party content or service availability." },
];

export default function DisclaimerPage() {
  const items = getItems(siteConfig.appName);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-16 lg:px-8">
      <PageMeta title="Disclaimer" />

      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 md:p-10">
        <motion.div animate={{ x: [0, 20, 0], y: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -right-14 top-8 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-cyan-700 dark:text-cyan-200">Legal and Trust</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Disclaimer</h1>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            We believe trust begins with honest communication. This page explains how information and support on {siteConfig.appName} should be understood.
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Last updated: 2026-05-16</p>
        </div>
      </section>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
        All contributions are voluntary and intended to support community-driven activities.
      </div>

      <div className="space-y-5">
        {items.map((item, index) => (
          <motion.article key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <item.icon className="text-cyan-600 dark:text-cyan-200" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{item.title}</h2>
            </div>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{item.text}</p>
          </motion.article>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Together, small acts of kindness create meaningful impact.</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/contact" className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white">Contact Us</Link>
          <Link to="/support-us" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/20 dark:text-slate-100">Support Initiative</Link>
        </div>
      </section>
    </div>
  );
}
