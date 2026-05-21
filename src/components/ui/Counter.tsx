import { useEffect, useState } from "react";

export function Counter({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const maxFrame = 48;
    const timer = window.setInterval(() => {
      frame += 1;
      setDisplay(Math.round((value * frame) / maxFrame));
      if (frame >= maxFrame) window.clearInterval(timer);
    }, 22);
    return () => window.clearInterval(timer);
  }, [value]);

  return (
    <div className="glass-surface rounded-2xl p-6 shadow-xl shadow-cyan-900/10 dark:shadow-cyan-900/20">
      <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">{display}+</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}
