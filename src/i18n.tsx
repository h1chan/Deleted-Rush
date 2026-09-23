import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "ru";

const dict = {
  en: {
    nav: { beats: "BEATS", prices: "PRICES", about: "ABOUT", contact: "CONTACT" },
    hero: {
      kicker: "PRODUCER // SIGNAL 001",
      tagline: "pinknoise — ambient — hyperpop",
      scroll: "SCROLL // DESCEND",
      jp1: "私は消えた。でも音はまだここに残っている。",
      jp2: "笛のように響く、壊れた信号",
      mic1: "when i log off, the static remembers my name.",
      mic2: "based in KAZAKHSTAN // worldwide signal",
      listen: "LATEST TRANSMISSION",
    },
    beats: {
      title: "TRANSMISSIONS",
      sub: "// select transmission to preview",
      bpm: "BPM",
      collab: "WITH",
      playing: "NOW PLAYING",
      buyCta: "ORDER THIS BEAT →",
      upNext: "UP NEXT",
    },
    prices: {
      title: "LICENSE_TERMINALS",
      sub: "// choose your signal depth",
      mp3: "MP3",
      mp3d: "Tagged MP3 for demos, freestyles, previews.",
      wav: "WAV",
      wavd: "Untagged WAV. Release-ready mix quality.",
      ex: "EXCLUSIVE",
      exd: "Beat removed from store. Full rights transferred. Yours alone.",
      mp3f: ["Tagged MP3 320kbps", "Non-profit use", "Instant delivery"],
      wavf: ["Untagged WAV + MP3", "Release-ready quality", "Monetized streams"],
      exf: ["Full rights transfer", "Trackouts / stems", "Removed from store forever"],
      order: "ORDER VIA DM",
      note: "purchased via direct message — discord / instagram",
    },
    about: {
      title: "ABOUT_0x",
      body1: "DELETEDROOT — producer from KAZAKHSTAN crafting pinknoise, ambient and hyperpop transmissions.",
      body2: "Broken signals, glass textures, melodies that feel like a memory you never had.",
      stat1: "BASE", stat1v: "KAZAKHSTAN",
      stat2: "GENRES", stat2v: "PINKNOISE / AMBIENT / HYPERPOP",
      stat3: "STATUS", stat3v: "ONLINE — TAKING ORDERS",
      jp: "名前を消しても、音は残る。",
    },
    footer: {
      title: "CONTACT_CHANNELS",
      email: "deletedroot@gmail.com",
      rights: "© DELETEDROOT — all signals reserved",
      made: "transmission ends here",
    },
  },
  ru: {
    nav: { beats: "БИТЫ", prices: "ЦЕНЫ", about: "О НЁМ", contact: "КОНТАКТ" },
    hero: {
      kicker: "ПРОДЮСЕР // СИГНАЛ 001",
      tagline: "pinknoise — ambient — hyperpop",
      scroll: "СКРОЛЛЬ // ВНИЗ",
      jp1: "私は消えた。でも音はまだここに残っている。",
      jp2: "笛のように響く、壊れた信号",
      mic1: "когда я выхожу из сети, шум запоминает моё имя.",
      mic2: "из КАЗАХСТАНА // сигнал на весь мир",
      listen: "ПОСЛЕДНЯЯ ПЕРЕДАЧА",
    },
    beats: {
      title: "ТРАНСМИССИИ",
      sub: "// выбери трансмиссию для прослушивания",
      bpm: "BPM",
      collab: "FT.",
      playing: "ИГРАЕТ",
      buyCta: "ЗАКАЗАТЬ ЭТОТ БИТ →",
      upNext: "ДАЛЕЕ",
    },
    prices: {
      title: "ТЕРМИНАЛЫ_ЛИЦЕНЗИЙ",
      sub: "// выбери глубину сигнала",
      mp3: "MP3",
      mp3d: "MP3 с тегом — для демо, фристайлов, превью.",
      wav: "WAV",
      wavd: "WAV без тега. Качество для релиза.",
      ex: "EXCLUSIVE",
      exd: "Бит снимается с продажи. Полные права — только тебе.",
      mp3f: ["MP3 320kbps с тегом", "Некоммерческое использование", "Мгновенная доставка"],
      wavf: ["WAV + MP3 без тега", "Качество для релиза", "Монетизация стримов"],
      exf: ["Полная передача прав", "Стемы / трекауты", "Снимается с продажи навсегда"],
      order: "ЗАКАЗ В ДИРЕКТ",
      note: "заказ через личку — discord / instagram",
    },
    about: {
      title: "ОБ_0xAUTORE",
      body1: "DELETEDROOT — продюсер из КАЗАХСТАНА: pinknoise, ambient и hyperpop-трансмиссии.",
      body2: "Сломанные сигналы, стеклянные текстуры, мелодии как память, которой не было.",
      stat1: "БАЗА", stat1v: "КАЗАХСТАН",
      stat2: "ЖАНРЫ", stat2v: "PINKNOISE / AMBIENT / HYPERPOP",
      stat3: "СТАТУС", stat3v: "В СЕТИ — ПРИНИМАЮ ЗАКАЗЫ",
      jp: "名前を消しても、音は残る。",
    },
    footer: {
      title: "КАНАЛЫ_СВЯЗИ",
      email: "deletedroot@gmail.com",
      rights: "© DELETEDROOT — все сигналы защищены",
      made: "передача завершена",
    },
  },
};

export type Dict = typeof dict.en;

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: dict.en });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangCtx.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </LangCtx.Provider>
  );
}

export const useLang = () => useContext(LangCtx);
