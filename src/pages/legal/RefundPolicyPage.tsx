import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiClock, FiCreditCard, FiHelpCircle, FiRefreshCcw, FiShield } from "react-icons/fi";
import { PageMeta } from "@/components/ui/PageMeta";
import { siteConfig } from "@/config/siteConfig";

const getPolicyBlocks = (supportEmail: string) => [
  { icon: FiCreditCard, title: "Contribution Nature", text: "Support made through this platform is voluntary and intended for community-driven activities. This is not an eCommerce purchase model." },
  { icon: FiRefreshCcw, title: "Duplicate Payments", text: "If a duplicate transaction occurs due to technical error, the case can be reviewed after verification of transaction references." },
  { icon: FiHelpCircle, title: "Refund Requests", text: "Refund requests are generally not applicable. However, exceptional payment issues can be submitted for fair review with supporting details." },
  { icon: FiClock, title: "Processing Time", text: "Where a valid refund case is approved, processing timelines depend on payment channel and banking procedures." },
  {
    icon: FiShield,
    title: "Contact Support",
    text: supportEmail
      ? `For payment concerns, contact ${supportEmail} with transaction ID, date, and issue summary for responsible assistance.`
      : "For payment concerns, use the contact page with transaction ID, date, and issue summary for responsible assistance.",
  },
];

export default function RefundPolicyPage() {
  const policyBlocks = getPolicyBlocks(siteConfig.supportEmail || siteConfig.contactEmail);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-16 lg:px-8">
      <PageMeta title="Refund Policy" />

      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 md:p-10">
        <motion.div animate={{ x: [0, 20, 0], y: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -left-14 top-6 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-cyan-700 dark:text-cyan-200">Legal and Trust</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Refund Policy</h1>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            We aim to maintain fairness and transparency in all support-related matters. This policy explains how payment concerns are handled on a voluntary contribution platform.
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Last updated: 2026-05-16</p>
        </div>
      </section>

      <div className="space-y-5">
        {policyBlocks.map((block, index) => (
          <motion.article key={block.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <block.icon className="text-cyan-600 dark:text-cyan-200" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{block.title}</h2>
            </div>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{block.text}</p>
          </motion.article>
        ))}
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
        We aim to maintain fairness and transparency in all support-related matters.
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Together, small acts of kindness create meaningful impact.</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/contact" className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white">Contact Support</Link>
          <Link to="/support-us" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/20 dark:text-slate-100">Support Initiative</Link>
        </div>
      </section>
    </div>
  );
}
