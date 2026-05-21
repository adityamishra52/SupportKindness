const LOCAL_API_BASE_URL = "http://localhost:5000/api";
const PRODUCTION_API_BASE_URL = "https://carecontributionbackend.onrender.com/api";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizeApiBaseUrl(value: string) {
  const trimmed = trimTrailingSlash(value.trim());

  if (!trimmed) return "";
  if (trimmed.endsWith("/api")) return trimmed;

  return `${trimmed}/api`;
}

const configuredApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || "").trim();
const configuredBackendBaseUrl = String(import.meta.env.VITE_BACKEND_BASE_URL || "").trim();

export const API_BASE_URL = normalizeApiBaseUrl(
  configuredApiBaseUrl ||
    configuredBackendBaseUrl ||
    (import.meta.env.PROD ? PRODUCTION_API_BASE_URL : LOCAL_API_BASE_URL)
);

export const BACKEND_BASE_URL = trimTrailingSlash(
  configuredBackendBaseUrl || API_BASE_URL.replace(/\/api\/?$/, "")
);

export const APP_NAME = import.meta.env.VITE_APP_NAME || "Support Kindness";
export const ENV_UPI_ID = import.meta.env.VITE_UPI_ID || "";
