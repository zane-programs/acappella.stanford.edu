import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/app/lib/cn";

export type ProseTone = "default" | "on-cardinal";

export interface ProseProps extends ComponentPropsWithoutRef<"div"> {
  tone?: ProseTone;
}

/**
 * Typographic wrapper for long-form copy: group bios, About, Privacy. Styles
 * plain <p>, <a>, <ul>, <h2>… children as well as legacy Chakra `.chakra-*`
 * class names so existing bio components render correctly during migration.
 */
export function Prose({ tone = "default", className, ...rest }: ProseProps) {
  return (
    <div
      className={cn(
        "type-body max-w-[68ch]",
        "[&_p]:mb-5 [&_p:last-child]:mb-0",
        "[&_h2]:type-h2 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2:first-child]:mt-0",
        "[&_h3]:type-h3 [&_h3]:mt-8 [&_h3]:mb-3",
        "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1.5",
        "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_strong]:font-semibold",
        "[&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:decoration-1 [&_a]:transition-colors [&_a]:duration-150",
        tone === "default"
          ? "text-black [&_a]:text-digital-red [&_a:hover]:text-digital-red-light"
          : "text-white/90 [&_a]:text-white [&_a:hover]:text-white/80",
        className
      )}
      {...rest}
    />
  );
}
