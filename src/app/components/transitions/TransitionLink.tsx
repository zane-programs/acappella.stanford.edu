"use client";

import Link from "next/link";
import { forwardRef, type ComponentProps, type MouseEvent } from "react";
import {
  isInternalHref,
  useTransitionRouter,
  type SharedImageHandoff,
} from "./context";

export interface TransitionLinkProps extends ComponentProps<typeof Link> {
  /**
   * Called at click time to describe a shared-image handoff (see
   * docs/DESIGN.md §6). Return `undefined` to fall back to the wipe.
   */
  sharedImage?: () => SharedImageHandoff | undefined;
}

/**
 * `next/link` that routes left-clicks through the transition provider.
 * Modifier-clicks, middle-clicks, `target="_blank"` and external hrefs behave
 * like a normal link. Prefetching is unchanged.
 */
export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ href, onClick, sharedImage, target, ...rest }, ref) {
    const { push } = useTransitionRouter();
    const hrefString = typeof href === "string" ? href : href.toString();

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (target && target !== "_self") return;
      if (!isInternalHref(hrefString)) return;

      event.preventDefault();
      push(hrefString, { sharedImage: sharedImage?.() });
    }

    return (
      <Link ref={ref} href={href} target={target} onClick={handleClick} {...rest} />
    );
  }
);
