"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/app/lib/cn";

export type IconButtonTone = "black" | "white" | "cardinal";

export interface IconButtonProps extends ComponentPropsWithoutRef<"button"> {
  /** Required accessible name. */
  label: string;
  tone?: IconButtonTone;
  children: ReactNode;
}

const TONE: Record<IconButtonTone, string> = {
  black: "text-black hover:bg-black/5 active:bg-black/10",
  white: "text-white hover:bg-white/10 active:bg-white/15",
  cardinal: "text-cardinal hover:bg-cardinal/5 active:bg-cardinal/10",
};

/** 44px square hit area, icon-only, always labelled. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, tone = "black", className, children, type, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-sm text-[1.375rem] transition-colors duration-150 focus-ring",
        TONE[tone],
        className
      )}
      {...rest}
    >
      <span aria-hidden="true" className="inline-flex">{children}</span>
    </button>
  );
});
