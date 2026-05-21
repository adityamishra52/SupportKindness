import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import { PageMeta } from "@/components/ui/PageMeta";
import { siteConfig } from "@/config/siteConfig";
import { useToast } from "@/context/ToastContext";

const ADMIN_AUTH_KEY = "cc-admin-auth";
const ADMIN_TOKEN_KEY = "cc-admin-auth-token";
const ADMIN_PASSWORD_KEY = "cc-admin-password";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "";
  const adminToken = import.meta.env.VITE_ADMIN_TOKEN || "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const enteredPassword = password.trim();

    setError("");

    if (!adminPassword) {
      setError("Admin password is not configured.");
      return;
    }

    if (!enteredPassword) {
      setError("Please enter admin password.");
      return;
    }

    if (enteredPassword !== adminPassword) {
      setError("Invalid password. Please try again.");
      return;
    }

    localStorage.setItem(ADMIN_AUTH_KEY, "true");
    localStorage.setItem(ADMIN_PASSWORD_KEY, enteredPassword);

    if (adminToken) {
      localStorage.setItem(ADMIN_TOKEN_KEY, adminToken);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }

    showToast("Admin access granted");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-20 text-slate-100 sm:px-6 lg:px-8">
      <PageMeta
        title="Admin Login"
        description={`Secure admin access for ${siteConfig.appName} to manage supporters, donations, and transparency data.`}
      />

      <div className="mx-auto max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/30">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-300">
            <FiLock className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
              Secure Access
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Admin Login</h1>
          </div>
        </div>

        <p className="mb-6 text-sm text-slate-400">
          This page is restricted to authenticated administrators only. Use the
          direct URL to access the admin dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="admin-password"
            className="block text-sm font-medium text-slate-200"
          >
            Admin Password
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            placeholder="Enter admin password"
            autoComplete="current-password"
          />

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Continue to dashboard
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="mt-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <FiArrowLeft className="h-4 w-4" />
          Return to website
        </button>
      </div>
    </div>
  );
}