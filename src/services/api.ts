import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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

    if (
      body &&
      typeof body === "object" &&
      "success" in body &&
      "data" in body
    ) {
      return {
        ...response,
        data: body.data,
      };
    }

    return response;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isAdminPage = window.location.pathname.startsWith("/admin");
    const isLoginPage = window.location.pathname === "/admin/login";

    const isAuthRoute =
      requestUrl.includes("/admin/login") ||
      requestUrl.includes("/auth/login");

    if (status === 401 && isAdminPage && isAuthRoute && !isLoginPage) {
      localStorage.removeItem("cc-admin-auth");
      localStorage.removeItem("cc-admin-auth-token");
      localStorage.removeItem("cc-admin-password");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default api;