import { useLang } from "../i18n";

export default function Nav() {
  const { t, lang, setLang } = useLang();
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="flex items-center justify-between px-5 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white md:px-10">
        <a href="#top" className="link-line">
          DELETED<span className="text-cyan2 mix-blend-normal">ROOT</span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          <a className="link-line" href="#beats">{t.nav.beats}</a>
          <a className="link-line" href="#prices">{t.nav.prices}</a>
          <a className="link-line" href="#about">{t.nav.about}</a>
          <a className="link-line" href="#contact">{t.nav.contact}</a>
        </div>
        <button
          onClick={() => setLang(lang === "en" ? "ru" : "en")}
          className="border border-white/60 px-2 py-1 hover:bg-white hover:text-black"
          data-cursor
        >
          {lang === "en" ? "RU" : "EN"}
        </button>
      </nav>
    </header>
  );
}
