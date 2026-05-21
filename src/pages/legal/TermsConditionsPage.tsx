import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiFileText, FiGlobe, FiShield, FiUser } from "react-icons/fi";
import { PageMeta } from "@/components/ui/PageMeta";
import { siteConfig } from "@/config/siteConfig";

const getTerms = (appName: string) => [
  { icon: FiUser, title: "1. Website Usage", body: "By using this website, you agree to use it lawfully and respectfully. Any misuse, harmful behavior, or attempts to disrupt services are not permitted." },
  { icon: FiFileText, title: "2. User Responsibilities", body: "Users are responsible for the accuracy of information they submit through contact and support forms. False or misleading submissions may be removed." },
  { icon: FiShield, title: "3. Voluntary Support and Donations", body: "All support is voluntary and intended for community-driven activities. Contributions do not create any contractual service obligations or guaranteed outcomes." },
  { icon: FiGlobe, title: "4. External Links", body: "The website may include third-party links for communication or social media. We are not responsible for external platform policies, content, or operational changes." },
  { icon: FiAlertCircle, title: "5. Limitation of Liability", body: `${appName} is an initiative-based platform. While we strive for accuracy and continuity, we are not liable for indirect losses arising from site use or external service issues.` },
];

export default function TermsConditionsPage() {
  const terms = getTerms(siteConfig.appName);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-16 lg:px-8">
      <PageMeta title="Terms & Conditions" />

      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 md:p-10">
        <motion.div animate={{ x: [0, 20, 0], y: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -right-14 top-6 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-cyan-700 dark:text-cyan-200">Legal and Trust</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Terms & Conditions</h1>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            These terms explain how this initiative website should be used. They are designed to keep interactions transparent, respectful, and aligned with community-focused values.
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Last updated: 2026-05-16</p>
        </div>
      </section>

      <div className="space-y-5">
        {terms.map((term, index) => (
          <motion.article key={term.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <term.icon className="text-cyan-600 dark:text-cyan-200" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{term.title}</h2>
            </div>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{term.body}</p>
          </motion.article>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
        {siteConfig.appName} is a personal initiative-based platform. It is not a registered NGO, and all support is voluntary.
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
