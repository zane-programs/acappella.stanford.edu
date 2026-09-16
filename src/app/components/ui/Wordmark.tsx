import { cn } from "@/app/lib/cn";

export type WordmarkTone = "cardinal" | "white" | "inherit";
export type WordmarkSize = "sm" | "md" | "lg";

export interface WordmarkProps {
  tone?: WordmarkTone;
  size?: WordmarkSize;
  className?: string;
}

const SIZE: Record<WordmarkSize, { stanford: string; rest: string; rule: string; gap: string }> = {
  sm: { stanford: "text-[1.35rem]", rest: "text-[1.05rem]", rule: "h-[1.1rem]", gap: "gap-2" },
  md: { stanford: "text-[1.7rem]", rest: "text-[1.3rem]", rule: "h-[1.4rem]", gap: "gap-2.5" },
  lg: { stanford: "text-[2.6rem] sm:text-[3.2rem]", rest: "text-[2rem] sm:text-[2.45rem]", rule: "h-[2.2rem] sm:h-[2.7rem]", gap: "gap-3 sm:gap-4" },
};

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
      <span aria-hidden="true" className={cn("w-px shrink-0", s.rule, ruleColor)} />
      <span className={cn("font-serif tracking-[-0.01em]", s.rest, restColor)}>A Cappella</span>
    </span>
  );
}
