/**
 * Tiered vw font-size classes for big uppercase display headings.
 * Archivo Black uppercase averages ~0.62em per glyph, so a fixed vw size
 * overflows narrow screens for long titles (e.g. "ТЕРМИНАЛЫ_ЛИЦЕНЗИЙ" at
 * 13vw would need ~145vw). Pick a tier by title length instead.
 */
export function displayFit(s: string): string {
  const n = s.length;
  if (n > 15) return "text-[7.5vw] md:text-[6.5vw]";
  if (n > 12) return "text-[9.5vw] md:text-[7.5vw]";
  if (n > 9) return "text-[11vw] md:text-[8vw]";
  return "text-[13vw] md:text-[8vw]";
}
