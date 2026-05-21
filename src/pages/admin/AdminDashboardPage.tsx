import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { type ComponentType, type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiDollarSign,
  FiEdit3,
  FiFileText,
  FiHelpCircle,
  FiImage,
  FiInbox,
  FiMessageSquare,
  FiPlusCircle,
  FiSave,
  FiStar,
  FiSettings,
  FiTrash2,
  FiTrendingUp,
  FiUploadCloud,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { PageMeta } from "@/components/ui/PageMeta";
import { STORE_KEYS } from "@/constants/storeKeys";
import { useToast } from "@/context/ToastContext";
import { useApiData } from "@/hooks/useApiData";
import { api } from "@/services/api";
import type { Activity, ApiResource, ContactMessage, FAQItem, GalleryItem, SiteSettings, SupportMessage, Testimonial, TransparencyReport } from "@/types";
import { asset } from "@/utils/asset";
import { cn } from "@/utils/cn";
import { writeLocal } from "@/utils/storage";

type AdminTool = {
  id: "overview" | "support" | "campaigns" | "impact" | "gallery" | "faqs" | "testimonials" | "reports" | "inbox" | "settings";
  title: string;
  description: string;
  badge: string;
  action: string;
  icon: ComponentType<{ className?: string }>;
};

function Surface({ title, eyebrow, action, children, className = "" }: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-[#10151d]", className)}>
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{eyebrow}</p>}
          <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function StatCard({ label, value, trend, icon: Icon }: {
  label: string;
  value: string | number;
  trend: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#10151d]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 whitespace-nowrap text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
        <FiTrendingUp className="h-3.5 w-3.5" />
        {trend}
      </p>
    </motion.article>
  );
}

function ToolCard({ tool, selected, onSelect }: {
  tool: AdminTool;
  selected: boolean;
  onSelect: (id: AdminTool["id"]) => void;
}) {
  const Icon = tool.icon;
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(tool.id)}
      className={cn(
        "group flex min-h-40 flex-col justify-between rounded-2xl border p-5 text-left shadow-sm transition",
        selected
          ? "border-cyan-200 bg-[linear-gradient(135deg,#ffffff,#ecfeff)] text-slate-950 shadow-md ring-1 ring-cyan-100 dark:border-cyan-400/30 dark:bg-[linear-gradient(135deg,#10202a,#0d1117)] dark:text-white dark:ring-cyan-400/10"
          : "border-slate-200/80 bg-[linear-gradient(135deg,#ffffff,#f8fafc)] text-slate-950 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-[linear-gradient(135deg,#10151d,#0d1117)] dark:text-white dark:hover:border-white/20"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={cn(
          "flex h-11 w-11 items-center justify-center rounded-2xl transition",
          selected ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200" : "bg-white text-slate-700 shadow-sm dark:bg-white/[0.06] dark:text-slate-200"
        )}>
          <Icon className="h-5 w-5" />
        </span>
        <span className={cn(
          "rounded-full px-2 py-0.5 text-[11px] font-bold",
          selected ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-200" : "bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300"
        )}>
          {tool.badge}
        </span>
      </div>
      <div>
        <h3 className="text-base font-bold">{tool.title}</h3>
        <p className={cn("mt-2 line-clamp-2 text-sm leading-6", selected ? "text-slate-600 dark:text-slate-300" : "text-slate-500 dark:text-slate-400")}>
          {tool.description}
        </p>
        <span className={cn("mt-4 inline-flex items-center gap-1 text-sm font-semibold", selected ? "text-cyan-700 dark:text-cyan-200" : "text-slate-950 dark:text-white")}>
          {tool.action}
          <FiArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.button>
  );
}

function ActivityItem({ title, detail, meta, date, icon: Icon, status }: {
  title: string;
  detail: string;
  meta: string;
  date: string;
  status: "success" | "info";
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <article className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl px-3 py-3 transition hover:bg-slate-50 dark:hover:bg-white/[0.04]">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">
        <Icon className="h-4 w-4" />
        <span className={cn(
          "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-[#10151d]",
          status === "success" ? "bg-emerald-500" : "bg-sky-500"
        )} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{title}</p>
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">{detail}</p>
      </div>
      <div className="text-right">
        <p className="whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-200">{meta}</p>
        <p className="mt-1 whitespace-nowrap text-xs text-slate-500 dark:text-slate-500">{date}</p>
      </div>
    </article>
  );
}

function SummaryWidget({ label, value, helper, icon: Icon }: {
  label: string;
  value: string;
  helper: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p>
          <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm dark:bg-[#0d1117] dark:text-slate-200">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{helper}</p>
    </div>
  );
}

const GALLERY_IMAGE_FALLBACK = "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=900&auto=format&fit=crop";
const GALLERY_CATEGORIES = ["general", "animal", "tree", "food", "community"];
const GALLERY_FIT_OPTIONS = [
  { value: "contain", label: "Show full image" },
  { value: "cover", label: "Crop thumbnail" },
] as const;

function isGalleryItem(value: unknown): value is GalleryItem {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as GalleryItem)._id === "string" &&
    typeof (value as GalleryItem).imageUrl === "string"
  );
}

function getRequestMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function sameImpactStats(
  expected: Array<{ label: string; value: number }>,
  actual?: Array<{ label: string; value: number }>
) {
  if (!Array.isArray(actual) || expected.length !== actual.length) return false;

  return expected.every((item, index) => {
    const actualItem = actual[index];
    return (
      actualItem?.label === item.label &&
      Number(actualItem?.value || 0) === Number(item.value || 0)
    );
  });
}

const CAMPAIGN_CATEGORIES = ["Animal Help", "Food Distribution", "Tree Plantation", "Community Support"];

function isActivityItem(value: unknown): value is Activity {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as Activity)._id === "string" &&
    typeof (value as Activity).title === "string"
  );
}

