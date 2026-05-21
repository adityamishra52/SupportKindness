import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { type ComponentType, type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiDollarSign,
  FiImage,
  FiInbox,
  FiSettings,
  FiTrash2,
  FiTrendingUp,
  FiUploadCloud,
  FiUsers,
} from "react-icons/fi";

import { PageMeta } from "@/components/ui/PageMeta";
import { STORE_KEYS } from "@/constants/storeKeys";
import { useToast } from "@/context/ToastContext";
import { useApiData } from "@/hooks/useApiData";
import { api } from "@/services/api";
import type { Activity, ApiResource, ContactMessage, GalleryItem, SiteSettings, SupportMessage } from "@/types";
import { asset } from "@/utils/asset";
import { cn } from "@/utils/cn";
import { writeLocal } from "@/utils/storage";

type AdminTool = {
  id: "overview" | "support" | "gallery" | "settings";
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

  useEffect(() => {
    setItems(Array.isArray(gallery.data) ? gallery.data : []);
  }, [gallery.data]);

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

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", file.name);
        formData.append("category", "general");

        const response = await api.post<GalleryItem>("/gallery", formData);
        console.debug("[GalleryAdmin] uploaded image response", response.data);

        if (!isGalleryItem(response.data)) {
          throw new Error("Upload did not return a saved gallery image.");
        }

        uploadedImages.push(response.data);
      }

      const listResponse = await api.get<GalleryItem[]>("/gallery");
      const freshItems = Array.isArray(listResponse.data)
        ? listResponse.data.filter(isGalleryItem)
        : [];
      const missingSavedImage = uploadedImages.some(
        (image) => !freshItems.some((item) => item._id === image._id)
      );

      if (missingSavedImage) {
        throw new Error("Upload reached the server, but the image was not found in the saved gallery list.");
      }

      gallery.setData(freshItems);
      writeLocal(STORE_KEYS.gallery, freshItems);
      setItems(freshItems);
      setFiles([]);

      showToast(
        uploadedImages.length === 1
          ? "Image uploaded successfully."
          : "Images uploaded successfully."
      );
    } catch (error: any) {
      showToast(getRequestMessage(error, "Upload failed. Please check backend upload settings."));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <form onSubmit={uploadImages} className="space-y-4">
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

      <div className="grid max-h-[34rem] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
        {gallery.loading &&
          items.length === 0 &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-3xl bg-slate-100 dark:bg-white/[0.06]"
            />
          ))}

        {!gallery.loading && items.length === 0 && (
          <div className="col-span-full rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
            No gallery images yet.
          </div>
        )}

        {items.map((item) => (
          <article
            key={item._id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0d1117]"
          >
            <img
              src={asset(item.imageUrl) || GALLERY_IMAGE_FALLBACK}
              alt={item.title || "Gallery image"}
              className="h-40 w-full object-cover"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = GALLERY_IMAGE_FALLBACK;
              }}
            />

            <div className="p-4">
              <p className="truncate font-semibold text-slate-950 dark:text-white">
                {item.title || "Untitled image"}
              </p>

              <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {item.category || "general"}
              </p>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await api.delete(`/gallery/${item._id}`);
                    const listResponse = await api.get<GalleryItem[]>("/gallery");
                    const freshItems = Array.isArray(listResponse.data)
                      ? listResponse.data.filter(isGalleryItem)
                      : [];

                    if (freshItems.some((image) => image._id === item._id)) {
                      throw new Error("Delete reached the server, but the image still exists in the gallery list.");
                    }

                    gallery.setData(freshItems);
                    writeLocal(STORE_KEYS.gallery, freshItems);
                    setItems(freshItems);
                    showToast("Image deleted.");
                  } catch (error: any) {
                    showToast(getRequestMessage(error, "Delete failed. Please check admin credentials."));
                  }
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-400/10 dark:text-rose-300"
              >
                <FiTrash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </article>
        ))}
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

  const totalDonations = supportMessages.data.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const recentSupport = supportMessages.data.slice(0, 6);

  const tools: AdminTool[] = [
    { id: "overview", title: "Overview", description: "Live health, activity, and operational snapshot.", badge: "Live", action: "Review", icon: FiTrendingUp },
    { id: "support", title: "Support Leaderboard", description: "Manage donation recognition and supporter entries.", badge: "Public", action: "Manage", icon: FiUsers },
    { id: "gallery", title: "Gallery Upload", description: "Upload, review, and remove public gallery media.", badge: `${gallery.data.length} items`, action: "Open", icon: FiImage },
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
