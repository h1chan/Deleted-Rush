import { motion } from "framer-motion";
import { useLang } from "../i18n";
import { LINKS, orderDm } from "../data";
import SectionHeading from "./SectionHeading";

export default function Prices() {
  const { t } = useLang();

  const tiers = [
    {
      key: "mp3",
      name: t.prices.mp3,
      price: "$10",
      desc: t.prices.mp3d,
      features: t.prices.mp3f,
      code: "LIC/MP3",
    },
    {
      key: "wav",
      name: t.prices.wav,
      price: "$30",
      desc: t.prices.wavd,
      features: t.prices.wavf,
      code: "LIC/WAV",
      best: true,
    },
    {
      key: "ex",
      name: t.prices.ex,
      price: "$100",
      desc: t.prices.exd,
      features: t.prices.exf,
      code: "LIC/EXCL",
    },
  ];

  return (
    <section id="prices" className="relative px-5 py-24 md:px-10">
      <SectionHeading title={t.prices.title} sub={t.prices.sub} />

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.key}
            initial={{ opacity: 0, y: 50, rotate: i % 2 ? 1.5 : -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1 : -1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.1, type: "spring", damping: 20 }}
            whileHover={{ y: -10, rotate: 0 }}
            className={`group relative border p-6 shadow-[8px_8px_0_#0a0a0b] ${
              tier.best
                ? "border-ink bg-ink text-white"
                : "border-ink bg-white/80 backdrop-blur"
            }`}
          >
            {tier.best && (
              <span className="absolute -top-3 left-4 bg-acid px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-ink">
                RECOMMENDED
              </span>
            )}
            <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-widest opacity-60">
              <span>{tier.code}</span>
              <span>{i + 1}/3</span>
            </div>
            <h3 className="mt-6 font-display text-5xl font-black uppercase">
              {tier.name}
            </h3>
            <div
              className={`mt-2 font-display text-7xl font-black tracking-tight ${
                tier.best ? "text-holo" : "text-cyan2"
              }`}
            >
              {tier.price}
            </div>
            <p className="mt-4 font-mono text-xs leading-relaxed opacity-80">
              {tier.desc}
            </p>
            <ul className="mt-4 min-h-[72px] space-y-1.5">
              {tier.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider opacity-80"
                >
                  <span className={tier.best ? "text-holo" : "text-cyan2"}>▸</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={orderDm(`${tier.name} license`)}
              target="_blank"
              rel="noreferrer"
              className={`mt-6 block border px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.25em] transition-colors ${
                tier.best
                  ? "border-holo text-holo hover:bg-holo hover:text-ink"
                  : "border-ink hover:bg-ink hover:text-white"
              }`}
            >
              {t.prices.order} →
            </a>
          </motion.div>
        ))}
      </div>

      <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">
        {t.prices.note} —{" "}
        <a className="link-line" href={LINKS.discord} target="_blank" rel="noreferrer">
          discord
        </a>{" "}
        /{" "}
        <a className="link-line" href={LINKS.instagram} target="_blank" rel="noreferrer">
          instagram
        </a>
      </p>
    </section>
  );
}
