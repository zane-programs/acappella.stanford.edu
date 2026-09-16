import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/app/lib/cn";

export type EyebrowTone = "muted" | "cardinal" | "white";

export interface EyebrowProps extends ComponentPropsWithoutRef<"p"> {
  tone?: EyebrowTone;
  as?: "p" | "span" | "div";
}

const TONE: Record<EyebrowTone, string> = {
  muted: "text-black-70",
  cardinal: "text-cardinal",
  white: "text-white/80",
};

/** Small uppercase section label ("The groups", "Featured event"). */
export function Eyebrow({ tone = "muted", as = "p", className, ...rest }: EyebrowProps) {
  const Tag = as;
  return <Tag className={cn("type-eyebrow", TONE[tone], className)} {...rest} />;
}
