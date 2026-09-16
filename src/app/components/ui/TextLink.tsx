"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { MdArrowOutward } from "react-icons/md";
import { cn } from "@/app/lib/cn";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { isInternalHref } from "@/app/components/transitions/context";

export type TextLinkTone = "red" | "black" | "white";

export interface TextLinkProps extends ComponentPropsWithoutRef<"a"> {
  href: string;
  tone?: TextLinkTone;
  /** Show the small outward arrow for external destinations. Default: auto. */
  externalIcon?: boolean;
  /** Skip the underline (e.g. for nav-style links that draw their own). */
  plain?: boolean;
}

const TONE: Record<TextLinkTone, string> = {
  red: "text-digital-red hover:text-digital-red-light",
  black: "text-black hover:text-digital-red",
  white: "text-white hover:text-white/80",
};

/** Inline link. Internal hrefs get the page transition; external open in a new tab. */
export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(function TextLink(
  { href, tone = "red", externalIcon, plain, className, children, target, rel, ...rest },
  ref
) {
  const internal = isInternalHref(href);
  const showIcon = externalIcon ?? !internal;
  const classes = cn(
    "inline-flex items-baseline gap-0.5 font-semibold transition-colors duration-150 focus-ring rounded-sm",
    !plain && "underline underline-offset-[3px] decoration-1",
    TONE[tone],
    className
  );
  const inner = (
    <>
      {children}
      {showIcon && (
        <MdArrowOutward aria-hidden="true" className="relative top-[0.12em] inline-block text-[0.9em]" />
      )}
    </>
  );
  if (internal) {
    return (
      <TransitionLink ref={ref} href={href} className={classes} target={target} rel={rel} {...rest}>
        {inner}
      </TransitionLink>
    );
  }
  return (
    <a
      ref={ref}
      href={href}
      className={classes}
      target={target ?? "_blank"}
      rel={rel ?? "noopener noreferrer"}
      {...rest}
    >
      {inner}
    </a>
  );
});
