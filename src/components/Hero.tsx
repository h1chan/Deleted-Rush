import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLang } from "../i18n";
import { asset } from "../data";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString("en-GB");
}

/** Subtle magnetic pull towards the cursor for hero CTAs. */
function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14 });
  const sy = useSpring(y, { stiffness: 180, damping: 14 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const { t } = useLang();
  const clock = useClock();
  const { scrollY } = useScroll();
  const yTitle = useTransform(scrollY, [0, 600], [0, -120]);
  const yCover = useTransform(scrollY, [0, 600], [0, 90]);
  const rot = useTransform(scrollY, [0, 800], [0, 10]);
  const [strike, setStrike] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setStrike(true), 900);
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-10 pt-24 md:px-10"
    >
      {/* coordinates / micro data */}
      <div className="pointer-events-none absolute left-1/2 top-24 hidden font-mono text-[10px] tracking-widest opacity-60 md:block">
        51°10'N · 71°26'E — {clock} — LOCAL SIGNAL
      </div>
      <div className="pointer-events-none absolute right-6 top-1/3 hidden rotate-90 font-jp text-xs tracking-[0.5em] opacity-50 md:block">
        {t.hero.jp2}
      </div>

      {/* floating cover */}
      <motion.div
        style={{ y: yCover, rotate: rot }}
        className="pointer-events-none absolute right-[6%] top-[16%] z-10 w-[36vw] max-w-[420px] md:right-[10%]"
        initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: 0.3 }}
      >
        <div className="relative overflow-hidden shadow-[0_30px_80px_-20px_rgba(10,100,140,0.45)]">
          <img
            src={asset("img/cover.webp")}
            alt="DELETEDROOT cover"
            className="block w-full"
            decoding="async"
            fetchPriority="high"
          />
          <div className="holo-sheen absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between bg-ink/85 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ice">
            <span>CD-R / LOST MEDIA</span>
            <span>TRK.05</span>
          </div>
        </div>
        <div className="mt-2 text-right font-mono text-[9px] uppercase tracking-widest opacity-50">
          FIG.01 — DELETEDROOT
        </div>
      </motion.div>

      {/* crossing lines (reference style) */}
      <motion.div
        className="absolute left-[8%] top-[18%] h-px w-[46vw] origin-left bg-ink/60"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1, rotate: 24 }}
        transition={{ duration: 1.4, delay: 0.6 }}
      />
      <motion.div
        className="absolute right-[12%] top-[12%] h-[42vh] w-px origin-top bg-ink/60"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1, rotate: -14 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      />
      <motion.div
        className="absolute left-[46%] bottom-[14%] h-3 w-3 bg-cyan2"
        animate={{ y: [0, -10, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="z-10 font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
        {t.hero.kicker}
      </div>

      {/* main title */}
      <motion.div style={{ y: yTitle }} className="relative z-10">
        <motion.h1
          className="glitch whitespace-nowrap font-display text-[13vw] font-black uppercase leading-[0.82] tracking-tight md:text-[10.5vw]"
          data-text={"DELETEDROOT,"}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className={`strike ${strike ? "on" : ""}`}>DELETED</span>
          <span className="text-cyan2">ROOT</span>
          <span className="text-outline">,</span>
        </motion.h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em]">
          <span className="border border-ink px-2 py-1">{t.hero.tagline}</span>
          <span className="opacity-60">{t.hero.mic2}</span>
        </div>

        <p className="mt-6 max-w-xs font-jp text-xs leading-relaxed opacity-60">
          {t.hero.jp1}
        </p>
      </motion.div>

      {/* bottom row */}
      <div className="z-10 mt-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
        <span className="opacity-60 max-w-[220px]">{t.hero.mic1}</span>
        <Magnetic>
          <motion.a
            href="#beats"
            className="group flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-white transition-colors hover:bg-cyan2 hover:border-cyan2"
            whileTap={{ scale: 0.97 }}
          >
            {t.hero.listen}
            <span className="blink">▸</span>
          </motion.a>
        </Magnetic>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.4em] opacity-40">
        {t.hero.scroll} ↓
      </div>
    </section>
  );
}
