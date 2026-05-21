import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiBarChart2, FiExternalLink, FiGrid, FiLogOut, FiMenu, FiShield, FiX } from "react-icons/fi";
import { siteConfig } from "@/config/siteConfig";
import { clearAdminSession, isAdminSessionValid } from "@/utils/adminAuth";

const navItems = [
  { label: "Overview", to: "/admin", icon: FiGrid, end: true },
  { label: "Leaderboard", to: "/admin/support-us", icon: FiBarChart2 },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAdminSessionValid()) {
      clearAdminSession();
      navigate("/admin/login", { replace: true });
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setMenuOpen(false);
  }, [location.pathname]);

  const pageLabel = useMemo(
    () => navItems.find((item) => location.pathname === item.to)?.label || "Admin",
    [location.pathname]
  );

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  };

  const navigation = (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-cyan-50 text-cyan-800 shadow-sm ring-1 ring-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-200 dark:ring-cyan-400/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
              }`
            }
          >
            <Icon className="h-4 w-4 transition group-hover:scale-110" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-[#0a0d12] dark:text-slate-100">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white/92 px-3 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1117]/95 lg:block">
        <Link to="/admin" className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-100 dark:hover:bg-white/[0.05]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <FiShield className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{siteConfig.appName}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Admin workspace</span>
          </span>
        </Link>

        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/10">
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
          {navigation}
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/10">
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Shortcuts</p>
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <FiExternalLink className="h-4 w-4 transition group-hover:scale-110" />
            View Website
          </Link>
        </div>

        <div className="absolute bottom-4 left-3 right-3 border-t border-slate-200 pt-4 dark:border-white/10">
          <p className="px-3 text-xs text-slate-500 dark:text-slate-400">
            Signed in locally
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1117]/85 lg:ml-64">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 lg:hidden"
              aria-label="Toggle admin navigation"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Admin Panel</p>
              <h1 className="text-base font-bold">{pageLabel}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.07]"
          >
            <FiLogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#0d1117] lg:hidden">
            {navigation}
          </div>
        )}
      </header>

      <main className="lg:ml-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {mounted && <Outlet />}
        </div>
      </main>
    </div>
  );
}
