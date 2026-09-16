import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/app/lib/cn";

/**
 * Icon + text line used for event details (date, location, ...).
 * Renders an `<li>`; wrap a group of them in a `<ul>`.
 */
export default function InfoRow({
  icon,
  className,
  children,
}: PropsWithChildren<{ icon: ReactNode; className?: string }>) {
  return (
    <li className={cn("flex items-start gap-2", className)}>
      <span
        aria-hidden="true"
        className="mt-[0.2em] inline-flex shrink-0 text-[1.1em] opacity-80"
      >
        {icon}
      </span>
      <span className="flex-1 font-semibold">{children}</span>
    </li>
  );
}
