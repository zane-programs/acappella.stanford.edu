import GROUPS from "@/app/config/groups";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import { Container } from "@/app/components/ui/Container";
import { Wordmark } from "@/app/components/ui/Wordmark";

const SITE_LINKS = [
  { label: "Groups", href: "/#groups" },
  { label: "Shows", href: "/shows" },
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
];

const STANFORD_LINKS = [
  { label: "Stanford University", href: "https://www.stanford.edu" },
  { label: "Stanford Arts", href: "https://arts.stanford.edu" },
];

const linkClass =
  "type-small inline-block py-1 font-semibold text-white/85 transition-colors duration-150 hover:text-white focus-ring rounded-sm";

/** Two-band Stanford-style global footer (docs/DESIGN.md §4). */
export function SiteFooter() {
  const groups = Object.entries(GROUPS)
    .map(([slug, g]) => ({ slug, name: g.name }))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

  return (
    <footer className="text-white">
      <div className="bg-cardinal">
        <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8 md:py-16">
          <div>
            <TransitionLink href="/" className="inline-block focus-ring rounded-sm" aria-label="Stanford A Cappella home">
              <Wordmark tone="white" size="md" />
            </TransitionLink>
            <p className="type-small mt-4 max-w-[30ch] text-white/75">
              The home of Stanford University&apos;s a cappella groups.
            </p>
          </div>

          <nav aria-label="Groups">
            <p className="type-eyebrow mb-3 text-white/70">Groups</p>
            <ul className="grid grid-cols-2 gap-x-4 md:grid-cols-1">
              {groups.map((g) => (
                <li key={g.slug}>
                  <TransitionLink href={`/${g.slug}`} className={linkClass}>
                    {g.name}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site">
            <p className="type-eyebrow mb-3 text-white/70">Site</p>
            <ul>
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className={linkClass}>
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Stanford">
            <p className="type-eyebrow mb-3 text-white/70">Stanford</p>
            <ul>
              {STANFORD_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClass} rel="noopener">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
      <div className="bg-cardinal-dark">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
          <p className="type-small text-white/75">
            &copy; {new Date().getFullYear()} Stanford A Cappella
          </p>
          <TransitionLink href="/privacy" className={linkClass}>
            Privacy
          </TransitionLink>
        </Container>
      </div>
    </footer>
  );
}
