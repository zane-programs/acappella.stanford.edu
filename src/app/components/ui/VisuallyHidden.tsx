import type { ComponentPropsWithoutRef } from "react";

/** Screen-reader-only text. */
export function VisuallyHidden({ children, ...rest }: ComponentPropsWithoutRef<"span">) {
  return (
    <span className="sr-only" {...rest}>
      {children}
    </span>
  );
}
