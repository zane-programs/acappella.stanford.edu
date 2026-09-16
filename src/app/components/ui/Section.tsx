import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/app/lib/cn";
import { Container } from "./Container";

export type SectionTone = "white" | "fog-light" | "fog" | "cardinal";
export type SectionSpacing = "default" | "tight" | "none";

export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  /** Rendered element. Default "section". */
  as?: ElementType;
  tone?: SectionTone;
  spacing?: SectionSpacing;
  /** Set false to render children without the inner Container. */
  contained?: boolean;
  containerClassName?: string;
}

const TONE: Record<SectionTone, string> = {
  white: "bg-white text-black",
  "fog-light": "bg-fog-light text-black",
  fog: "bg-fog text-black",
  cardinal: "bg-cardinal text-white",
};

const SPACING: Record<SectionSpacing, string> = {
  default: "py-16 md:py-24 lg:py-32",
  tight: "py-10 md:py-14 lg:py-16",
  none: "",
};

/** Full-bleed band with tone + vertical rhythm, children inside a Container. */
export function Section({
  as: Tag = "section",
  tone = "white",
  spacing = "default",
  contained = true,
  className,
  containerClassName,
  children,
  ...rest
}: SectionProps) {
  return (
    <Tag className={cn(TONE[tone], SPACING[spacing], className)} {...rest}>
      {contained ? <Container className={containerClassName}>{children}</Container> : children}
    </Tag>
  );
}
