import MarbleBackground from "./components/MarbleBackground";
import Cursor from "./components/Cursor";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Beats from "./components/Beats";
import Prices from "./components/Prices";
import About from "./components/About";
import Footer from "./components/Footer";
import Marquee from "./components/Marquee";

export default function App() {
  return (
    <main className="relative">
      <Preloader />
      <MarbleBackground />
      <div className="noise-overlay" />
      <Cursor />
      <Nav />
      <Hero />

      <Marquee
        className="border-y border-ink bg-ink py-2 font-mono text-xs uppercase tracking-[0.3em] text-holo"
        items={[
          "DELETEDROOT",
          "PINKNOISE",
          "AMBIENT",
          "HYPERPOP",
          "MP3 $10",
          "WAV $30",
          "EXCLUSIVE $100",
          "KAZAKHSTAN",
        ]}
        speed={26}
      />

      <Beats />

      <Marquee
        className="border-y border-ink/30 py-2 font-jp text-xs tracking-[0.6em] opacity-60"
        items={[
          "消えた信号",
          "ルートを探して",
          "音は残る",
          "ネオンの下の雪",
        ]}
        speed={42}
        reverse
      />

      <Prices />
      <About />
      <Footer />
    </main>
  );
}
