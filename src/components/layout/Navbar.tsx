import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiHeart,
  FiMenu,
  FiMoon,
  FiSun,
  FiX,
  FiArrowRight,
} from "react-icons/fi";

import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/siteConfig";

const navItems = [
  {
    label: "Home",
    to: "/",
    seo: "charity homepage",
  },
  {
    label: "About",
    to: "/about",
    seo: "about NGO organization",
  },
  {
    label: "Activities",
    to: "/our-work",
    seo: "charity activities and community support",
  },
  {
    label: "Contact",
    to: "/contact",
    seo: "contact charity organization",
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500",

        theme === "dark"
          ? scrolled
            ? "border-blue-400/10 bg-[#06111f]/85 shadow-2xl shadow-blue-950/30 backdrop-blur-2xl"
            : "border-transparent bg-[#081120]/45 backdrop-blur-xl"
          : scrolled
          ? "border-slate-200/60 bg-white/80 shadow-2xl shadow-slate-200/40 backdrop-blur-2xl"
          : "border-transparent bg-white/10 backdrop-blur-xl"
      )}
    >
      <nav className="mx-auto flex h-[80px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        
        {/* LOGO */}
        <Link
          to="/"
          aria-label={`${siteConfig.appName} homepage`}
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-emerald-500 shadow-xl shadow-cyan-500/30 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
            <FiHeart className="h-5 w-5 text-white" />

            <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div className="hidden flex-col sm:flex">
            <span
              className={cn(
                "text-base font-extrabold tracking-tight transition-colors duration-300",
                theme === "dark" ? "text-cyan-100" : "text-cyan-900"
              )}
            >
              {siteConfig.appName}
            </span>

            <span
              className={cn(
                "text-xs font-medium transition-colors duration-300",
                theme === "dark" ? "text-cyan-200" : "text-slate-600"
              )}
            >
              {siteConfig.tagline}
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-8 md:flex lg:gap-10">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.seo}
              className={({ isActive }) =>
                cn(
                  "group relative text-[15px] font-semibold tracking-wide transition-all duration-300",

                  isActive
                    ? theme === "dark"
                      ? "text-cyan-300"
                      : "text-cyan-600"
                    : theme === "dark"
                    ? "text-slate-200 hover:text-cyan-300"
                    : scrolled
                    ? "text-slate-700 hover:text-cyan-600"
                    : "text-white hover:text-cyan-200"
                )
              }
            >
              {({ isActive }) => (
                <span className="relative flex items-center gap-1">
                  {item.label}

                  <span
                    className={cn(
                      "absolute -bottom-2 left-0 h-[2px] w-full origin-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300",

                      isActive
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                    )}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          
          {/* THEME TOGGLE */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className={cn(
              "group flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5",

              theme === "dark"
                ? "border-blue-400/10 bg-blue-500/10 text-cyan-200 shadow-lg shadow-blue-950/30 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                : "border-slate-200 bg-white/90 text-slate-700 shadow-lg shadow-slate-200/30 hover:border-cyan-400 hover:text-cyan-600"
            )}
          >
            {theme === "light" ? (
              <FiMoon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            ) : (
              <FiSun className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
            )}
          </button>

          {/* SUPPORT BUTTON */}
          <Link
            to="/support-us"
            aria-label="Support NGO donations"
            className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/50 md:inline-flex"
          >
            Support Now
            <FiArrowRight className="h-4 w-4" />
          </Link>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            aria-expanded={open}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-300 md:hidden",

              theme === "dark"
                ? "border-blue-400/10 bg-blue-500/10 text-cyan-200 hover:border-cyan-400 hover:text-cyan-300"
                : "border-slate-200 bg-white/90 text-slate-700 hover:border-cyan-400 hover:text-cyan-600"
            )}
          >
            {open ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "border-t px-5 py-5 shadow-2xl backdrop-blur-2xl md:hidden",

              theme === "dark"
                ? "border-blue-400/10 bg-[#07111f]/95"
                : "border-slate-200/40 bg-white/95"
            )}
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",

                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20"
                        : theme === "dark"
                        ? "bg-slate-900/80 text-slate-100 hover:bg-slate-800 hover:text-cyan-300"
                        : "bg-slate-100 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-5">
              <Link
                to="/support-us"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                Support Now
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
