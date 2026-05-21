import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiFacebook,
  FiHeart,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter,
} from "react-icons/fi";
import { FaLinkedin, FaYoutube } from "react-icons/fa6";
import { externalLinkProps, getMailTo, getTelLink, siteConfig } from "@/config/siteConfig";
import { useToast } from "@/context/ToastContext";
import { api } from "@/services/api";

const links = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Refund Policy", to: "/refund-policy" },
  { label: "Disclaimer", to: "/disclaimer" },
];

export function Footer() {
  const { showToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const socialLinks = [
    { label: "Instagram", href: siteConfig.instagram, icon: FiInstagram, hover: "hover:border-pink-400 hover:text-pink-500 dark:hover:text-pink-300" },
    { label: "Facebook", href: siteConfig.facebook, icon: FiFacebook, hover: "hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-300" },
    { label: "X", href: siteConfig.twitter, icon: FiTwitter, hover: "hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-300" },
    { label: "LinkedIn", href: siteConfig.linkedin, icon: FaLinkedin, hover: "hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-300" },
    { label: "YouTube", href: siteConfig.youtube, icon: FaYoutube, hover: "hover:border-red-500 hover:text-red-600 dark:hover:text-red-300" },
    { label: "Email", href: getMailTo(siteConfig.supportEmail || siteConfig.contactEmail), icon: FiMail, hover: "hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-300" },
  ].filter((item) => item.href);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = newsletterEmail.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!email) {
      setNewsletterError("Please enter your email address.");
      return;
    }

    if (!emailPattern.test(email)) {
      setNewsletterError("Please enter a valid email address.");
      return;
    }

    try {
      setNewsletterLoading(true);
      setNewsletterError("");
      await api.post("/newsletter/subscribe", { email });
      setNewsletterEmail("");
      showToast("Subscribed successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "We could not subscribe this email right now. Please try again.";
      setNewsletterError(message);
      showToast(message);
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-slate-200/60 bg-gradient-to-b from-white to-slate-100 py-16 dark:border-blue-900/30 dark:from-[#071120] dark:to-[#020817]">
      <div className="absolute left-1/2 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-400/10" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr_1fr] lg:px-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-emerald-500 shadow-xl shadow-cyan-500/25">
              <FiHeart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                {siteConfig.appName}
              </h2>
              <p className="text-xs font-medium text-slate-500 dark:text-cyan-200/70">
                {siteConfig.tagline}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {siteConfig.appName} is a community-focused initiative helping families, animals,
            and people through transparent support, donation drives, and local community actions.
          </p>

          <div className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {siteConfig.supportEmail && (
              <a href={getMailTo(siteConfig.supportEmail)} className="flex items-center gap-2 transition hover:text-cyan-600 dark:hover:text-cyan-300">
                <FiMail className="h-4 w-4" />
                {siteConfig.supportEmail}
              </a>
            )}
            {siteConfig.phone && (
              <a href={getTelLink(siteConfig.phone)} className="flex items-center gap-2 transition hover:text-cyan-600 dark:hover:text-cyan-300">
                <FiPhone className="h-4 w-4" />
                {siteConfig.phone}
              </a>
            )}
            {siteConfig.address && (
              <div className="flex items-start gap-2">
                <FiMapPin className="mt-0.5 h-4 w-4" />
                <span>{siteConfig.address}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Quick Links
          </h3>
          <div className="mt-5 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center justify-between text-sm font-medium text-slate-600 transition-all duration-300 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-300"
              >
                <span>{link.label}</span>
                <FiArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Connect With Us
          </h3>
          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Follow our journey and stay connected with community updates and support initiatives.
          </p>
          {socialLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    {...(item.href.startsWith("http") ? externalLinkProps : {})}
                    className={`group flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-slate-200 dark:shadow-black/20 ${item.hover}`}
                  >
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-2xl shadow-slate-200/40 backdrop-blur-xl dark:border-blue-900/30 dark:bg-blue-950/20 dark:shadow-black/20">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Newsletter</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Get updates about community help programs and support campaigns.
          </p>
          <form className="mt-5 space-y-4" onSubmit={handleNewsletterSubmit} noValidate>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(event) => {
                setNewsletterEmail(event.target.value);
                if (newsletterError) setNewsletterError("");
              }}
              placeholder="Enter your email"
              aria-invalid={Boolean(newsletterError)}
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-4 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 ${
                newsletterError
                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-400/20 dark:border-rose-500/50"
                  : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-400/20 dark:border-blue-900/40 dark:focus:border-cyan-400"
              }`}
            />
            {newsletterError && (
              <p className="text-sm font-medium text-rose-600 dark:text-rose-300">
                {newsletterError}
              </p>
            )}
            <button
              type="submit"
              disabled={newsletterLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {newsletterLoading ? "Subscribing..." : "Subscribe Now"}
            </button>
          </form>
        </div>
      </div>

      <div className="relative mx-auto mt-12 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-200/70 px-6 pt-6 text-sm text-slate-500 dark:border-blue-900/30 dark:text-slate-400 lg:flex-row lg:px-10">
        <p>© {new Date().getFullYear()} {siteConfig.appName}. All rights reserved.</p>
        <p className="text-center">Built for community support and transparent local help.</p>
      </div>
    </footer>
  );
}
