import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "ESTABLISHING SIGNAL...",
  "CALIBRATING FREQUENCIES...",
  "SIGNAL ACQUIRED",
];

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const start = performance.now();
    let raf = 0;
    let finishTimer = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setProgress(Math.floor(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        finishTimer = window.setTimeout(() => setDone(true), 400);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(finishTimer);
    };
  }, []);

  const line =
    progress < 40 ? BOOT_LINES[0] : progress < 90 ? BOOT_LINES[1] : BOOT_LINES[2];

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink text-white"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          aria-hidden
        >
          <div className="mb-6 font-display text-4xl font-black uppercase tracking-tight md:text-6xl">
            DELETED<span className="text-cyan2">ROOT</span>
            <span className="text-outline text-white/0 [-webkit-text-stroke:1.5px_#fff]">,</span>
          </div>

          <div className="w-56 md:w-72">
            <div className="h-px w-full bg-white/20">
              <div
                className="h-full bg-cyan2 transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
              <span>{line}</span>
              <span>{String(progress).padStart(3, "0")}%</span>
            </div>
          </div>

          <div className="absolute bottom-8 font-mono text-[9px] uppercase tracking-[0.4em] opacity-40">
            51°10'N · 71°26'E
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
