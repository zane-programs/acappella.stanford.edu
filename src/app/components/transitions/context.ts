"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";

/**
 * Describes the image a page hands off to the next page. The provider clones
 * `src` at `from` and animates it onto the element on the new page that has
 * `data-shared-image={slug}`.
 */
export interface SharedImageHandoff {
  slug: string;
  from: DOMRect;
  src: string;
}

export interface TransitionPushOptions {
  sharedImage?: SharedImageHandoff;
}

export interface TransitionRouter {
  /**
   * Navigate with the site transition. Same-path hrefs only scroll (to the
   * hash or to the top). External hrefs fall through to a normal navigation.
   */
  push: (href: string, opts?: TransitionPushOptions) => void;
  /** True from the moment a transition starts until the new page is revealed. */
  isTransitioning: boolean;
}

export const TransitionContext = createContext<TransitionRouter | null>(null);

/**
 * Access the transition router. Outside a `TransitionProvider` it degrades to
 * a plain `next/navigation` push so components stay usable in isolation.
 */
export function useTransitionRouter(): TransitionRouter {
  const ctx = useContext(TransitionContext);
  const router = useRouter();
  if (ctx) return ctx;
  return { push: (href) => router.push(href), isTransitioning: false };
}

/** `/about`, `/#groups`, `?bk=x` are internal; `https://…`, `mailto:` are not. */
export function isInternalHref(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  if (href.startsWith("#") || href.startsWith("?")) return true;
  if (typeof window === "undefined") return false;
  try {
    return new URL(href, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}
