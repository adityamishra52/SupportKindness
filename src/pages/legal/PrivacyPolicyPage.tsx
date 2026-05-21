import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiDatabase, FiLock, FiMail, FiShield, FiUserCheck } from "react-icons/fi";
import { PageMeta } from "@/components/ui/PageMeta";
import { siteConfig } from "@/config/siteConfig";

const getSections = (supportEmail: string) => [
  {
    icon: FiDatabase,
    title: "Information We Collect",
    content:
      "We collect details you voluntarily provide through forms, including name, email, phone number, and message content. We may also store support-related notes submitted by contributors. We do not collect unnecessary personal data.",
  },
  {
    icon: FiUserCheck,
    title: "How We Use Information",
    content:
      "Information is used only to respond to messages, coordinate volunteering, share activity updates, and maintain transparency records. We use submitted details to improve communication and better organize community support activities.",
  },
  {
    icon: FiShield,
    title: "Cookies and Analytics",
    content:
      "Basic browser storage and analytics tools may be used to improve website performance and user experience. This helps us understand which pages are useful and where we should improve clarity.",
  },
  {
    icon: FiLock,
    title: "Third-Party Services and Security",
    content:
      "Some services such as maps, hosting platforms, and payment interfaces may process limited technical information. We implement reasonable security practices and avoid sharing personal data for marketing or resale.",
  },
  {
    icon: FiMail,
    title: "User Rights and Contact",
    content: supportEmail
      ? `You may request correction or removal of your submitted contact information by writing to us. If you have concerns about privacy handling, contact ${supportEmail} and we will respond responsibly.`
      : "You may request correction or removal of your submitted contact information by writing to us through the contact page. We will respond responsibly.",
  },
];

export default function PrivacyPolicyPage() {
  const sections = getSections(siteConfig.supportEmail || siteConfig.contactEmail);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-16 lg:px-8">
      <PageMeta title="Privacy Policy" />

      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 md:p-10">
        <motion.div animate={{ x: [0, 20, 0], y: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -left-14 top-4 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-cyan-700 dark:text-cyan-200">Legal and Trust</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Privacy Policy</h1>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            We value respectful and secure communication. This policy explains how information is handled on {siteConfig.appName}, a personal community support initiative focused on transparency and trust.
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Last updated: 2026-05-16</p>
        </div>
      </section>

      <div className="space-y-5">
        {sections.map((section, index) => (
          <motion.article
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex items-center gap-3">
              <section.icon className="text-cyan-600 dark:text-cyan-200" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{section.title}</h2>
            </div>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{section.content}</p>
          </motion.article>
        ))}
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
        We respect your privacy and never sell personal information. This is a personal community support initiative, not a registered NGO.
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
