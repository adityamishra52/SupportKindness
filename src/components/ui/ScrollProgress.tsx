import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return <motion.div style={{ scaleX: scrollYProgress }} className="fixed left-0 top-0 z-[70] h-1 w-full origin-left bg-emerald-500" />;
}