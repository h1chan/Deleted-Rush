# DELETEDROOT,

> pinknoise / ambient / hyperpop — beat transmissions from KAZAKHSTAN

**[▸ LIVE SITE](https://h1chan.github.io/Deleted-Rush/)**

![stack](https://img.shields.io/badge/react-19-0aa8c4?style=flat-square)
![stack](https://img.shields.io/badge/vite-6-0aa8c4?style=flat-square)
![stack](https://img.shields.io/badge/tailwind-3-0aa8c4?style=flat-square)
![stack](https://img.shields.io/badge/webgl-shaders-ff2e4d?style=flat-square)
![deploy](https://img.shields.io/badge/deploy-github%20pages-c8ff2e?style=flat-square)

Портфолио-витрина битмейкера: интерактивный плеер с WebGL-фоном, реагирующим на музыку,
в эстетике lost media / сломанного сигнала.

---

## ▸ Features

- **Audio engine** — единый `<audio>` + WebAudio analyser, общий для плеера и фона
- **Reactive WebGL marble** — liquid-marble шейдер пульсирует от басса трека
- **Player dock** — seek, prev/next, автопереход к следующему треку, live-спектр
- **Boot preloader** — заставка «SIGNAL ACQUIRED» с прогрессом
- **Custom cursor**, glitch-заголовки, marquee-ленты, magnetic-кнопки
- **i18n** — EN / RU переключение
- **A11y** — `prefers-reduced-motion`, focus-visible, семантика
- **CI/CD** — автодеплой на GitHub Pages при пуше в `main`

## ▸ Stack

| Layer  | Tech                                    |
| ------ | --------------------------------------- |
| UI     | React 19 + TypeScript                   |
| Motion | framer-motion                           |
| Styles | Tailwind CSS 3                          |
| GFX    | Raw WebGL (GLSL fragment shader)        |
| Audio  | Web Audio API (`AnalyserNode`)          |
| Build  | Vite 6                                  |

## ▸ Develop

```bash
npm install
npm run dev        # dev server
npm run build      # type-check + production build → dist/
npm run preview    # preview the production build
```

## ▸ Deploy (GitHub Pages)

Деплой автоматический: workflow `.github/workflows/deploy.yml` собирает `dist/`
и публикует на Pages при каждом пуше в `main`.

Одноразовая настройка в репозитории:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

Сайт живёт по адресу `https://h1chan.github.io/Deleted-Rush/`
(base path задан в `vite.config.ts`).

## ▸ Structure

```
src/
├── audio/engine.ts          # singleton audio engine + analyser
├── components/
│   ├── MarbleBackground.tsx # WebGL liquid-marble, audio-reactive
│   ├── Preloader.tsx        # boot sequence
│   ├── Hero.tsx             # title, magnetic CTA, orbit badge
│   ├── Beats.tsx            # track list + player dock + spectrum
│   ├── Prices.tsx           # license tiers
│   ├── About / Footer / Nav / Marquee / Cursor
├── data.ts                  # tracks, links, asset() helper
└── i18n.tsx                 # EN / RU dictionary
public/
├── audio/*.mp3              # transmissions
└── img/cover.png
```

## ▸ Licensing

MP3 **$10** · WAV **$30** · EXCLUSIVE **$100** — заказ через DM:
[instagram](https://www.instagram.com/deleted_formatt/) / discord.

---

`© DELETEDROOT — all signals reserved`
