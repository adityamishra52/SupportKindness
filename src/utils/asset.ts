import { BACKEND_BASE_URL } from "@/constants/env";

export function asset(url?: string) {
  if (!url) return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("//")
  ) {
    return trimmed;
  }

  const base = BACKEND_BASE_URL?.trim();
  if (base) {
    try {
      return new URL(trimmed, base).toString();
    } catch {
      return `${base.replace(/\/+$/, "")}/${trimmed.replace(/^\/+/, "")}`;
    }
  }

  if (typeof window !== "undefined" && trimmed.startsWith("/api/")) {
    return `${window.location.origin}${trimmed}`;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
