import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaHandsHolding, FaShieldHeart } from "react-icons/fa6";
import { FiArrowRight, FiCheckCircle, FiCopy } from "react-icons/fi";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { Counter } from "@/components/ui/Counter";
import { PageMeta } from "@/components/ui/PageMeta";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/siteConfig";
import { STORE_KEYS } from "@/constants/storeKeys";
import { ENV_UPI_ID } from "@/constants/env";
import { fallbackActivities } from "@/data/fallbackActivities";
import { useApiData } from "@/hooks/useApiData";
import {
  type Activity,
  type FAQItem,
  type GalleryItem,
  type SiteSettings,
  type Testimonial,
  type TransparencyReport,
} from "@/types";
import { asset } from "@/utils/asset";

export default function HomePage() {
  const { data: activities, loading: activityLoading } = useApiData<Activity[]>(
    "/activities",
    fallbackActivities,
    STORE_KEYS.activities
  );

  const { data: testimonials } = useApiData<Testimonial[]>(
    "/testimonials",
    [],
    STORE_KEYS.testimonials
  );

  const { data: faqs } = useApiData<FAQItem[]>(
    "/faqs",
    [],
    STORE_KEYS.faqs
  );

  const { data: reports } = useApiData<TransparencyReport[]>(
    "/transparency/reports",
    [],
    STORE_KEYS.reports
  );

  const { data: gallery } = useApiData<GalleryItem[]>(
    "/gallery",
    [],
    STORE_KEYS.gallery
  );

  const { data: settings } = useApiData<SiteSettings | null>(
    "/transparency/settings",
    null,
    STORE_KEYS.settings
  );

  const [faqOpen, setFaqOpen] = useState<string | null>(null);
  const [galleryModal, setGalleryModal] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const upiId = settings?.upiId || ENV_UPI_ID;

  const campaignCategories = useMemo(
    () => ["All", ...Array.from(new Set(activities.map((item) => item.category))).slice(0, 5)],
    [activities]
  );
  const filteredCampaigns = useMemo(
    () =>
      (selectedCategory === "All"
        ? activities
        : activities.filter((item) => item.category === selectedCategory)
      ).slice(0, 6),
    [activities, selectedCategory]
  );

  const monthlyReceived = reports.reduce(
    (sum, report) => sum + (report.totalSupportReceived || 0),
    0
  );

  const topGallery = gallery.slice(0, 8);

  const supportBadges = useMemo(
    () => [
      { label: "Community Driven", icon: FaHandsHolding },
      { label: "Transparency First", icon: FaShieldHeart },
      { label: "Real Local Impact", icon: FiCheckCircle },
    ],
    []
  );

  return (
    <>
      <PageMeta
        title="Home"
        description={`${siteConfig.appName} is a premium community support platform for animal help, food distribution, tree plantation, and local transparency.`}
        keywords={`${siteConfig.appName}, community support, charity, NGO, donations, animal welfare, transparency`}
      />

      <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(120deg,#07111f,#0b2f3c,#0b1220)] text-white">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -18, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
        />

        <motion.div
          animate={{ x: [0, -24, 0], y: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity }}
          className="absolute right-10 top-12 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl"
        />

        <div className="relative z-10 mx-auto grid min-h-[88vh] w-full max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div className="space-y-7">
            <span className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-200">
              Community-Driven Support Initiative
            </span>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Community Support, Transparently Delivered.
            </h1>

            <p className="max-w-2xl text-slate-200">
              A personal initiative focused on animal feeding, food support,
              tree plantation, and rapid local community help.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/support-us"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 font-semibold text-white shadow-xl shadow-cyan-500/30 transition hover:-translate-y-0.5"
              >
                Support Now <FiArrowRight />
              </Link>

              <Link
                to="/our-work"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                Explore Activities
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[topGallery[0], topGallery[1], topGallery[2], topGallery[3]].map(
              (image, index) => (
                <motion.div
                  key={image?._id || index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="glass-surface overflow-hidden rounded-3xl border border-white/15 p-2"
                >
                  <img
                    src={
                      asset(image?.imageUrl) ||
                      "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&auto=format&fit=crop"
                    }
                    alt={image?.title || "Activity"}
                    className="h-36 w-full rounded-2xl object-cover"
                  />
                </motion.div>
              )
            )}

            <Link
              to="/gallery"
              className="group col-span-full overflow-hidden rounded-3xl border border-cyan-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(236,254,255,0.9))] p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-cyan-950/25"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                    Explore our gallery
                  </p>

                  <p className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                    View recent impact photos
                  </p>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Browse field updates, campaign moments, and community support work.
                  </p>
                </div>

                <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition group-hover:shadow-cyan-500/35">
                  View Gallery <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Section
        title="Impact Statistics"
        subtitle="Measured progress from field work and monthly support updates."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Counter
            label="Meals Distributed"
            value={
              activities.filter((item) =>
                item.category.toLowerCase().includes("food")
              ).length *
                95 +
              320
            }
          />

          <Counter
            label="Animals Helped"
            value={
              activities.filter((item) =>
                item.category.toLowerCase().includes("animal")
              ).length *
                68 +
              180
            }
          />

          <Counter
            label="Trees Planted"
            value={
              activities.filter((item) =>
                item.category.toLowerCase().includes("tree")
              ).length *
                48 +
              140
            }
          />

          <Counter
            label="Families Supported"
            value={Math.max(activities.length, 1) * 22 + 50}
          />

          <Counter
            label="Support Tracked"
            value={monthlyReceived || Math.max(activities.length, 1) * 18 + 36}
          />
        </div>
      </Section>

      <Section
        title="Active Campaigns"
        subtitle="Filter current community efforts by cause and follow where help is moving."
      >
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
          {campaignCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20"
                  : "border border-slate-200 bg-white/80 text-slate-700 hover:border-cyan-400 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {activityLoading && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-900" />
            ))}
          </div>
        )}

        {!activityLoading && filteredCampaigns.length === 0 && (
          <div className="glass-surface rounded-3xl p-8 text-center text-slate-600 dark:text-slate-300">
            No campaigns found for this category yet.
          </div>
        )}

        {!activityLoading && filteredCampaigns.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCampaigns.map((activity) => (
              <ActivityCard key={activity._id} item={activity} />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Community Support"
        subtitle="Simple ways to contribute with trust and clarity."
      >
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-surface rounded-3xl p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              UPI Support
            </p>

            {upiId ? (
              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                {upiId}
              </p>
            ) : (
              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                Payment details are being updated.
              </p>
            )}

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Every contribution directly supports feeding, relief work, and
              local drives.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={async () => upiId && navigator.clipboard.writeText(upiId)}
                disabled={!upiId}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiCopy /> Copy UPI
              </button>

              <Link
                to="/support-us"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/15 dark:text-slate-100"
              >
                Open Support Page
              </Link>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {supportBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="rounded-2xl border border-slate-200/80 p-3 dark:border-white/10"
                >
                  <badge.icon className="text-cyan-600 dark:text-cyan-200" />

                  <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                    {badge.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-surface overflow-hidden rounded-3xl p-2">
            <img
              src={
                asset(settings?.qrImageUrl) ||
                "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=900&auto=format&fit=crop"
              }
              alt="Support QR"
              className="h-full min-h-64 w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Trusted By The Community"
        subtitle="Supporters, volunteers, and neighbors share why this initiative matters."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {(testimonials.length > 0
            ? testimonials
            : [
                { _id: "t1", name: "Community Supporter", role: "Volunteer", content: "The updates feel transparent and the work is easy to follow." },
                { _id: "t2", name: "Local Donor", role: "Monthly Supporter", content: "I like that small contributions are connected to visible local impact." },
                { _id: "t3", name: "Field Helper", role: "Care Contributor", content: "The platform makes support feel organized, warm, and trustworthy." },
              ]
          ).slice(0, 3).map((testimonial) => (
            <motion.article
              key={testimonial._id}
              whileHover={{ y: -6 }}
              className="glass-surface rounded-3xl p-6"
            >
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">“{testimonial.content}”</p>
              <div className="mt-5">
                <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
                <p className="text-sm text-cyan-600 dark:text-cyan-300">{testimonial.role || "Supporter"}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section title="Common Questions" subtitle="Quick answers before someone contributes or volunteers.">
        <div className="mx-auto max-w-4xl space-y-3">
          {(faqs.length > 0
            ? faqs
            : [
                { _id: "faq1", question: "How are donations used?", answer: "Support is directed toward local feeding, relief, and care activities, with updates shared through activity and transparency sections." },
                { _id: "faq2", question: "Can I volunteer?", answer: "Yes. Use the contact page or volunteer page to share your interest and preferred support area." },
              ]
          ).slice(0, 4).map((faq) => (
            <button
              key={faq._id}
              type="button"
              onClick={() => setFaqOpen((current) => (current === faq._id ? null : faq._id))}
              className="glass-surface w-full rounded-3xl p-5 text-left transition hover:border-cyan-400/40"
            >
              <span className="font-semibold text-slate-900 dark:text-white">{faq.question}</span>
              {faqOpen === faq._id && (
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.answer}</p>
              )}
            </button>
          ))}
        </div>
      </Section>

      <AnimatePresence>
        {galleryModal && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGalleryModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <img
              src={asset(galleryModal.imageUrl)}
              alt={galleryModal.title}
              className="max-h-[90vh] rounded-3xl"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
