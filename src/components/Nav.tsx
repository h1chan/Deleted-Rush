import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "../i18n";

export default function Nav() {
  const { t, lang, setLang } = useLang();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [open, setOpen] = useState(false);

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    ["#beats", t.nav.beats],
    ["#prices", t.nav.prices],
    ["#about", t.nav.about],
    ["#contact", t.nav.contact],
  ] as const;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] mix-blend-difference">
        <nav className="flex items-center justify-between px-5 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white md:px-10">
          <a href="#top" className="link-line" onClick={() => setOpen(false)}>
            DELETED<span className="text-cyan2 mix-blend-normal">ROOT</span>
          </a>
          <div className="hidden items-center gap-6 md:flex">
            {links.map(([href, label]) => (
              <a key={href} className="link-line" href={href}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "ru" : "en")}
              className="border border-white/60 px-2 py-1 transition-colors hover:bg-white hover:text-black"
              data-cursor
            >
              {lang === "en" ? "RU" : "EN"}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="border border-white/60 px-2 py-1 transition-colors hover:bg-white hover:text-black md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              data-cursor
            >
              {open ? "✕" : "≡"}
            </button>
          </div>
        </nav>
        <motion.div
          style={{ scaleX }}
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-cyan2"
        />
      </header>

      {/* mobile menu — rendered outside the blended header so the ink
          background isn't difference-inverted against the page */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-9 bg-ink md:hidden"
          >
            {links.map(([href, label], i) => (
              <motion.a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06 }}
                className="font-display text-4xl font-black uppercase tracking-tight text-white transition-colors hover:text-holo"
              >
                {label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-10 font-mono text-[9px] uppercase tracking-[0.4em] text-white"
            >
              51°10'N · 71°26'E
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
