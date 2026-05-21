import { motion } from "framer-motion";
import { useMemo, useState, type FormEvent } from "react";
import { FiExternalLink, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Counter } from "@/components/ui/Counter";
import { PageMeta } from "@/components/ui/PageMeta";
import { Section } from "@/components/ui/Section";
import { SupportPrompt } from "@/components/ui/SupportPrompt";
import { externalLinkProps, getMailTo, getTelLink, siteConfig } from "@/config/siteConfig";
import { useToast } from "@/context/ToastContext";
import { api } from "@/services/api";

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");

  const contactCards = useMemo(
    () =>
      [
        {
          label: "WhatsApp",
          handle: siteConfig.whatsappNumber || siteConfig.whatsapp,
          description: "Quick coordination for urgent requests and volunteering updates.",
          href: siteConfig.whatsapp,
          icon: FaWhatsapp,
        },
        {
          label: "Instagram",
          handle: siteConfig.instagram,
          description: "Activity highlights, stories, and campaign updates.",
          href: siteConfig.instagram,
          icon: FaInstagram,
        },
        {
          label: "Facebook",
          handle: siteConfig.facebook,
          description: "Community posts, announcements, and volunteering calls.",
          href: siteConfig.facebook,
          icon: FaFacebook,
        },
        {
          label: "X",
          handle: siteConfig.twitter,
          description: "Short mission updates and transparency notes.",
          href: siteConfig.twitter,
          icon: FaXTwitter,
        },
        {
          label: "LinkedIn",
          handle: siteConfig.linkedin,
          description: "Partnership, collaboration, and professional updates.",
          href: siteConfig.linkedin,
          icon: FaLinkedin,
        },
        {
          label: "YouTube",
          handle: siteConfig.youtube,
          description: "Video updates from activities and community work.",
          href: siteConfig.youtube,
          icon: FaYoutube,
        },
        {
          label: "Email",
          handle: siteConfig.contactEmail || siteConfig.supportEmail,
          description: "Partnership and collaboration communication.",
          href: getMailTo(siteConfig.contactEmail || siteConfig.supportEmail),
          icon: FiMail,
        },
        {
          label: "Phone",
          handle: siteConfig.phone,
          description: "Direct contact for time-sensitive coordination.",
          href: getTelLink(siteConfig.phone),
          icon: FiPhone,
        },
      ].filter((card) => card.href && card.handle),
    []
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFormError("Please fill in your name, email, and message.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    try {
      setSending(true);
      setFormError("");
      await api.post("/contact", {
        ...form,
        receiverEmail: siteConfig.contactFormReceiverEmail || siteConfig.contactEmail,
      });
      setForm({ name: "", email: "", phone: "", message: "" });
      showToast("Message sent successfully");
    } catch {
      setFormError("Unable to send your message right now. Please try again.");
      showToast("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-16 px-6 py-12 lg:px-10">
      <PageMeta
        title="Contact"
        description={`Get in touch with ${siteConfig.appName} to support, volunteer, or collaborate on community initiatives.`}
        keywords="contact, charity support, volunteer, community help, collaboration"
      />

      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-[linear-gradient(120deg,#0b1220,#155e75,#0f172a)] px-8 py-14 text-white md:px-12">
        <motion.div animate={{ x: [0, 24, 0], y: [0, -12, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -left-12 top-8 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
        <motion.div animate={{ x: [0, -18, 0], y: [0, 14, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute right-0 top-10 h-60 w-60 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Contact {siteConfig.appName}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Let's Build Kindness Together</h1>
          <p className="mt-4 text-slate-100/90">Whether you want to support, volunteer, collaborate, or simply connect, every message matters.</p>
        </div>
      </section>

      {contactCards.length > 0 && (
        <Section title="Connect Quickly" subtitle="Choose your preferred way to connect.">
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {contactCards.map((card, index) => (
              <motion.a
                key={card.label}
                href={card.href}
                {...(card.href.startsWith("http") ? externalLinkProps : {})}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -6 }}
                className="glass-surface group flex h-full min-h-48 flex-col rounded-3xl p-5 shadow-xl shadow-slate-900/5 transition-all duration-500 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-200">
                    <card.icon className="h-5 w-5 transition group-hover:scale-110" />
                  </div>
                  <FiExternalLink className="shrink-0 text-cyan-600 dark:text-cyan-200" />
                </div>
                <p className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{card.label}</p>
                <p className="mt-2 break-words text-sm font-medium text-slate-700 dark:text-slate-200">{card.handle}</p>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.description}</p>
              </motion.a>
            ))}
          </div>
        </Section>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <form className="glass-surface space-y-4 rounded-3xl p-6" onSubmit={submit}>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Send a Message</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Share your query, support idea, or volunteering interest.</p>
          <label className="block text-sm text-slate-700 dark:text-slate-200">Name<input required value={form.name} onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))} placeholder="Your full name" className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-400" /></label>
          <label className="block text-sm text-slate-700 dark:text-slate-200">Email<input required type="email" value={form.email} onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))} placeholder="you@example.com" className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-400" /></label>
          <label className="block text-sm text-slate-700 dark:text-slate-200">Phone<input value={form.phone} onChange={(event) => setForm((state) => ({ ...state, phone: event.target.value }))} placeholder="Optional" className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-400" /></label>
          <label className="block text-sm text-slate-700 dark:text-slate-200">Message<textarea required value={form.message} onChange={(event) => setForm((state) => ({ ...state, message: event.target.value }))} rows={5} placeholder="Write your message" className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-400" /></label>
          {formError && <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">{formError}</p>}
          <button disabled={sending} className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:opacity-60">{sending ? "Sending..." : "Send Message"}</button>
        </form>

        <div className="space-y-6">
          <div className="glass-surface rounded-3xl p-5">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Our Community Reach</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{siteConfig.address || "Field activities and support efforts across local neighborhoods."}</p>
            {siteConfig.googleMap ? (
              <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/10">
                <iframe title="Google Maps" className="h-72 w-full border-0" loading="lazy" src={siteConfig.googleMap} />
                {siteConfig.address && <div className="absolute left-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1 text-xs text-slate-100"><FiMapPin /> <span className="truncate">{siteConfig.address}</span></div>}
              </div>
            ) : (
              <div className="mt-4 flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                Map location will appear here when configured.
              </div>
            )}
          </div>

          <div className="glass-surface rounded-3xl p-5">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Trust and Impact</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Transparent progress from community missions.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Counter label="Meals" value={500} />
              <Counter label="Animals Helped" value={200} />
              <Counter label="Trees" value={100} />
            </div>
          </div>
        </div>
      </div>

      <SupportPrompt message="Your small support can create real-world impact for families, animals, and communities." />

      <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-100">This is a personal community support initiative, not a registered NGO.</p>
    </div>
  );
}
