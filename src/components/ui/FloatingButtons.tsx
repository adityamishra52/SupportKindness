import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { externalLinkProps, siteConfig } from "@/config/siteConfig";

export function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 240);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-4">
      {siteConfig.whatsapp && (
        <a
          href={siteConfig.whatsapp}
          {...externalLinkProps}
          className="rounded-full bg-emerald-500 p-3 text-white shadow-xl shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-600"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={20} />
        </a>
      )}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-full bg-slate-900 p-3 text-white shadow-xl shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
