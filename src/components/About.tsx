import { motion } from "framer-motion";
import { useLang } from "../i18n";
import SectionHeading from "./SectionHeading";

export default function About() {
  const { t } = useLang();
  const stats = [
    [t.about.stat1, t.about.stat1v],
    [t.about.stat2, t.about.stat2v],
    [t.about.stat3, t.about.stat3v],
  ];

  return (
    <section id="about" className="relative px-5 py-24 md:px-10">
      <SectionHeading title={t.about.title} />

      <div className="grid gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="font-display text-2xl font-bold leading-snug md:text-3xl">
            {t.about.body1}
          </p>
          <p className="max-w-md font-mono text-sm leading-relaxed opacity-70">
            {t.about.body2}
          </p>
          <p className="font-jp text-xl opacity-60">「{t.about.jp}」</p>
        </motion.div>

        <div className="border border-ink bg-white/70 backdrop-blur">
          {stats.map(([k, v], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="flex items-center justify-between border-b border-ink/20 px-5 py-5 last:border-b-0"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">
                {k}
              </span>
              <span className="text-right font-mono text-xs font-bold uppercase tracking-widest md:text-sm">
                {v}
              </span>
            </motion.div>
          ))}
          <div className="flex items-center justify-between px-5 py-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">
              SIGNAL
            </span>
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan2">
              <span className="inline-block h-2 w-2 animate-ping rounded-full bg-cyan2" />
              LIVE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
