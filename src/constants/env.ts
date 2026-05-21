export const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/api\/?$/, "") : "";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Support Kindness";
export const ENV_UPI_ID = import.meta.env.VITE_UPI_ID || "";
