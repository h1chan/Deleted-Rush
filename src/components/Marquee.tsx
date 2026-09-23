import type { CSSProperties } from "react";

export default function Marquee({
  items,
  reverse,
  speed = 30,
  className = "",
}: {
  items: string[];
  reverse?: boolean;
  speed?: number;
  className?: string;
}) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className={`relative overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className={`marquee-track ${reverse ? "reverse" : ""}`}
        style={{ "--marquee-speed": `${speed}s` } as CSSProperties}
      >
        {row.map((it, i) => (
          <span key={i} className="mx-3 inline-flex items-center gap-3">
            <span>{it}</span>
            <span className="inline-block h-2 w-2 rotate-45 bg-current opacity-60" />
          </span>
        ))}
      </div>
    </div>
  );
}
