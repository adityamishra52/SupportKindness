import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "@/constants/env";
import { clearAdminSession } from "@/utils/adminAuth";

function isFrontendHtmlResponse(body: unknown) {
  if (typeof body !== "string") return false;

  const sample = body.slice(0, 300).toLowerCase();
  return sample.includes("<!doctype html") || sample.includes("<html");
}

function unwrapApiData(body: any): any {
  let current = body;

  for (let depth = 0; depth < 4; depth += 1) {
    if (!current || typeof current !== "object" || !("success" in current)) {
      return current;
    }

    if (current.success === false) {
      throw new AxiosError(
        typeof current.message === "string" ? current.message : "API request failed.",
        AxiosError.ERR_BAD_RESPONSE
      );
    }

    if ("image" in current) return current.image;
    if ("images" in current) return current.images;
    if ("setting" in current) return current.setting;
    if ("settings" in current) return current.settings;

    if ("data" in current) {
      current = current.data;
      continue;
    }

    return current;
  }

  return current;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("cc-admin-auth-token");
    const adminPassword = localStorage.getItem("cc-admin-password");

    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    if (adminPassword) {
      config.headers.set("X-Admin-Password", adminPassword);
    }

    const isFormData = config.data instanceof FormData;

    if (isFormData) {
      config.headers.delete("Content-Type");
    } else if (!config.headers.has("Content-Type")) {
      config.headers.set("Content-Type", "application/json");
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const body = response.data;

    if (isFrontendHtmlResponse(body)) {
      throw new AxiosError(
        "The API request returned the frontend HTML page. Check VITE_API_BASE_URL in Vercel and point it to the Render backend /api URL.",
        AxiosError.ERR_BAD_RESPONSE,
        response.config,
        response.request,
        response
      );
    }

    if (body && typeof body === "object" && "success" in body) {
      const extractedData = unwrapApiData(body);
      return {
        ...response,
        data: extractedData !== undefined ? extractedData : null,
      };
    }

    return response;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;

    const isAdminPage = window.location.pathname.startsWith("/admin");
    const isLoginPage = window.location.pathname === "/admin/login";

    if (status === 401 && isAdminPage && !isLoginPage) {
      clearAdminSession();
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default api;
