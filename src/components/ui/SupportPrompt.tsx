import { FiCopy } from "react-icons/fi";
import { useToast } from "@/context/ToastContext";
import { useApiData } from "@/hooks/useApiData";
import { asset } from "@/utils/asset";
import { ENV_UPI_ID } from "@/constants/env";
import { STORE_KEYS } from "@/constants/storeKeys";
import type { SiteSettings } from "@/types";

export function SupportPrompt({ message }: { message: string }) {
  const { showToast } = useToast();
  const { data: settings } = useApiData<SiteSettings | null>("/transparency/settings", null, STORE_KEYS.settings);
  const upiId = settings?.upiId || ENV_UPI_ID;
  const qr = settings?.qrImageUrl ? asset(settings.qrImageUrl) : "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=700&auto=format&fit=crop";

  return (
    <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 md:grid-cols-2">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Support This Mission</h3>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{message}</p>
        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-200">UPI ID: {upiId}</p>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(upiId);
            showToast("UPI copied");
          }}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-400"
        >
          <FiCopy /> Copy UPI
        </button>
      </div>
      <div className="flex min-h-48 items-center justify-center rounded-3xl bg-slate-50 p-3 dark:bg-white/[0.04]">
        <img src={qr} alt="Support QR" className="max-h-48 w-full object-contain" loading="lazy" />
      </div>
    </div>
  );
}
