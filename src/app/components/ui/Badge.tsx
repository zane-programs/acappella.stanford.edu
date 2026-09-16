import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/app/lib/cn";

export type BadgeTone = "neutral" | "open" | "on-cardinal";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  tone?: BadgeTone;
}

const TONE: Record<BadgeTone, string> = {
  neutral: "bg-fog-light text-black-80",
  open: "bg-palo-alto/10 text-palo-alto",
  "on-cardinal": "bg-white/15 text-white ring-1 ring-white/30",
};

/** Small status/category label. The only pill shape allowed in the system. */
export function Badge({ tone = "neutral", className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.1em] leading-none",
        TONE[tone],
        className
      )}
      {...rest}
    >
      {tone === "open" && (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-palo-alto" />
      )}
      {children}
    </span>
  );
}
