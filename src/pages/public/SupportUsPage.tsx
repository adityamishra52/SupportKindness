import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  FiArrowRight,
  FiCopy,
  FiHeart,
  FiMessageCircle,
  FiShield,
  FiStar,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { PageMeta } from "@/components/ui/PageMeta";
import { siteConfig } from "@/config/siteConfig";
import { ENV_UPI_ID } from "@/constants/env";
import { STORE_KEYS } from "@/constants/storeKeys";
import { useApiData } from "@/hooks/useApiData";
import { type SiteSettings } from "@/types";
import { asset } from "@/utils/asset";
import { useToast } from "@/context/ToastContext";
import { api } from "@/services/api";
import { useLeaderboard } from "@/context/LeaderboardContext";

const quotes = [
  "Together, kindness becomes powerful.",
  "Every small contribution creates hope.",
  "Community grows when people care.",
  "Support is not about money, it is about humanity.",
];

const impactCards = [
  {
    title: "Community Activities",
    description:
      "Local care actions that connect people and keep support visible.",
    icon: FiUsers,
    accent: "from-cyan-500 to-emerald-500",
  },
  {
    title: "Awareness Efforts",
    description: "Sharing stories and actions that inspire more kindness.",
    icon: FiMessageCircle,
    accent: "from-emerald-400 to-cyan-500",
  },
  {
    title: "Helping People",
    description:
      "Small acts that create real comfort and relief for those in need.",
    icon: FiHeart,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "Platform Maintenance",
    description:
      "Keeping the experience polished, stable, and easy to use.",
    icon: FiShield,
    accent: "from-cyan-500 to-slate-500",
  },
];

const suggestedAmounts = [100, 500, 1000];

const glassCard =
  "border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/30 dark:backdrop-blur-xl";

const glassCardStrong =
  "border border-slate-200 bg-white shadow-2xl shadow-slate-300/30 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/85 dark:shadow-black/40 dark:backdrop-blur-xl";

