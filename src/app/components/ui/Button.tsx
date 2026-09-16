"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/app/lib/cn";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { isInternalHref, type SharedImageHandoff } from "@/app/components/transitions/context";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "on-cardinal"
  | "on-cardinal-outline";
export type ButtonSize = "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Internal hrefs render a TransitionLink; external ones an <a target=_blank>. */
  href?: string;
  /** Forwarded to TransitionLink for the shared-image morph. */
  sharedImage?: () => SharedImageHandoff | undefined;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children: ReactNode;
}

export type ButtonProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> &
  Omit<ComponentPropsWithoutRef<"a">, keyof ButtonBaseProps | "type">;

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-cardinal text-white hover:bg-cardinal-light active:bg-cardinal-dark",
  secondary:
    "border border-black-30 bg-transparent text-black hover:border-black hover:bg-fog-light active:bg-fog",
  ghost:
    "bg-transparent text-digital-red underline underline-offset-[3px] decoration-1 hover:text-digital-red-light px-0",
  "on-cardinal":
    "bg-white text-cardinal hover:bg-fog-light active:bg-fog",
  "on-cardinal-outline":
    "border border-white/70 bg-transparent text-white hover:border-white hover:bg-white/10 active:bg-white/15",
};

const SIZE: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      href,
      sharedImage,
      iconLeft,
      iconRight,
      className,
      children,
      ...rest
    },
    ref
  ) {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-sm font-semibold leading-none whitespace-nowrap",
      "transition-colors duration-150 active:translate-y-px focus-ring select-none",
      "disabled:pointer-events-none disabled:opacity-50",
      VARIANT[variant],
      variant === "ghost" ? "h-auto" : SIZE[size],
      className
    );

    const content = (
      <>
        {iconLeft && <span aria-hidden="true" className="inline-flex text-[1.15em]">{iconLeft}</span>}
        <span>{children}</span>
        {iconRight && <span aria-hidden="true" className="inline-flex text-[1.15em]">{iconRight}</span>}
      </>
    );

    if (href) {
      const anchorProps = rest as ComponentPropsWithoutRef<"a">;
      if (isInternalHref(href)) {
        return (
          <TransitionLink
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            sharedImage={sharedImage}
            className={classes}
            {...anchorProps}
          >
            {content}
          </TransitionLink>
        );
      }
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...anchorProps}
        >
          {content}
        </a>
      );
    }

    const buttonProps = rest as ComponentPropsWithoutRef<"button">;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={buttonProps.type ?? "button"}
        className={classes}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);
