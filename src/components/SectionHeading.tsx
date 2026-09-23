/** Shared section heading: mono sub-label + glitch title.
 *  Rendered statically visible — no scroll-triggered reveal, so the
 *  heading can never get stuck hidden. */
export default function SectionHeading({
  title,
  sub,
  light,
}: {
  title: string;
  sub?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-10 md:mb-14">
      {sub && (
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.35em] opacity-50">
          {sub}
        </div>
      )}
      <h2
        className={`glitch font-display text-[13vw] font-black uppercase leading-none md:text-[8vw] ${
          light ? "text-white" : ""
        }`}
        data-text={title}
      >
        {title}
      </h2>
    </div>
  );
}
