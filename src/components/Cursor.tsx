import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let x = -100, y = -100, rx = -100, ry = -100;
    let hovering = false;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      hovering = !!t.closest("a, button, [data-cursor]");
    };
    window.addEventListener("pointermove", move);

    let raf = 0;
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current)
        dot.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      if (ring.current) {
        ring.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px) scale(${
          hovering ? 2.1 : 1
        })`;
        ring.current.style.borderColor = hovering ? "#ff2e4d" : "#0a0a0b";
        ring.current.style.opacity = "0.9";
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ring}
        className="absolute h-8 w-8 rounded-full border border-ink mix-blend-difference will-change-transform"
        style={{ transition: "border-color .2s" }}
      />
      <div ref={dot} className="absolute h-1.5 w-1.5 bg-cyan2" />
    </div>
  );
}