const headingText = "text-slate-900 dark:text-white";
const mutedText = "text-slate-600 dark:text-slate-400";
export default function SupportUsPage() {
  const { showToast } = useToast();

  const { data: settings } = useApiData<SiteSettings | null>(
    "/transparency/settings",
    null,
    STORE_KEYS.settings
  );

  const [openQr, setOpenQr] = useState(false);
  const [selectedQr, setSelectedQr] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [formState, setFormState] = useState({
    contributorName: "",
    supportMessage: "",
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const upiId = settings?.upiId || ENV_UPI_ID;
  const defaultQr = "/qrCode/qrcodePaytm.jpeg";
  const qr = settings?.qrImageUrl
    ? asset(settings.qrImageUrl)
    : defaultQr;

  const { topEntries: topLeaderboard, loading: loadingSupporters } = useLeaderboard();

  useEffect(() => {
    document.body.style.overflow = openQr ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openQr]);

  useEffect(() => {
    const quoteInterval = window.setInterval(() => {
      setCurrentQuoteIndex(
        (index) => (index + 1) % quotes.length
      );
    }, 5500);

    return () => {
      window.clearInterval(quoteInterval);
    };
  }, []);

  const showQr = (image: string) => {
    setSelectedQr(image);
    setOpenQr(true);
  };

  const handlePay = () => {
    const paymentUri = `upi://pay?pa=${encodeURIComponent(
      upiId
    )}&pn=Care%20Contribution&am=${selectedAmount}&cu=INR`;

    const isMobile =
      /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      window.location.href = paymentUri;
      return;
    }

    window.open(paymentUri, "_blank", "noopener,noreferrer");

    showToast(
      "Desktop detected — scan QR or copy UPI ID if app does not open."
    );
  };

  const handleCustomAmountChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value.replace(/\D/g, "");

    setCustomAmount(rawValue);

    const entered = Number(rawValue);

    setSelectedAmount(entered > 0 ? entered : 0);
  };

  const currentQuote = quotes[currentQuoteIndex];

  const handleSupportFormSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!formState.supportMessage.trim()) {
      setFormError(
        "Please share a short support message."
      );
      return;
    }

    try {
      await api.post("/support", {
        ...formState,
        amount: selectedAmount,
      });

      setFormState({
        contributorName: "",
        supportMessage: "",
      });

      setFormError(null);
      setFormSuccess(true);

      showToast("Support message sent successfully.");

      window.setTimeout(() => {
        setFormSuccess(false);
      }, 2500);
    } catch {
      setFormError(
        "Unable to send your message right now."
      );

      showToast("Failed to send support message.");
    }
  };

  return (
    <div className="overflow-x-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <PageMeta
        title="Support Community Efforts"
        description="Support community initiatives with UPI and QR support."
        keywords="community support, donation, UPI"
      />

      {/* HERO */}

      <section className="relative overflow-hidden px-6 py-20 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.08),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.06),_transparent_26%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_26%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm uppercase tracking-[0.35em] text-emerald-600 dark:border-white/10 dark:bg-white/10 dark:text-emerald-300">
              <FiStar className="h-4 w-4" />
              Community support initiative
            </span>

            <div className="space-y-5">
              <h1 className={`text-5xl font-black leading-tight ${headingText}`}>
                Support Community Efforts
              </h1>

              <p className={`text-xl leading-8 ${mutedText}`}>
                Small acts of kindness create meaningful
                impact.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => showQr(qr)}
                className="rounded-full bg-gradient-to-r from-cyan-400 via-emerald-500 to-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                View QR Support
              </button>

              <a
                href="#support-flow"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                Explore Support Flow
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={`w-full rounded-[2.5rem] p-8 ${glassCardStrong}`}
          >
            <h2 className={`text-3xl font-bold ${headingText}`}>
              Those who support help keep the community moving.
            </h2>

            <p className={`mt-4 ${mutedText}`}>
              A focused, elegant support experience that
              feels personal and trustworthy.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className={`rounded-[1.75rem] p-5 ${glassCard}`}>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-500 dark:text-cyan-300">
                  Transparent process
                </p>

                <p className={`mt-3 text-sm ${mutedText}`}>
                  Support remains clear, honest, and
                  community-first.
                </p>
              </div>

              <div className={`rounded-[1.75rem] p-5 ${glassCard}`}>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
                  Secure support
                </p>

                <p className={`mt-3 text-sm ${mutedText}`}>
                  Clean UPI flow with modern premium UI.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUOTE */}

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className={`rounded-[2rem] p-8 ${glassCardStrong}`}>
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-500 dark:text-emerald-300">
              Voice of the community
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 rounded-[2rem] bg-slate-100 px-8 py-10 dark:bg-slate-900"
              >
                <p className={`text-3xl font-bold ${headingText}`}>
                  “{currentQuote}”
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* IMPACT */}

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-4">
          {impactCards.map((card) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.title}
                whileHover={{ y: -6 }}
                className={`rounded-[2rem] p-6 transition ${glassCardStrong}`}
              >
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${card.accent} text-white`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className={`mt-6 text-xl font-semibold ${headingText}`}>
                  {card.title}
                </h3>

                <p className={`mt-3 text-sm leading-7 ${mutedText}`}>
                  {card.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* LEADERBOARD */}

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-500 dark:text-emerald-300">
              Top Community Supporters
            </p>

            <h2 className={`mt-3 text-4xl font-bold ${headingText}`}>
              Leaderboard of kindness
            </h2>
          </div>
        </div>

        <div className={`overflow-hidden rounded-[2rem] ${glassCardStrong}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-slate-100 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-4 text-left text-sm uppercase tracking-[0.3em] text-slate-500">
                    Rank
                  </th>

                  <th className="px-4 py-4 text-left text-sm uppercase tracking-[0.3em] text-slate-500">
                    Supporter
                  </th>

                  <th className="px-4 py-4 text-left text-sm uppercase tracking-[0.3em] text-slate-500">
                    Amount
                  </th>

                  <th className="px-4 py-4 text-left text-sm uppercase tracking-[0.3em] text-slate-500">
                    Message
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white dark:divide-white/10 dark:bg-slate-950">
                {loadingSupporters &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={`supporter-skeleton-${index}`}>
                      <td className="px-4 py-5" colSpan={4}>
                        <div className="h-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                      </td>
                    </tr>
                  ))}
                {!loadingSupporters && topLeaderboard.length === 0 && (
                  <tr>
                    <td className={`px-4 py-8 text-center ${mutedText}`} colSpan={4}>
                      No supporter activity yet. Be the first to send a note of kindness.
                    </td>
                  </tr>
                )}
                {topLeaderboard.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className="transition hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <td className={`px-4 py-5 font-semibold ${headingText}`}>
                      #{index + 1}
                    </td>

                    <td className={`px-4 py-5 ${headingText}`}>
                      {entry.anonymous
                        ? "Anonymous Supporter"
                        : entry.name || "Supporter"}
                    </td>

                    <td className="px-4 py-5 font-semibold text-emerald-500 dark:text-emerald-300">
                      ₹{entry.amount}
                    </td>

                    <td className={`px-4 py-5 text-sm ${mutedText}`}>
                      {entry.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>


      <section
        id="support-flow"
        className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10"
      >
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">
            Support Our Cause
          </p>
          <h2 className={`mt-3 text-4xl font-black ${headingText}`}>
            Simple, trusted giving
          </h2>
          <p className={`mx-auto mt-3 max-w-2xl ${mutedText}`}>
            Scan, choose an amount, or send a note. Every action stays clean,
            clear, and easy to complete.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-black/30"
          >
            <div className="grid gap-6 md:grid-cols-[1fr_0.85fr] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">
                  Scan & Pay via UPI
                </p>
                <h3 className={`mt-2 text-2xl font-bold ${headingText}`}>
                  Support in seconds
                </h3>
                <p className={`mt-2 text-sm ${mutedText}`}>
                  Scan the QR code using any UPI app or copy the ID below.
                </p>

                <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/70">
                  <img
                    src={qr}
                    alt={`${siteConfig.appName} QR code`}
                    className="mx-auto max-h-72 rounded-2xl bg-white object-contain p-3"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => showQr(qr)}
                  className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5"
                >
                  Enlarge QR Code
                </button>
              </div>

              <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/80 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300">
                  UPI ID
                </p>
                <p className={`mt-3 break-all text-lg font-bold ${headingText}`}>
                  {upiId}
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(upiId);
                    showToast("UPI ID copied to clipboard.");
                  }}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/10 dark:text-emerald-200 dark:hover:bg-white/15"
                >
                  <FiCopy className="h-4 w-4" />
                  Copy ID
                </button>
                <p className={`mt-4 text-xs leading-6 ${mutedText}`}>
                  If the payment app does not open automatically, copy this UPI
                  ID and pay manually.
                </p>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-black/30"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">
              Choose an amount
            </p>
            <h3 className={`mt-2 text-2xl font-bold ${headingText}`}>
              Select support level
            </h3>
            <p className={`mt-2 text-sm ${mutedText}`}>
              Pick a suggested amount or enter a custom value.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {suggestedAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    selectedAmount === amount && customAmount === ""
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-emerald-400"
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            <label className="mt-6 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Custom Amount
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Enter amount in rupees"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
              />
            </label>

            <button
              type="button"
              onClick={handlePay}
              disabled={selectedAmount < 1}
              className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                selectedAmount < 1
                  ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5"
              }`}
            >
              <FiArrowRight className="h-4 w-4" />
              Pay Now ₹{selectedAmount}
            </button>

            <p className={`mt-4 text-center text-xs ${mutedText}`}>
              Secure UPI flow. 100% simple and trusted.
            </p>
          </motion.article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-black/30 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 sm:p-8">
            <h2 className={`text-3xl font-bold ${headingText}`}>
              Premium Support Message
            </h2>
            <p className={`mt-2 ${mutedText}`}>
              Share your message with us. Your words inspire us to do more.
            </p>

            <form onSubmit={handleSupportFormSubmit} className="mt-7 space-y-4">
              <textarea
                rows={5}
                value={formState.supportMessage}
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    supportMessage: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
                placeholder="Your message..."
              />

              <input
                value={formState.contributorName}
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    contributorName: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
                placeholder="Your name (optional)"
              />

              {formError && <p className="text-sm text-rose-500">{formError}</p>}
              {formSuccess && (
                <p className="text-sm text-emerald-500">Message sent successfully.</p>
              )}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-xl shadow-emerald-500/20 transition hover:-translate-y-0.5"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="flex flex-col items-center justify-center border-t border-slate-200 bg-gradient-to-br from-emerald-50 to-cyan-50 p-8 text-center dark:border-white/10 dark:from-emerald-500/10 dark:to-cyan-500/10 lg:border-l lg:border-t-0">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-xl shadow-emerald-200/70 dark:bg-slate-900 dark:shadow-black/30">
              <FiHeart className="h-16 w-16 text-emerald-500" />
              <span className="absolute right-5 top-6 h-4 w-4 rounded-full bg-cyan-300" />
              <span className="absolute bottom-7 left-6 h-3 w-3 rounded-full bg-emerald-300" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-emerald-600 dark:text-emerald-300">
              Thank you!
            </h3>
            <p className={`mt-2 max-w-xs text-sm ${mutedText}`}>
              Your support means the world to us.
            </p>
          </div>
        </div>
      </section>

      {/* QR MODAL */}

      <AnimatePresence>
        {openQr && selectedQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setOpenQr(false)}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.96,
              }}
              className={`relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] ${glassCardStrong}`}
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-white/10">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-500 dark:text-cyan-300">
                    Scan to support
                  </p>

                  <p className={`mt-2 text-sm ${mutedText}`}>
                    Open your UPI app and scan.
                  </p>
                </div>

                <button
                  onClick={() => setOpenQr(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8">
                <div className="overflow-hidden rounded-[2rem] bg-slate-100 p-6 dark:bg-slate-900">
                  <img
                    src={selectedQr}
                    alt="Support QR"
                    className="w-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
