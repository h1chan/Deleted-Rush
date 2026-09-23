import { motion } from "framer-motion";

/** Shared section heading: mono sub-label + glitch title with a
 *  clip reveal as it scrolls into view. */
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
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 0.5, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-2 font-mono text-[10px] uppercase tracking-[0.35em]"
        >
          {sub}
        </motion.div>
      )}
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className={`glitch font-display text-[13vw] font-black uppercase leading-none md:text-[8vw] ${
            light ? "text-white" : ""
          }`}
          data-text={title}
        >
          {title}
        </motion.h2>
      </div>
    </div>
  );
}
