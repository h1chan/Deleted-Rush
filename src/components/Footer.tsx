import { useLang } from "../i18n";
import { LINKS } from "../data";

export default function Footer() {
  const { t } = useLang();
  const links = [
    ["DISCORD", LINKS.discord],
    ["INSTAGRAM", LINKS.instagram],
    ["SOUNDCLOUD", LINKS.soundcloud],
    ["UNTITLED", LINKS.untitled],
    ["EMAIL", `mailto:${LINKS.email}`],
  ];

  return (
    <footer id="contact" className="relative mt-10 bg-ink px-5 py-16 text-white md:px-10">
      <h2 className="font-display text-[12vw] font-black uppercase leading-none md:text-[7vw]">
        {t.footer.title}
      </h2>

      <div className="mt-10 grid gap-3">
        {links.map(([label, href], i) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-baseline justify-between border-b border-white/15 pb-3 transition-colors hover:text-holo"
          >
            <span className="flex items-baseline gap-4">
              <span className="font-mono text-[10px] opacity-40">0{i + 1}</span>
              <span className="font-display text-3xl font-black uppercase tracking-tight transition-transform group-hover:translate-x-3 md:text-5xl">
                {label}
              </span>
            </span>
            <span className="font-mono text-xl opacity-50 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>
        ))}
      </div>

      <a
        href={`mailto:${LINKS.email}`}
        className="mt-10 block break-all font-mono text-sm tracking-widest text-holo"
      >
        {t.footer.email}
      </a>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.3em] opacity-40">
        <span>{t.footer.rights}</span>
        <span>KAZAKHSTAN // 51°10'N 71°26'E</span>
        <span>{t.footer.made} ▓</span>
      </div>
    </footer>
  );
}
