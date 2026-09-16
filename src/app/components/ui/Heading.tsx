import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/app/lib/cn";

export type HeadingSize = "display" | "h1" | "h2" | "h3";
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

export interface HeadingProps extends ComponentPropsWithoutRef<"h2"> {
  as?: HeadingTag;
  size?: HeadingSize;
}

const SIZE: Record<HeadingSize, string> = {
  display: "type-display",
  h1: "type-h1",
  h2: "type-h2",
  h3: "type-h3",
};

/** Semantic tag and visual size are independent: `<Heading as="h1" size="display">`. */
export function Heading({ as = "h2", size = "h2", className, ...rest }: HeadingProps) {
  const Tag = as;
  return <Tag className={cn(SIZE[size], "text-balance", className)} {...rest} />;
}
