import { cn } from "@/app/lib/cn";

export type WordmarkTone = "cardinal" | "white" | "inherit";
export type WordmarkSize = "sm" | "md" | "lg";

export interface WordmarkProps {
  tone?: WordmarkTone;
  size?: WordmarkSize;
  className?: string;
}

const SIZE: Record<WordmarkSize, { stanford: string; rest: string; rule: string; gap: string }> = {
  sm: { stanford: "text-[1.35rem]", rest: "text-[1.05rem]", rule: "h-[1.1rem] -top-[0.05rem]", gap: "gap-2" },
  md: { stanford: "text-[1.7rem]", rest: "text-[1.3rem]", rule: "h-[1.4rem] -top-[0.07rem]", gap: "gap-2.5" },
  lg: {
    stanford: "text-[2.6rem] sm:text-[3.2rem]",
    rest: "text-[2rem] sm:text-[2.45rem]",
    rule: "h-[2.2rem] -top-[0.1rem] sm:h-[2.7rem] sm:-top-[0.13rem]",
    gap: "gap-3 sm:gap-4",
  },
};

/*
 * Optical alignment (measured 2026-09-16 with canvas measureText + a pixel
 * scan of the wordmark font):
 *
 * The Stanford wordmark font draws its letters 0.21em ABOVE the alphabetic
 * baseline (x-height band 0.21–0.655em, ascenders to 0.905em, no descenders),
 * while Source Serif 4 sits on the baseline (x-height 0.504em, descenders
 * -0.232em). With `items-center leading-none` the Stanford x-height band lands
 * on the flex centre line but "A Cappella"'s x-height band sits ~0.09em of its
 * own size below it (1.5px sm / 1.9px md / 3.5px lg), so the serif word looked
 * sunk. `-top-[0.09em]` on the serif span centres the two x-height bands within
 * ±0.8px at every size and leaves the baselines within 1px. The rule is then
 * nudged up per size so it is centred on the combined glyph box (Stanford
 * ascender top to "pp" descender bottom), not on the Stanford line box.
 */
const REST_NUDGE = "relative -top-[0.09em]";

/**
 * The "Stanford | A Cappella" lockup. "Stanford" is the only place the local
 * Stanford wordmark font is used (docs/DESIGN.md §3). Wrap it in a link
 * yourself; it renders inline content only.
 */
export function Wordmark({ tone = "cardinal", size = "md", className }: WordmarkProps) {
  const s = SIZE[size];
  const stanfordColor =
    tone === "cardinal" ? "text-cardinal" : tone === "white" ? "text-white" : "text-current";
  const restColor =
    tone === "cardinal" ? "text-black" : tone === "white" ? "text-white" : "text-current";
  const ruleColor =
    tone === "cardinal" ? "bg-black-30" : tone === "white" ? "bg-white/50" : "bg-current opacity-40";

  return (
    <span
      className={cn("inline-flex items-center leading-none whitespace-nowrap select-none", s.gap, className)}
    >
      <span className={cn("font-stanford", s.stanford, stanfordColor)}>Stanford</span>
      <span aria-hidden="true" className={cn("relative w-px shrink-0", s.rule, ruleColor)} />
      <span className={cn("font-serif tracking-[-0.01em]", REST_NUDGE, s.rest, restColor)}>
        A Cappella
      </span>
    </span>
  );
}
