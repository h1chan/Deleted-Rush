import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TRACKS, orderDm } from "../data";
import { subscribe, playTrack, seek, getFreqArray } from "../audio/engine";
import type { EngineState } from "../audio/engine";
import { useLang } from "../i18n";

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Spectrum() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const g = c.getContext("2d")!;
    let raf = 0;
    const draw = () => {
      const w = (c.width = c.offsetWidth * 2);
      const h = (c.height = c.offsetHeight * 2);
      g.clearRect(0, 0, w, h);
      const data = getFreqArray();
      const bars = 48;
      for (let i = 0; i < bars; i++) {
        const v = data ? data[Math.floor((i / bars) * 60)] / 255 : 0.06;
        const bh = Math.max(2, v * h);
        g.fillStyle = i % 7 === 0 ? "#ff2e4d" : "#0aa8c4";
        g.fillRect((i * w) / bars, h - bh, w / bars - 3, bh);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="h-10 w-full" />;
}

export default function Beats() {
  const { t } = useLang();
  const [st, setSt] = useState<EngineState>({
    currentSrc: null,
    playing: false,
    time: 0,
    duration: 0,
  });
  useEffect(() => subscribe(setSt), []);

  const currentIdx = TRACKS.findIndex((x) => x.file === st.currentSrc);

  return (
    <section id="beats" className="relative px-5 py-24 md:px-10">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.35em] opacity-50">
        {t.beats.sub}
      </div>
      <h2 className="glitch mb-10 font-display text-[13vw] font-black uppercase leading-none md:text-[8vw]" data-text={t.beats.title}>
        {t.beats.title}
      </h2>

      <div className="grid gap-0 border-y border-ink/80">
        {TRACKS.map((tr, i) => {
          const active = currentIdx === i;
          return (
            <motion.button
              key={tr.id}
              onClick={() => playTrack(tr.file)}
              className={`group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-ink/20 px-2 py-5 text-left transition-colors md:grid-cols-[60px_auto_1fr_auto_auto] md:px-4 ${
                active ? "bg-ink text-white" : "hover:bg-ink/5"
              }`}
              whileTap={{ scale: 0.99 }}
              data-cursor
            >
              <span className="font-mono text-[10px] opacity-50">{tr.id}</span>
              <span
                className={`flex h-8 w-8 items-center justify-center border font-mono text-xs ${
                  active ? "border-white" : "border-ink"
                }`}
              >
                {active && st.playing ? "❚❚" : "▸"}
              </span>
              <span className="flex flex-col">
                <span className="font-display text-2xl font-black uppercase tracking-tight md:text-4xl">
                  {tr.title}
                  {tr.collab && (
                    <span className="ml-2 text-xs font-normal text-cyan2 md:text-sm">
                      + {tr.collab}
                    </span>
                  )}
                </span>
                {active && st.playing && (
                  <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-holo">
                    {t.beats.playing} — {fmt(st.time)}
                  </span>
                )}
              </span>
              <span className="hidden font-mono text-[11px] opacity-60 md:block">
                {tr.bpm} {t.beats.bpm}
              </span>
              <span className="hidden border border-current px-2 py-1 font-mono text-[9px] tracking-widest opacity-70 transition-opacity group-hover:opacity-100 md:block">
                {tr.priceTag}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* player dock */}
      <AnimatePresence>
        {st.currentSrc && currentIdx >= 0 && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="sticky bottom-4 z-40 mt-8 border border-ink bg-white/85 shadow-[8px_8px_0_#0a0a0b] backdrop-blur"
          >
            <div className="flex items-center gap-3 px-3 py-2 md:gap-6 md:px-5">
              <img
                src="/img/cover.png"
                alt=""
                className={`h-10 w-10 object-cover ${st.playing ? "animate-[spin_6s_linear_infinite]" : ""}`}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-sm font-black uppercase">
                  {TRACKS[currentIdx].title}
                  {TRACKS[currentIdx].collab && (
                    <span className="ml-2 text-[10px] font-normal text-cyan2">
                      + {TRACKS[currentIdx].collab}
                    </span>
                  )}
                </div>
                <div
                  className="relative mt-1 h-1 w-full cursor-pointer bg-ink/15"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const p = (e.clientX - r.left) / r.width;
                    seek(p * (st.duration || 0));
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-cyan2"
                    style={{ width: `${(st.time / (st.duration || 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="hidden w-40 md:block">
                <Spectrum />
              </div>
              <span className="font-mono text-[10px] opacity-60">
                {fmt(st.time)} / {fmt(st.duration)}
              </span>
              <button
                onClick={() => playTrack(TRACKS[currentIdx].file)}
                className="border border-ink px-3 py-1 font-mono text-xs hover:bg-ink hover:text-white"
              >
                {st.playing ? "❚❚" : "▸"}
              </button>
              <a
                href={orderDm(`"${TRACKS[currentIdx].title}"`)}
                target="_blank"
                rel="noreferrer"
                className="hidden bg-ink px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white hover:bg-cyan2 md:block"
              >
                {t.beats.buyCta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
