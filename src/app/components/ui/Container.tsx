import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/app/lib/cn";

export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  /** Rendered element, e.g. "section", "nav". Default "div". */
  as?: ElementType;
}

/** Centered, max-width 1440px, responsive side gutters (docs/DESIGN.md §3). */
export function Container({ as: Tag = "div", className, ...rest }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-20",
        className
      )}
      {...rest}
    />
  );
}
