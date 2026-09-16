"use client";

/**
 * Coordination between the homepage intro card (rendered by `VideoHero` while
 * the hero video loads) and the transition provider, which must not reveal
 * the page underneath until the card has lifted.
 *
 * The card marks itself pending in its mount effect, which runs before the
 * provider's own effects (children first), so the provider's first reveal
 * always sees the right state. `sac:intro-done` fires on `window` once the
 * card starts to lift; `whenIntroDone()` resolves immediately when no intro
 * is pending.
 */

export const INTRO_DONE_EVENT = "sac:intro-done";

const state = { pending: false };

/** Set by the provider after the first client-side route change. */
export const navState = { routed: false };

export function markIntroPending() {
  state.pending = true;
}

export function isIntroPending() {
  return state.pending;
}

export function markIntroDone() {
  if (!state.pending) return;
  state.pending = false;
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

export function whenIntroDone(): Promise<void> {
  if (!state.pending) return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener(INTRO_DONE_EVENT, () => resolve(), { once: true });
  });
}
