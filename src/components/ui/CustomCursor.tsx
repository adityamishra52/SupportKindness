import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { damping: 30, stiffness: 260 });
  const smoothY = useSpring(y, { damping: 30, stiffness: 260 });

  useEffect(() => {
    if (window.innerWidth < 1024) return;
    setEnabled(true);
    const onMove = (event: MouseEvent) => {
      x.set(event.clientX - 12);
      y.set(event.clientY - 12);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return <motion.div style={{ x: smoothX, y: smoothY }} className="pointer-events-none fixed z-[80] h-6 w-6 rounded-full border border-emerald-400/70 bg-emerald-200/20 backdrop-blur" />;
}