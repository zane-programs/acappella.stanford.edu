/** Keyboard users' first tab stop. Appears top-left only while focused. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[110] focus:rounded-full focus:bg-cardinal focus:px-4 focus:py-2 focus:text-[0.9375rem] focus:font-semibold focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-white"
    >
      Skip to main content
    </a>
  );
}