function FAQAdmin({ faqs, showToast }: { faqs: ApiResource<FAQItem[]>; showToast: (message: string) => void }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    const response = await api.get<FAQItem[]>("/faqs");
    const fresh = Array.isArray(response.data) ? response.data : [];
    faqs.setData(fresh);
    writeLocal(STORE_KEYS.faqs, fresh);
    return fresh;
  };

  const reset = () => {
    setQuestion("");
    setAnswer("");
    setCategory("");
    setEditingId(null);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim() || !answer.trim()) {
      showToast("Please enter both question and answer.");
      return;
    }

    try {
      setSaving(true);
      const payload = { question: question.trim(), answer: answer.trim(), category: category.trim() };
      if (editingId) {
        await api.put(`/faqs/${editingId}`, payload);
        showToast("FAQ updated.");
      } else {
        await api.post("/faqs", payload);
        showToast("FAQ added.");
      }
      await refresh();
      reset();
    } catch (error: any) {
      showToast(getRequestMessage(error, "Unable to save FAQ. Please check admin credentials."));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: FAQItem) => {
    setEditingId(item._id);
    setQuestion(item.question || "");
    setAnswer(item.answer || "");
    setCategory(item.category || "");
  };

  const remove = async (item: FAQItem) => {
    try {
      await api.delete(`/faqs/${item._id}`);
      await refresh();
      if (editingId === item._id) reset();
      showToast("FAQ deleted.");
    } catch (error: any) {
      showToast(getRequestMessage(error, "Unable to delete FAQ. Please check admin credentials."));
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={save} className="space-y-4 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
        <label className="block"><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Question</span><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="How are donations used?" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" /></label>
        <label className="block"><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Answer</span><textarea rows={6} value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Write the answer shown on the FAQ page..." className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" /></label>
        <label className="block"><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</span><input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="General, donations, volunteer..." className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" /></label>
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-60 dark:bg-white dark:text-slate-950"><FiSave className="h-4 w-4" />{saving ? "Saving..." : editingId ? "Update FAQ" : "Add FAQ"}</button>
          {editingId && <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-white/[0.06] dark:text-slate-200"><FiX className="h-4 w-4" />Cancel</button>}
        </div>
      </form>
      <div className="grid max-h-[42rem] content-start gap-3 overflow-y-auto pr-2">
        {faqs.loading && faqs.data.length === 0 && <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/[0.06]" />}
        {!faqs.loading && faqs.data.length === 0 && <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-white/[0.03]">No FAQs yet.</div>}
        {faqs.data.map((item) => (
          <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
            <p className="font-bold text-slate-950 dark:text-white">{item.question}</p>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.answer}</p>
            {item.category && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">{item.category}</p>}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => startEdit(item)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-white/[0.06] dark:text-slate-200"><FiEdit3 className="h-4 w-4" />Edit</button>
              <button type="button" onClick={() => remove(item)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 dark:bg-rose-400/10 dark:text-rose-300"><FiTrash2 className="h-4 w-4" />Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TestimonialAdmin({ testimonials, showToast }: { testimonials: ApiResource<Testimonial[]>; showToast: (message: string) => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    const response = await api.get<Testimonial[]>("/testimonials");
    const fresh = Array.isArray(response.data) ? response.data : [];
    testimonials.setData(fresh);
    writeLocal(STORE_KEYS.testimonials, fresh);
    return fresh;
  };

  const reset = () => {
    setName("");
    setRole("");
    setContent("");
    setAvatar(null);
    setEditingId(null);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !content.trim()) {
      showToast("Please enter testimonial name and content.");
      return;
    }
    try {
      setSaving(true);
      const body = new FormData();
      body.append("name", name.trim());
      body.append("role", role.trim());
      body.append("content", content.trim());
      if (avatar) body.append("avatar", avatar);
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, body);
      } else {
        await api.post("/testimonials", body);
      }
      const fresh = await refresh();
      const saved = fresh.some((item) =>
        editingId
          ? item._id === editingId && item.name === name.trim() && item.content === content.trim()
          : item.name === name.trim() && item.content === content.trim()
      );
      if (!saved) {
        throw new Error("The testimonial request completed, but the saved item was not found after refresh.");
      }
      showToast(editingId ? "Trusted community story updated." : "Trusted community story added.");
      reset();
    } catch (error: any) {
      showToast(getRequestMessage(error, "Unable to save trusted community story."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={save} className="space-y-4 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
        <div className="rounded-2xl bg-cyan-50/60 p-4 text-sm leading-6 text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-100">
          These cards appear in the home page section named "Trusted By The Community".
        </div>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Community Supporter" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
        <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Volunteer, Monthly Supporter..." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
        <textarea rows={5} value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write the community quote shown on the home page..." className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
        <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(event) => setAvatar(event.target.files?.[0] || null)} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white dark:text-slate-300 dark:file:bg-white dark:file:text-slate-950" />
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-60 dark:bg-white dark:text-slate-950"><FiSave className="h-4 w-4" />{saving ? "Saving..." : editingId ? "Update Story" : "Add Story"}</button>
          {editingId && <button type="button" onClick={reset} className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">Cancel</button>}
        </div>
      </form>
      <div className="grid max-h-[42rem] content-start gap-3 overflow-y-auto pr-2">
        {testimonials.loading && testimonials.data.length === 0 && <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/[0.06]" />}
        {!testimonials.loading && testimonials.data.length === 0 && <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-white/[0.03]">No trusted community stories yet.</div>}
        {testimonials.data.map((item) => (
          <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
            <p className="font-bold text-slate-950 dark:text-white">{item.name}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">{item.role || "Community"}</p>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.content}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => { setEditingId(item._id); setName(item.name); setRole(item.role || ""); setContent(item.content); setAvatar(null); }} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">Edit</button>
              <button type="button" onClick={async () => { try { await api.delete(`/testimonials/${item._id}`); await refresh(); showToast("Trusted community story deleted."); } catch (error: any) { showToast(getRequestMessage(error, "Unable to delete trusted community story.")); } }} className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ReportAdmin({ reports, showToast }: { reports: ApiResource<TransparencyReport[]>; showToast: (message: string) => void }) {
  const [month, setMonth] = useState("");
  const [summary, setSummary] = useState("");
  const [fundUsageDescription, setFundUsageDescription] = useState("");
  const [totalSupportReceived, setTotalSupportReceived] = useState("");
  const [totalSupportUsed, setTotalSupportUsed] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    const response = await api.get<TransparencyReport[]>("/transparency/reports");
    const fresh = Array.isArray(response.data) ? response.data : [];
    reports.setData(fresh);
    writeLocal(STORE_KEYS.reports, fresh);
  };

  const reset = () => {
    setMonth("");
    setSummary("");
    setFundUsageDescription("");
    setTotalSupportReceived("");
    setTotalSupportUsed("");
    setImage(null);
    setEditingId(null);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!month.trim() || !summary.trim()) {
      showToast("Please enter report month and summary.");
      return;
    }
    try {
      setSaving(true);
      const body = new FormData();
      body.append("month", month.trim());
      body.append("summary", summary.trim());
      body.append("fundUsageDescription", fundUsageDescription.trim());
      body.append("totalSupportReceived", String(Number(totalSupportReceived || 0)));
      body.append("totalSupportUsed", String(Number(totalSupportUsed || 0)));
      if (image) body.append("image", image);
      if (editingId) {
        await api.put(`/transparency/reports/${editingId}`, body);
        showToast("Transparency report updated.");
      } else {
        await api.post("/transparency/reports", body);
        showToast("Transparency report added.");
      }
      await refresh();
      reset();
    } catch (error: any) {
      showToast(getRequestMessage(error, "Unable to save transparency report."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={save} className="space-y-4 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
        <input value={month} onChange={(event) => setMonth(event.target.value)} placeholder="Month, e.g. May 2026" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
        <textarea rows={4} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Monthly summary" className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
        <textarea rows={3} value={fundUsageDescription} onChange={(event) => setFundUsageDescription(event.target.value)} placeholder="Fund usage description" className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
        <div className="grid gap-3 sm:grid-cols-2">
          <input type="number" value={totalSupportReceived} onChange={(event) => setTotalSupportReceived(event.target.value)} placeholder="Support received" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
          <input type="number" value={totalSupportUsed} onChange={(event) => setTotalSupportUsed(event.target.value)} placeholder="Support used" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
        </div>
        <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(event) => setImage(event.target.files?.[0] || null)} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white dark:text-slate-300 dark:file:bg-white dark:file:text-slate-950" />
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-60 dark:bg-white dark:text-slate-950"><FiSave className="h-4 w-4" />{saving ? "Saving..." : editingId ? "Update Report" : "Add Report"}</button>
          {editingId && <button type="button" onClick={reset} className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">Cancel</button>}
        </div>
      </form>
      <div className="grid max-h-[42rem] content-start gap-3 overflow-y-auto pr-2">
        {reports.data.map((item) => (
          <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
            <p className="font-bold text-slate-950 dark:text-white">{item.month}</p>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Received: {item.totalSupportReceived || 0} | Used: {item.totalSupportUsed || 0}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => { setEditingId(item._id); setMonth(item.month); setSummary(item.summary); setFundUsageDescription(item.fundUsageDescription || ""); setTotalSupportReceived(String(item.totalSupportReceived || "")); setTotalSupportUsed(String(item.totalSupportUsed || "")); setImage(null); }} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">Edit</button>
              <button type="button" onClick={async () => { try { await api.delete(`/transparency/reports/${item._id}`); await refresh(); showToast("Report deleted."); } catch (error: any) { showToast(getRequestMessage(error, "Unable to delete report.")); } }} className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function InboxAdmin({ messages, showToast }: { messages: ApiResource<ContactMessage[]>; showToast: (message: string) => void }) {
  const refresh = async () => {
    const response = await api.get<ContactMessage[]>("/contact");
    const fresh = Array.isArray(response.data) ? response.data : [];
    messages.setData(fresh);
    writeLocal(STORE_KEYS.contacts, fresh);
  };

  return (
    <div className="grid max-h-[46rem] content-start gap-3 overflow-y-auto pr-2">
      {messages.data.length === 0 && <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-white/[0.03]">No contact messages.</div>}
      {messages.data.map((item) => (
        <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-bold text-slate-950 dark:text-white">{item.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.email}{item.phone ? ` | ${item.phone}` : ""}</p>
            </div>
            <span className={cn("w-fit rounded-full px-2.5 py-1 text-xs font-bold", item.isRead ? "bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300" : "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300")}>{item.isRead ? "Read" : "Unread"}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{item.message}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={async () => { try { await api.patch(`/contact/${item._id}/read`, { isRead: !item.isRead }); await refresh(); showToast(item.isRead ? "Marked unread." : "Marked read."); } catch (error: any) { showToast(getRequestMessage(error, "Unable to update message.")); } }} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">{item.isRead ? "Mark Unread" : "Mark Read"}</button>
            <button type="button" onClick={async () => { try { await api.delete(`/contact/${item._id}`); await refresh(); showToast("Message deleted."); } catch (error: any) { showToast(getRequestMessage(error, "Unable to delete message.")); } }} className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function CampaignAdmin({
  activities,
  showToast,
}: {
  activities: ApiResource<Activity[]>;
  showToast: (message: string) => void;
}) {
  const [items, setItems] = useState<Activity[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CAMPAIGN_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState(CAMPAIGN_CATEGORIES[0]);
  const [editCustomCategory, setEditCustomCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editImages, setEditImages] = useState<File[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(Array.isArray(activities.data) ? activities.data : []);
  }, [activities.data]);

  const resolveCampaignCategory = (value: string, customValue: string) =>
    (value === "custom" ? customValue : value).trim() || "Community Support";

  const refreshCampaigns = async () => {
    const response = await api.get<Activity[]>("/activities");
    const freshItems = Array.isArray(response.data)
      ? response.data.filter(isActivityItem)
      : [];
    activities.setData(freshItems);
    writeLocal(STORE_KEYS.activities, freshItems);
    setItems(freshItems);
    return freshItems;
  };

  const resetCreateForm = () => {
    setTitle("");
    setCategory(CAMPAIGN_CATEGORIES[0]);
    setCustomCategory("");
    setDescription("");
    setLocation("");
    setDate("");
    setFeatured(false);
    setImages([]);
  };

  const startEdit = (item: Activity) => {
    const knownCategory = CAMPAIGN_CATEGORIES.includes(item.category) ? item.category : "custom";
    setEditingId(item._id);
    setEditTitle(item.title || "");
    setEditCategory(knownCategory);
    setEditCustomCategory(knownCategory === "custom" ? item.category : "");
    setEditDescription(item.description || "");
    setEditLocation(item.location || "");
    setEditDate(item.date ? new Date(item.date).toISOString().slice(0, 10) : "");
    setEditFeatured(Boolean(item.featured));
    setEditImages([]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditImages([]);
  };

  const appendCampaignFields = (formData: FormData, payload: {
    title: string;
    category: string;
    customCategory: string;
    description: string;
    location: string;
    date: string;
    featured: boolean;
    images: File[];
  }) => {
    formData.append("title", payload.title.trim());
    formData.append("category", resolveCampaignCategory(payload.category, payload.customCategory));
    formData.append("description", payload.description.trim());
    formData.append("location", payload.location.trim());
    formData.append("featured", String(payload.featured));
    if (payload.date) formData.append("date", payload.date);
    payload.images.forEach((file) => formData.append("images", file));
  };

  const createCampaign = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      showToast("Please enter campaign title and description.");
      return;
    }

    try {
      setSaving(true);
      const body = new FormData();
      appendCampaignFields(body, {
        title,
        category,
        customCategory,
        description,
        location,
        date,
        featured,
        images,
      });
      await api.post<Activity>("/activities", body);
      await refreshCampaigns();
      resetCreateForm();
      showToast("Campaign added.");
    } catch (error: any) {
      showToast(getRequestMessage(error, "Unable to add campaign. Please check admin credentials."));
    } finally {
      setSaving(false);
    }
  };

  const updateCampaign = async (item: Activity) => {
    if (!editTitle.trim() || !editDescription.trim()) {
      showToast("Please enter campaign title and description.");
      return;
    }

    try {
      setUpdatingId(item._id);
      const body = new FormData();
      appendCampaignFields(body, {
        title: editTitle,
        category: editCategory,
        customCategory: editCustomCategory,
        description: editDescription,
        location: editLocation,
        date: editDate,
        featured: editFeatured,
        images: editImages,
      });
      await api.put<Activity>(`/activities/${item._id}`, body);
      await refreshCampaigns();
      cancelEdit();
      showToast("Campaign updated.");
    } catch (error: any) {
      showToast(getRequestMessage(error, "Unable to update campaign. Please check admin credentials."));
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteCampaign = async (item: Activity) => {
    try {
      await api.delete(`/activities/${item._id}`);
      await refreshCampaigns();
      if (editingId === item._id) cancelEdit();
      showToast("Campaign deleted.");
    } catch (error: any) {
      showToast(getRequestMessage(error, "Unable to delete campaign. Please check admin credentials."));
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <form onSubmit={createCampaign} className="space-y-4 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Campaign title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Animal feeding drive" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
              {CAMPAIGN_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
              <option value="custom">Add new category</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
          </label>
        </div>
        {category === "custom" && (
          <input value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} placeholder="New category name" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
        )}
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</span>
          <textarea rows={5} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the campaign and impact..." className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</span>
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City, area, or field site" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="h-4 w-4" />
          Feature on website
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Campaign images</span>
          <input type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(event) => setImages(Array.from(event.target.files || []))} className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white dark:text-slate-300 dark:file:bg-white dark:file:text-slate-950" />
        </label>
        <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950">
          <FiPlusCircle className="h-4 w-4" />
          {saving ? "Adding..." : "Add Campaign"}
        </button>
      </form>

      <div className="min-w-0">
        <div className="mb-3">
          <p className="text-sm font-bold text-slate-950 dark:text-white">Manage campaigns</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{items.length} campaign{items.length === 1 ? "" : "s"} on the website</p>
        </div>
        <div className="grid max-h-[46rem] content-start gap-4 overflow-y-auto pr-2">
          {activities.loading && items.length === 0 && <div className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/[0.06]" />}
          {!activities.loading && items.length === 0 && <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-white/[0.03]">No campaigns yet. Add the first campaign from the form.</div>}
          {items.map((item) => {
            const isEditing = editingId === item._id;
            return (
              <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
                {isEditing ? (
                  <div className="space-y-3">
                    <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} placeholder="Campaign title" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
                    <div className="grid gap-2 sm:grid-cols-2">
                      <select value={editCategory} onChange={(event) => setEditCategory(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
                        {CAMPAIGN_CATEGORIES.map((categoryItem) => <option key={categoryItem} value={categoryItem}>{categoryItem}</option>)}
                        <option value="custom">Add new</option>
                      </select>
                      <input type="date" value={editDate} onChange={(event) => setEditDate(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
                    </div>
                    {editCategory === "custom" && <input value={editCustomCategory} onChange={(event) => setEditCustomCategory(event.target.value)} placeholder="New category" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />}
                    <textarea rows={4} value={editDescription} onChange={(event) => setEditDescription(event.target.value)} placeholder="Description" className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
                    <input value={editLocation} onChange={(event) => setEditLocation(event.target.value)} placeholder="Location" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><input type="checkbox" checked={editFeatured} onChange={(event) => setEditFeatured(event.target.checked)} className="h-4 w-4" /> Featured</label>
                    <input type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(event) => setEditImages(Array.from(event.target.files || []))} className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-950 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-white dark:text-slate-300 dark:file:bg-white dark:file:text-slate-950" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-base font-bold text-slate-950 dark:text-white">{item.title}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">{item.category}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.location || "No location"}{item.featured ? " | Featured" : ""}</p>
                    </div>
                  </div>
                )}
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {isEditing ? (
                    <>
                      <button type="button" disabled={updatingId === item._id} onClick={() => updateCampaign(item)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60 dark:bg-emerald-400/10 dark:text-emerald-300"><FiSave className="h-4 w-4" />{updatingId === item._id ? "Saving" : "Save"}</button>
                      <button type="button" onClick={cancelEdit} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-200"><FiX className="h-4 w-4" />Cancel</button>
                    </>
                  ) : (
                    <button type="button" onClick={() => startEdit(item)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-200"><FiEdit3 className="h-4 w-4" />Edit</button>
                  )}
                  <button type="button" onClick={() => deleteCampaign(item)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-400/10 dark:text-rose-300"><FiTrash2 className="h-4 w-4" />Delete</button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GalleryAdmin({
  gallery,
  showToast,
}: {
  gallery: ApiResource<GalleryItem[]>;
  showToast: (message: string) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("general");
  const [uploadCustomCategory, setUploadCustomCategory] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadThumbnailFit, setUploadThumbnailFit] = useState<"contain" | "cover">("contain");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("general");
  const [editCustomCategory, setEditCustomCategory] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editThumbnailFit, setEditThumbnailFit] = useState<"contain" | "cover">("contain");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(Array.isArray(gallery.data) ? gallery.data : []);
  }, [gallery.data]);

  const resolveCategory = (category: string, customCategory: string) => {
    const value = category === "custom" ? customCategory : category;
    return value.trim().toLowerCase() || "general";
  };

  const syncGalleryItems = (freshItems: GalleryItem[]) => {
    gallery.setData(freshItems);
    writeLocal(STORE_KEYS.gallery, freshItems);
    setItems(freshItems);
  };

  const startEdit = (item: GalleryItem) => {
    const normalizedCategory = item.category || "general";
    const knownCategory = GALLERY_CATEGORIES.includes(normalizedCategory.toLowerCase())
      ? normalizedCategory.toLowerCase()
      : "custom";

    setEditingId(item._id);
    setEditTitle(item.title || "");
    setEditCategory(knownCategory);
    setEditCustomCategory(knownCategory === "custom" ? normalizedCategory : "");
    setEditCaption(item.caption || "");
    setEditThumbnailFit(item.thumbnailFit === "cover" ? "cover" : "contain");
    setEditFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFile(null);
  };

  const refreshGallery = async () => {
    const listResponse = await api.get<GalleryItem[]>("/gallery");
    return Array.isArray(listResponse.data)
      ? listResponse.data.filter(isGalleryItem)
      : [];
  };

  const saveImageDetails = async (item: GalleryItem) => {
    const category = resolveCategory(editCategory, editCustomCategory);

    if (!editTitle.trim()) {
      showToast("Please enter an image name.");
      return;
    }

    try {
      setUpdatingId(item._id);
      const formData = new FormData();
      formData.append("title", editTitle.trim());
      formData.append("category", category);
      formData.append("caption", editCaption.trim());
      formData.append("thumbnailFit", editThumbnailFit);
      if (editFile) formData.append("image", editFile);

      await api.put<GalleryItem>(`/gallery/${item._id}`, formData);
      const freshItems = await refreshGallery();
      syncGalleryItems(freshItems);
      cancelEdit();
      showToast("Gallery image updated.");
    } catch (error: any) {
      showToast(getRequestMessage(error, "Update failed. Please check admin credentials."));
    } finally {
      setUpdatingId(null);
    }
  };

  const uploadImages = async (event: FormEvent) => {
    event.preventDefault();

    if (files.length === 0) {
      showToast("Please select at least one image.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (files.some((file) => !allowedTypes.includes(file.type))) {
      showToast("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    if (files.some((file) => file.size > maxSize)) {
      showToast("Image size must be less than 5MB.");
      return;
    }

    try {
      setUploading(true);

      const uploadedImages: GalleryItem[] = [];
      const category = resolveCategory(uploadCategory, uploadCustomCategory);

      for (const [index, file] of files.entries()) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append(
          "title",
          uploadTitle.trim()
            ? files.length > 1
              ? `${uploadTitle.trim()} ${index + 1}`
              : uploadTitle.trim()
            : file.name
        );
        formData.append("category", category);
        formData.append("caption", uploadCaption.trim());
        formData.append("thumbnailFit", uploadThumbnailFit);

        const response = await api.post<GalleryItem>("/gallery", formData);
        console.debug("[GalleryAdmin] uploaded image response", {
          responseData: response.data,
          responseStatus: response.status,
          hasId: response.data?._id ? "yes" : "no",
          hasImageUrl: response.data?.imageUrl ? "yes" : "no",
        });

        if (!response.data || typeof response.data !== "object") {
          console.error("[GalleryAdmin] response is not an object", response.data);
          throw new Error("Invalid upload response: response data is not an object");
        }

        if (!isGalleryItem(response.data)) {
          console.error("[GalleryAdmin] isGalleryItem validation failed", {
            id: (response.data as any)?._id,
            imageUrl: (response.data as any)?.imageUrl,
          });
          throw new Error("Upload did not return a saved gallery image. Missing _id or imageUrl.");
        }

        uploadedImages.push(response.data);
        console.debug("[GalleryAdmin] image uploaded", {
          id: response.data._id,
          title: response.data.title,
        });
      }

      console.debug("[GalleryAdmin] fetching fresh gallery list", {
        uploadedCount: uploadedImages.length,
      });

      const freshItems = await refreshGallery();

      console.debug("[GalleryAdmin] fresh gallery list", {
        totalCount: freshItems.length,
        uploadedIds: uploadedImages.map((img) => img._id),
        freshIds: freshItems.map((img) => img._id),
      });

      const missingSavedImages = uploadedImages.filter(
        (image) => !freshItems.some((item) => item._id === image._id)
      );

      if (missingSavedImages.length > 0) {
        console.error("[GalleryAdmin] missing images after upload", {
          missing: missingSavedImages.map((img) => img._id),
        });
        throw new Error(
          `Upload reached the server, but ${missingSavedImages.length} image(s) were not found in the saved gallery list.`
        );
      }

      syncGalleryItems(freshItems);
      setFiles([]);
      setUploadTitle("");
      setUploadCaption("");

      showToast(
        uploadedImages.length === 1
          ? "Image uploaded successfully."
          : "Images uploaded successfully."
      );
    } catch (error: any) {
      console.error("[GalleryAdmin] upload error", error);
      showToast(getRequestMessage(error, "Upload failed. Please check backend upload settings."));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-6 2xl:grid-cols-[0.72fr_1.28fr]">
      <form onSubmit={uploadImages} className="space-y-4">
        <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Image name
            </span>
            <input
              value={uploadTitle}
              onChange={(event) => setUploadTitle(event.target.value)}
              placeholder="Example: Food drive day 1"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-white/10"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Category
              </span>
              <select
                value={uploadCategory}
                onChange={(event) => setUploadCategory(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-white/10"
              >
                {GALLERY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
                <option value="custom">Add new category</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Thumbnail
              </span>
              <select
                value={uploadThumbnailFit}
                onChange={(event) => setUploadThumbnailFit(event.target.value === "cover" ? "cover" : "contain")}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-white/10"
              >
                {GALLERY_FIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {uploadCategory === "custom" && (
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                New category name
              </span>
              <input
                value={uploadCustomCategory}
                onChange={(event) => setUploadCustomCategory(event.target.value)}
                placeholder="Example: education"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-white/10"
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Caption
            </span>
            <textarea
              rows={3}
              value={uploadCaption}
              onChange={(event) => setUploadCaption(event.target.value)}
              placeholder="Short note shown with the gallery image"
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-white/10"
            />
          </label>
        </div>

        <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-slate-400 hover:bg-slate-100 dark:border-white/15 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
          <FiUploadCloud className="h-9 w-9 text-slate-500 dark:text-slate-400" />

          <p className="mt-4 text-base font-bold text-slate-950 dark:text-white">
            Upload gallery images
          </p>

          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
            Choose JPG, PNG, or WEBP images. Max size: 5MB each.
          </p>

          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(event) =>
              setFiles(Array.from(event.target.files || []))
            }
          />
        </label>

        {files.length > 0 && (
          <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
            {files.length} file(s) selected
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      </form>

      <div className="min-w-0">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-950 dark:text-white">
              Saved gallery images
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {items.length} image{items.length === 1 ? "" : "s"} in the public gallery
            </p>
          </div>
        </div>

        <div className="grid max-h-[46rem] content-start items-start gap-4 overflow-y-auto pr-2 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
        {gallery.loading &&
          items.length === 0 &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
            className="h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/[0.06]"
          />
          ))}

        {!gallery.loading && items.length === 0 && (
          <div className="col-span-full rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
            No gallery images yet.
          </div>
        )}

          {items.map((item) => {
            const deleteImage = async () => {
              try {
                await api.delete(`/gallery/${item._id}`);
                const listResponse = await api.get<GalleryItem[]>("/gallery");
                const freshItems = Array.isArray(listResponse.data)
                  ? listResponse.data.filter(isGalleryItem)
                  : [];

                if (freshItems.some((image) => image._id === item._id)) {
                  throw new Error("Delete reached the server, but the image still exists in the gallery list.");
                }

                syncGalleryItems(freshItems);
                if (editingId === item._id) cancelEdit();
                showToast("Image deleted.");
              } catch (error: any) {
                showToast(getRequestMessage(error, "Delete failed. Please check admin credentials."));
              }
            };

            const isEditing = editingId === item._id;
            const imageFit = item.thumbnailFit === "cover" ? "object-cover" : "object-contain";

            return (
              <article
                key={item._id}
                className="flex min-h-[19rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0d1117]"
              >
                <div className="relative aspect-[4/3] min-h-48 w-full overflow-hidden bg-slate-100 dark:bg-white/[0.04]">
                  <img
                    src={asset(item.imageUrl) || GALLERY_IMAGE_FALLBACK}
                    alt={item.title || "Gallery image"}
                    className={cn("h-full w-full", imageFit)}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = GALLERY_IMAGE_FALLBACK;
                    }}
                  />

                  <button
                    type="button"
                    aria-label={`Delete ${item.title || "gallery image"}`}
                    onClick={deleteImage}
                    className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-rose-600 shadow-md ring-1 ring-slate-200 transition hover:bg-rose-50 dark:bg-slate-950/90 dark:text-rose-300 dark:ring-white/10"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        placeholder="Image name"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                      />

                      <div className="grid gap-2 sm:grid-cols-2">
                        <select
                          value={editCategory}
                          onChange={(event) => setEditCategory(event.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                        >
                          {GALLERY_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                          <option value="custom">Add new</option>
                        </select>

                        <select
                          value={editThumbnailFit}
                          onChange={(event) => setEditThumbnailFit(event.target.value === "cover" ? "cover" : "contain")}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                        >
                          {GALLERY_FIT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {editCategory === "custom" && (
                        <input
                          value={editCustomCategory}
                          onChange={(event) => setEditCustomCategory(event.target.value)}
                          placeholder="New category"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                        />
                      )}

                      <textarea
                        rows={3}
                        value={editCaption}
                        onChange={(event) => setEditCaption(event.target.value)}
                        placeholder="Caption"
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                      />

                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(event) => setEditFile(event.target.files?.[0] || null)}
                        className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-950 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-white dark:text-slate-300 dark:file:bg-white dark:file:text-slate-950"
                      />
                    </div>
                  ) : (
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                        {item.title || "Untitled image"}
                      </p>

                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        {item.category || "general"}
                      </p>

                      {item.caption && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid gap-2 sm:grid-cols-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          disabled={updatingId === item._id}
                          onClick={() => saveImageDetails(item)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60 dark:bg-emerald-400/10 dark:text-emerald-300"
                        >
                          <FiSave className="h-4 w-4" />
                          {updatingId === item._id ? "Saving" : "Save"}
                        </button>

                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-200"
                        >
                          <FiX className="h-4 w-4" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-200"
                        >
                          <FiEdit3 className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={deleteImage}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-400/10 dark:text-rose-300"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SupportSettingForm({ settings, reload, showToast }: {
  settings: SiteSettings | null;
  reload: () => Promise<void>;
  showToast: (message: string) => void;
}) {
  const [upiId, setUpiId] = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUpiId(settings?.upiId || "");
    setPaymentInstructions(settings?.paymentInstructions || "");
  }, [settings]);

  return (
    <form
      className="grid gap-5 lg:grid-cols-[1fr_0.8fr]"
      onSubmit={async (event) => {
        event.preventDefault();

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024;

        if (file && !allowedTypes.includes(file.type)) {
          showToast("Only JPG, PNG, and WEBP QR images are allowed.");
          return;
        }

        if (file && file.size > maxSize) {
          showToast("QR image size must be less than 5MB.");
          return;
        }

        try {
          setSaving(true);
          const body = new FormData();
          body.append("upiId", upiId);
          body.append("paymentInstructions", paymentInstructions);
          if (file) body.append("qrImage", file);
          const response = await api.put<SiteSettings>("/transparency/settings", body);
          if (!response.data || typeof response.data !== "object") {
            throw new Error("Settings were not saved by the backend.");
          }
          writeLocal(STORE_KEYS.settings, response.data);
          setFile(null);
          await reload();
          showToast("Settings updated");
        } catch (error: any) {
          showToast(getRequestMessage(error, "Settings save failed. Please check admin credentials and backend connection."));
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">UPI ID</span>
          <input value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="example@upi" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-white/10" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Payment Instructions</span>
          <textarea rows={6} value={paymentInstructions} onChange={(event) => setPaymentInstructions(event.target.value)} placeholder="Enter donation instructions..." className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-white/10" />
        </label>
      </div>
      <div className="flex flex-col justify-between rounded-3xl bg-slate-50 p-5 dark:bg-white/[0.03]">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">QR Image</span>
          <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white dark:text-slate-300 dark:file:bg-white dark:file:text-slate-950" />
        </label>
        <button type="submit" disabled={saving} className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

const defaultImpactStats = [
  { label: "Meals Distributed", value: 320 },
  { label: "Animals Helped", value: 248 },
  { label: "Trees Planted", value: 140 },
  { label: "Families Supported", value: 72 },
  { label: "Support Tracked", value: 54 },
];

function ImpactSettingsForm({ settings, reload, showToast }: {
  settings: SiteSettings | null;
  reload: () => Promise<void>;
  showToast: (message: string) => void;
}) {
  const [stats, setStats] = useState(defaultImpactStats);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedStats = settings?.impactStats?.filter((item) => item.label);
    setStats(savedStats?.length ? savedStats.map((item) => ({
      label: item.label,
      value: Number(item.value) || 0,
    })) : defaultImpactStats);
  }, [settings]);

  const updateStat = (index: number, field: "label" | "value", value: string) => {
    setStats((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === "value" ? Math.max(0, Number(value || 0)) : value,
            }
          : item
      )
    );
  };

  const addStat = () => {
    setStats((current) => [...current, { label: "New Statistic", value: 0 }].slice(0, 8));
  };

  const removeStat = (index: number) => {
    setStats((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const cleanStats = stats
          .map((item) => ({ label: item.label.trim(), value: Math.max(0, Number(item.value) || 0) }))
          .filter((item) => item.label);

        if (cleanStats.length === 0) {
          showToast("Add at least one impact statistic.");
          return;
        }

        try {
          setSaving(true);
          await api.put<SiteSettings>("/transparency/settings", { impactStats: cleanStats });
          const response = await api.get<SiteSettings>("/transparency/settings");
          if (!sameImpactStats(cleanStats, response.data?.impactStats)) {
            throw new Error("The backend accepted the request, but the impact statistics were not saved after refresh. Please restart/redeploy the backend with the latest settings API.");
          }
          writeLocal(STORE_KEYS.settings, response.data);
          await reload();
          showToast("Impact statistics updated.");
        } catch (error: any) {
          showToast(getRequestMessage(error, "Impact statistics save failed. Please check admin credentials and backend connection."));
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="rounded-2xl bg-cyan-50/60 p-4 text-sm leading-6 text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-100">
        These values power the public Impact Statistics section on the home page. Keep labels short so the cards stay clean on mobile.
      </div>

      <div className="space-y-3">
        {stats.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03] md:grid-cols-[1fr_10rem_auto]">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Label</span>
              <input
                value={item.label}
                onChange={(event) => updateStat(index, "label", event.target.value)}
                placeholder="Meals Distributed"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-cyan-400/10"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Value</span>
              <input
                type="number"
                min="0"
                value={item.value}
                onChange={(event) => updateStat(index, "value", event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-cyan-400/10"
              />
            </label>
            <button
              type="button"
              onClick={() => removeStat(index)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-400/10 dark:text-rose-300 md:mt-6"
              aria-label={`Remove ${item.label || "impact statistic"}`}
            >
              <FiTrash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addStat}
          disabled={stats.length >= 8}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
        >
          <FiPlusCircle className="h-4 w-4" /> Add Statistic
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <FiSave className="h-4 w-4" /> {saving ? "Saving..." : "Save Impact Statistics"}
        </button>
      </div>
    </form>
  );
}

function formatDate(value?: string) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function AdminDashboardPage() {
  const [selectedTool, setSelectedTool] = useState<AdminTool["id"]>("overview");
  const { showToast } = useToast();
  const gallery = useApiData<GalleryItem[]>("/gallery", [], STORE_KEYS.gallery);
  const settings = useApiData<SiteSettings | null>("/transparency/settings", null, STORE_KEYS.settings);
  const supportMessages = useApiData<SupportMessage[]>("/supporters", [], "cc_admin_supporters");
  const contactMessages = useApiData<ContactMessage[]>("/contact", [], "cc_admin_messages");
  const activities = useApiData<Activity[]>("/activities", [], STORE_KEYS.activities);
  const faqs = useApiData<FAQItem[]>("/faqs", [], STORE_KEYS.faqs);
  const testimonials = useApiData<Testimonial[]>("/testimonials", [], STORE_KEYS.testimonials);
  const reports = useApiData<TransparencyReport[]>("/transparency/reports", [], STORE_KEYS.reports);

  const totalDonations = supportMessages.data.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const recentSupport = supportMessages.data.slice(0, 6);

  const tools: AdminTool[] = [
    { id: "overview", title: "Overview", description: "Live health, activity, and operational snapshot.", badge: "Live", action: "Review", icon: FiTrendingUp },
    { id: "support", title: "Support Leaderboard", description: "Manage donation recognition and supporter entries.", badge: "Public", action: "Manage", icon: FiUsers },
    { id: "campaigns", title: "Campaigns", description: "Add, edit, and remove public campaign records.", badge: `${activities.data.length} items`, action: "Manage", icon: FiPlusCircle },
    { id: "impact", title: "Impact Statistics", description: "Modify public home page counter labels and values.", badge: `${settings.data?.impactStats?.length || 5} counters`, action: "Edit", icon: FiTrendingUp },
    { id: "gallery", title: "Gallery Upload", description: "Upload, review, and remove public gallery media.", badge: `${gallery.data.length} items`, action: "Open", icon: FiImage },
    { id: "faqs", title: "FAQs", description: "Add and modify public question answers.", badge: `${faqs.data.length} items`, action: "Edit", icon: FiHelpCircle },
    { id: "testimonials", title: "Trusted Community", description: "Modify home page trusted community cards.", badge: `${testimonials.data.length} items`, action: "Edit", icon: FiStar },
    { id: "reports", title: "Reports", description: "Manage transparency report updates.", badge: `${reports.data.length} items`, action: "Edit", icon: FiFileText },
    { id: "inbox", title: "Inbox", description: "Review and remove contact messages.", badge: `${contactMessages.data.filter((item) => !item.isRead).length} unread`, action: "Open", icon: FiMessageSquare },
    { id: "settings", title: "Payment Settings", description: "Update UPI, QR code, and payment instructions.", badge: "Secure", action: "Configure", icon: FiSettings },
  ];

  const recentRows = useMemo(
    () => [
      ...recentSupport.map((entry) => ({
        id: entry._id,
        title: entry.contributorName || "Anonymous supporter",
        detail: entry.supportMessage || "Support contribution recorded",
        meta: `INR ${entry.amount || 0}`,
        date: formatDate(entry.createdAt),
        icon: FiDollarSign,
      })),
      ...contactMessages.data.slice(0, 3).map((message) => ({
        id: message._id,
        title: message.name,
        detail: message.message,
        meta: "Message",
        date: message.isRead ? "Read" : "Unread",
        icon: FiInbox,
      })),
    ].slice(0, 7),
    [recentSupport, contactMessages.data]
  );

  return (
    <div className="space-y-6">
      <PageMeta title="Admin Dashboard" />

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10151d] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                Operational
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Updated just now</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Run the platform with clarity.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Manage content, payment settings, supporter records, and public activity from a compact production dashboard.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            View website
            <FiArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Donations" value={`INR ${totalDonations}`} trend="Tracked from supporters" icon={FiDollarSign} />
        <StatCard label="Supporters" value={supportMessages.data.length} trend="Public leaderboard ready" icon={FiUsers} />
        <StatCard label="Campaigns" value={activities.data.length} trend="Activity records synced" icon={FiCheckCircle} />
        <StatCard label="Messages" value={contactMessages.data.length} trend="Contact inbox monitored" icon={FiInbox} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => <ToolCard key={tool.id} tool={tool} selected={selectedTool === tool.id} onSelect={setSelectedTool} />)}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <div className="space-y-6">
          {selectedTool === "overview" && (
            <Surface
              eyebrow="Operations"
              title="Recent Activity"
              action={<Link to="/admin/support-us" className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 ring-1 ring-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-200 dark:ring-cyan-400/20">Open Support <FiArrowUpRight /></Link>}
            >
              <div className="max-h-[30rem] space-y-1 overflow-y-auto pr-1">
                {(supportMessages.loading || contactMessages.loading) && Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.06]" />)}
                {!supportMessages.loading && !contactMessages.loading && recentRows.length === 0 && (
                  <div className="rounded-2xl bg-slate-50 p-8 text-center dark:bg-white/[0.03]">
                    <FiInbox className="mx-auto h-6 w-6 text-slate-400" />
                    <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">No recent activity yet</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">New supporter and contact events will appear here.</p>
                  </div>
                )}
                {!supportMessages.loading && !contactMessages.loading && recentRows.map((row) => (
                  <ActivityItem
                    key={row.id}
                    title={row.title}
                    detail={row.detail}
                    meta={row.meta}
                    date={row.date}
                    icon={row.icon}
                    status={row.meta === "Message" ? "info" : "success"}
                  />
                ))}
              </div>
            </Surface>
          )}

          {selectedTool === "gallery" && (
            <Surface eyebrow="Media" title="Gallery Manager">
              <GalleryAdmin gallery={gallery} showToast={showToast} />
            </Surface>
          )}

          {selectedTool === "campaigns" && (
            <Surface eyebrow="Campaigns" title="Campaign Manager">
              <CampaignAdmin activities={activities} showToast={showToast} />
            </Surface>
          )}

          {selectedTool === "impact" && (
            <Surface eyebrow="Home Page" title="Impact Statistics Manager">
              <ImpactSettingsForm settings={settings.data} reload={settings.reload} showToast={showToast} />
            </Surface>
          )}

          {selectedTool === "faqs" && (
            <Surface eyebrow="Content" title="FAQ Manager">
              <FAQAdmin faqs={faqs} showToast={showToast} />
            </Surface>
          )}

          {selectedTool === "testimonials" && (
            <Surface eyebrow="Home Page" title="Trusted By The Community Manager">
              <TestimonialAdmin testimonials={testimonials} showToast={showToast} />
            </Surface>
          )}

          {selectedTool === "reports" && (
            <Surface eyebrow="Transparency" title="Report Manager">
              <ReportAdmin reports={reports} showToast={showToast} />
            </Surface>
          )}

          {selectedTool === "inbox" && (
            <Surface eyebrow="Messages" title="Contact Inbox">
              <InboxAdmin messages={contactMessages} showToast={showToast} />
            </Surface>
          )}

          {selectedTool === "settings" && (
            <Surface eyebrow="Payments" title="Payment & Transparency Settings">
              <SupportSettingForm settings={settings.data} reload={settings.reload} showToast={showToast} />
            </Surface>
          )}

          {selectedTool === "support" && (
            <Surface
              eyebrow="Support"
              title="Leaderboard Management"
              action={<Link to="/admin/support-us" className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 ring-1 ring-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-200 dark:ring-cyan-400/20">Manage Entries <FiArrowUpRight /></Link>}
            >
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-white/[0.03]">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">Create, edit, search, and delete public support leaderboard records from a dedicated admin table.</p>
              </div>
            </Surface>
          )}
        </div>

        <Surface eyebrow="Health" title="Admin Summary">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <SummaryWidget label="Gallery" value={gallery.loading ? "Syncing" : `${gallery.data.length} images`} helper="Public media library status." icon={FiImage} />
            <SummaryWidget label="Payments" value={settings.loading ? "Checking" : settings.data?.upiId ? "Configured" : "Needs setup"} helper="UPI and QR configuration." icon={FiSettings} />
            <SummaryWidget label="Inbox" value={contactMessages.loading ? "Loading" : `${contactMessages.data.filter((item) => !item.isRead).length} unread`} helper="Contact messages waiting." icon={FiInbox} />
            <SummaryWidget label="Support" value={supportMessages.loading ? "Loading" : `${supportMessages.data.length} entries`} helper="Supporter records available." icon={FiUsers} />
          </div>
        </Surface>
      </div>
    </div>
  );
}
