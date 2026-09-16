# Stanford A Cappella — 2026 Redesign Brief

This is the single source of truth for the `redesign-2026` branch. Every agent and
every component follows it. If something here conflicts with code you find, this
document wins; if this document is silent, choose the quieter option.

## 1. Intent

Make acappella.stanford.edu feel like a flagship Stanford site: serious, refined,
welcoming. The reference points are stanford.edu and Stanford Web Services' Next.js
sites (Decanter design system): thin cardinal masthead, generous white space, serif
display type, one brand red, restrained motion. The one place we go big is the
homepage hero (a muted looping video of real Stanford a cappella footage) and the
transitions between pages.

Explicitly gone from the old site: glassmorphism, gradient text, drop-shadow-heavy
cards, emoji in buttons, blue/green button color schemes, the `* { transition }`
rule, spinners inside tiles, the "glow" audition button.

Explicitly kept (functionality, not appearance): group config, per-year audition
cohorts, notification banners, O-Show promo, shows fed from a Google Sheet,
add-to-calendar menu + `.ics` route, `/[slug]/audition`, `/[slug]/site`,
`/groupPromo/[slug]`, the `?bk=` Open Graph branding middleware, GA (production
only), cookie consent, sitemap, security headers, 404, privacy page, SEO metadata.

## 2. Stack

- Next.js 15 App Router, React 18, TypeScript. Don't upgrade major versions.
- Tailwind CSS v4 via `@tailwindcss/postcss`. Tokens live in `src/app/globals.css`
  inside `@theme`. No `tailwind.config.js`.
- GSAP 3 (`gsap`, plus `gsap/Flip`, `gsap/ScrollTrigger`). All GSAP work goes
  through `src/app/components/transitions/` or a `useGsap` hook; register plugins
  once in a client module.
- Radix primitives only where a11y demands it: `@radix-ui/react-dropdown-menu`
  (Add to Calendar), `@radix-ui/react-dialog` (mobile menu focus trap). Nothing
  else from Radix.
- `clsx` + `tailwind-merge` via `cn()` in `src/app/lib/cn.ts`.
- `react-icons` stays (Simple Icons for socials, Material for UI glyphs).
- Chakra UI, Emotion, framer-motion, react-collapse, and @bprogress are being
  removed. Do not import them in new code. The integrator deletes the packages
  once no file imports them.
- No other new dependencies without an explicit note in your report.

## 3. Tokens (Decanter-inspired, hand-typed; not the GPL package)

Defined in `globals.css` `@theme`. Use the Tailwind utilities they generate
(`bg-cardinal`, `text-black`, `font-serif`, ...). Never hard-code hex in components.

Color:

| token | hex | use |
|---|---|---|
| `--color-cardinal` | `#8C1515` | brand red: masthead, footer, wipe, primary buttons |
| `--color-cardinal-light` | `#B83A4B` | hover tint on cardinal surfaces |
| `--color-cardinal-dark` | `#820000` | pressed state, deep footer band |
| `--color-digital-red` | `#B1040E` | links, interactive text, focus ring |
| `--color-digital-red-light` | `#E50808` | link hover |
| `--color-black` | `#2E2D29` | body text (Stanford warm black) |
| `--color-black-90` … `--color-black-10` | `#43423E #585754 #6D6C69 #767674 #979694 #ABABA9 #C0C0BF #D5D5D4 #EAEAEA` | text hierarchy, borders (10 = hairline) |
| `--color-white` | `#FFFFFF` | page background |
| `--color-fog-light` | `#F4F4F4` | alternate section background |
| `--color-fog` | `#E3DED1` | warm neutral panel, quotes |
| `--color-palo-alto` | `#175E54` | reserved; currently unused (the "open" status badge was removed 2026-09) |

No other accent colors. No gradients except a single black→transparent scrim on
video/photos for legibility.

Type:

- `--font-sans`: Source Sans 3 (next/font/google, weights 400 600 700, italic 400).
  Body, UI, nav, buttons, captions.
- `--font-serif`: Source Serif 4 (next/font/google, weights 400 600, opsz axis if
  available). Display headings, group names, pull quotes, hero title.
- `--font-stanford`: local `/public/assets/fonts/stanford.woff` via next/font/local.
  ONLY for the word "Stanford" in the wordmark lockup and the masthead.

Scale (fluid, defined as utilities in `@theme` or `@utility`):

| name | size | use |
|---|---|---|
| `type-display` | `clamp(2.75rem, 2rem + 3.5vw, 5.5rem)` serif 400, lh 1.02, tracking -0.015em | hero title, group page name |
| `type-h1` | `clamp(2.25rem, 1.8rem + 1.8vw, 3.5rem)` serif 400, lh 1.08 | page titles |
| `type-h2` | `clamp(1.75rem, 1.5rem + 1vw, 2.5rem)` serif 400, lh 1.15 | section titles |
| `type-h3` | `1.375rem` sans 600, lh 1.3 | card titles |
| `type-lead` | `clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)` sans 400, lh 1.5 | intros |
| `type-body` | `1.0625rem` sans 400, lh 1.6, max 68ch | paragraphs |
| `type-small` | `0.9375rem` sans, lh 1.5 | meta, captions |
| `type-eyebrow` | `0.8125rem` sans 600, uppercase, tracking 0.12em | section labels ("Featured event", "Groups") |

Spacing: Tailwind default 4px scale. Section vertical rhythm: `py-16 md:py-24
lg:py-32`. Container: `mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12
xl:px-20`. Reading measure: `max-w-[68ch]`.

Radius: `rounded-none` for structural elements (Stanford is squared), `rounded-sm`
(2px) for buttons and inputs, `rounded-md` (6px) for photos/cards. Nothing above
6px. No pill buttons except the small status badge.

Shadow: none by default. Photos and cards use a hairline `ring-1 ring-black-10`
instead. One elevated shadow token `--shadow-elevated` (`0 20px 40px -20px
rgb(46 45 41 / 0.25)`) for the mobile menu panel and dropdowns only.

Motion (see §6): `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`,
`--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1)`. Durations 150 / 300 / 600 /
900 ms. Everything honors `prefers-reduced-motion: reduce`.

## 4. Global chrome

Masthead (`components/chrome/Masthead.tsx`): 32px tall, `bg-cardinal`, text
"Stanford University" in `font-stanford` white, links to https://www.stanford.edu.
Replaces the base64 PNG. Present on every page, always solid.

Header (`components/chrome/SiteHeader.tsx`): below the masthead. Left: wordmark
lockup "Stanford | A Cappella" (Stanford in `font-stanford` cardinal, thin
vertical rule, "A Cappella" in `font-serif`), links home. Right (≥ lg): Groups,
Shows, About as text links with a 2px cardinal underline that grows from center on
hover and is persistent on the current route; plus, when the active audition
cohort has any open group, a small `bg-cardinal` button "Auditions" that scrolls to
/#auditions. Mobile (< lg): a "Menu" button with a two-line glyph.

- On the homepage the header sits over the video: transparent background, white
  text and white wordmark. After the hero scrolls out it becomes `bg-white/95
  backdrop-blur` with normal colors. Everywhere else it is solid white with a
  `border-b border-black-10`.
- Header is sticky. Height 72px (64px mobile).

Mobile menu (`components/chrome/MobileMenu.tsx`): Radix Dialog, full-screen
`bg-cardinal` panel sliding in from the right (GSAP, 600ms out-expo). Links in
`type-h1` serif white, staggered 40ms. Below them, a smaller list of all group
names in two columns. Close on route change and Escape.

Footer (`components/chrome/SiteFooter.tsx`): two bands, Stanford global-footer
style. Band 1 `bg-cardinal` white text: wordmark lockup in white; three link columns
"Groups" (all groups, alphabetical), "Site" (Shows, About, Privacy), "Stanford"
(stanford.edu, Stanford Arts https://arts.stanford.edu). Band 2 `bg-cardinal-dark`:
"© {year} Stanford A Cappella" and "Privacy". No social icons in the footer (those
belong to groups, not to us). Don't invent affiliations or contact details.

Announcement (`components/chrome/AnnouncementBar.tsx`, replaces NotificationBanner
/ NotificationManager): a slim `bg-fog-light` strip directly under the header (not
over the video: on the homepage it renders at the top of the content below the
hero). One line: bold title, subtitle, date/location, then a text-link
"Add to calendar" opening the dropdown, and a small dismiss "×". Keeps the existing
`Notification` config shape, dismiss storage keys, date window and page filters.

Cookie consent (`components/chrome/CookieConsent.tsx`): small card bottom-left,
`bg-white ring-1 ring-black-10 shadow-elevated`, two lines of text, "Got it"
cardinal button. Same localStorage key `sac-cookie-consent` and gtag event.

Skip link: keep, restyle as a cardinal pill that appears top-left on focus.

## 5. Pages

Home (`/`):
1. `VideoHero`: 100svh (min 640px). `<video autoplay muted loop playsinline
   preload="auto" poster>` with `<source webm>` then `<source mp4>`. Two cuts of
   the same loop, built by `tools/hero-video` (see its README): the 16:9
   `/assets/video/hero-loop.{webm,mp4}` above 768px and the 9:16
   `/assets/video/hero-loop-mobile.{webm,mp4}` below. Sources are attached on
   mount for the matching cut; under `prefers-reduced-motion` or
   `navigator.connection.saveData` none are attached and the poster stays
   (`hero-poster.jpg` / `hero-poster-mobile.jpg`, each exactly frame 0 of its
   encode, art-directed via `<picture>`). If autoplay is refused (iOS Low Power
   Mode) the poster stays and the pause toggle reads "Play". Bottom
   scrim `from-black/70 via-black/20 to-transparent`. Content bottom-left inside
   the container: eyebrow "Stanford University", display title "A Cappella at
   Stanford" (serif, white), lead line, two buttons: primary white-on-cardinal
   "Meet the groups" (scrolls to #groups) and secondary outline-white "Upcoming
   shows" (/shows). A tiny "pause" toggle bottom-right (a11y requirement for
   autoplaying video). A "Footage credits" text link next to it opens a small
   Radix dropdown listing clips from `public/assets/video/credits.json`.
2. `AnnouncementBar` (if any active).
3. `AuditionsStrip` (id="auditions"): only when the active cohort has ≥ 1 group
   with status open or upcoming. `bg-fog-light`. Eyebrow "Audition season", h2,
   one sentence, then a compact list of groups with sign-ups (name, tagline,
   "Closes <date>" when open, "Opens <date>" when upcoming; no status badge)
   linking to each group page. Server component; the open/closed decision is per request.
4. `GroupsGrid` (id="groups"): eyebrow "The groups", h2 "Eleven groups, one
   campus" (count derived from config, not hard-coded). Grid 1 / 2 / 3 / 4 cols.
   `GroupTile`: photo 3:2, `rounded-md ring-1 ring-black-10`, `object-cover`; below
   it (not over it) the name in `type-h3` serif and the tagline in `type-small
   text-black-70`. Hover: photo scales 1.03 over 600ms, name underline grows.
   The tile's `<img>` carries `data-shared-image={slug}` (see §6).
5. `ShowsPreview`: the next 3 shows from the sheet or the featured show if none,
   rendered with the same `ShowCard` as /shows, plus a text link "All shows →".
6. `AboutTeaser`: one serif pull-line from the history ("Stanford's a cappella
   tradition began in 1963…") with a link to /about. `bg-fog`.

Group page (`/[slug]`):
- `GroupHero`: `bg-cardinal` band. Container has two columns on lg: left, the
  photo (`descriptionImgUrl ?? imgUrl`, 3:2, `rounded-md`, max-width ~560px, never
  upscaled beyond its natural pixel width by more than 1.15×) with
  `data-shared-image={slug}`; right, eyebrow "Stanford A Cappella", display name in
  serif white, tagline in `type-lead text-white/85`, one `Badge tone="on-cardinal"`
  from the group's `voicing` ("Upper voices" / "Lower voices" / "Mixed voices",
  the CARA categories; `title` carries the definition), then a row of social icon links (white,
  28px hit area 44px) and, if present, a "Website ↗" text link.
- Below the hero, white section, two columns on lg: left (wider) the bio
  `description` in `type-body` prose; right, a sticky aside card `ring-1
  ring-black-10 rounded-md p-6` containing the `AuditionSection` (primary cardinal
  button per link, first solid, rest outline; details list with Material icons;
  hidden when closed/none) and the `ShareButton` (text button, only when
  `navigator.share` exists).
- `ListenSection`: eyebrow "Listen", the existing Spotify / YouTube embed logic
  moved to `components/group/ListenEmbed.tsx`, iframe `rounded-md`, lazy.
- `MoreGroups`: eyebrow "More groups", horizontal row of 4 other `GroupTile`s
  (deterministic: next 4 alphabetically, wrapping).
- Keep `generateMetadata`, alias redirects, `force-dynamic`.

Shows (`/shows`): h1 "Shows", lead line. If sheet has shows: a vertical list of
`ShowCard`s (date block left in serif: big day number, month eyebrow; then group
badge as a text link, title `type-h3`, meta rows, description, actions: "Details ↗"
text button if link, `AddToCalendarMenu` outline button). Else `FeaturedShowCard`:
`bg-cardinal` panel, eyebrow "Featured event", serif title, meta, blurb, white
buttons. Else the quiet "coming soon" line.

About (`/about`): h1, lead, three sections with a small serif h2 and body prose;
the History section gets a simple vertical timeline (year in serif on the left:
1963, 1980s, 1990s, today) built from the existing copy. Kol Etz remains "the
newest addition".

Privacy (`/privacy`): prose only, `type-body`, h2s in serif. Keep the copy.

404 (`not-found.tsx`): serif "Page not found", one line, link home. Centered,
`min-h-[60svh]`.

## 6. Motion contract

Owner: `src/app/components/transitions/`. Everyone else only consumes the API.

`TransitionProvider` (client, wraps `{children}` in the root layout). It owns
scroll: `history.scrollRestoration` is `manual` for the life of the app, every
`router.push` passes `{ scroll: false }`, and the last scroll position of every
URL (pathname + search) is remembered in a module Map so Back/Forward land
exactly where the visitor left. Layers, bottom to top: cardinal band `z-[75]`,
snapshot + image clones `z-[76]`, header `z-[80]`, intro card `z-[88]`, wipe
`z-[90]`, mobile menu `z-[99]/[100]`.

- API: `useTransitionRouter()` → `{ push(href, opts?), isTransitioning }`,
  `opts = { sharedImage?: { slug, from: DOMRect, src } }`; `TransitionLink`
  (a `next/link` that routes plain left-clicks on internal hrefs through
  `push`, with an optional `sharedImage` callback); `data-reveal`,
  `data-shared-image={slug}` and `#hero-sentinel` element contracts.
- Technique: before the route changes, `<main>` is deep-cloned into the fixed
  layer (ids, `data-shared-image`, iframes/video stripped) and the real `<main>`
  is hidden. The snapshot is what animates out, so the moment Next swaps the DOM
  is never visible however long the fetch takes.
- Wipe (default for any push without a shared image): a `cardinal-dark` leading
  edge and the `cardinal` body both `scaleY` up from the bottom (550ms
  power4.inOut, body 60ms behind) while the outgoing `<main>` fades to 0.6 and
  drifts `y: -8`; the white wordmark fades in at center from 250ms. `push` fires
  at 380ms. On the new route: scroll to top (or the hash), the body retreats
  upward first and the edge follows, and `[data-reveal]` starts staggering in at
  220ms, as the wipe clears the top third.
- Tile → hero morph (`sharedImage` present): the tile's photo is cloned into the
  layer; in the snapshot, the clicked tile's caption fades and every other
  `[data-reveal]` in its section recedes (`opacity 0, y 12, scale .985`, 350ms,
  radial stagger from the tile, ≤ 200ms), then the whole snapshot fades. `push`
  fires immediately. When the destination's `[data-shared-image]` exists (≤
  800ms): scroll to top, the sticky header + masthead slide from where they were
  to where they now sit (never a 32px jump), the hero `<section>` grows down from
  under the header via `clip-path: inset(0 0 100% 0 → 0)` (600ms expo.out), the
  clone flies 950ms on the custom `hero` ease (`CustomEase "M0,0 C0.7,0 0.2,1
  1,1"`), re-measuring the target every frame so it lands exactly even if the
  page shifts; at 580ms the hero copy (`[data-reveal]` column children) steps in
  60ms apart from `y: 20`; at 900ms the body reveals; on landing the clone
  cross-fades into the real image (300ms). The destination is recorded in
  `morphMemory: Map<url, { fromUrl, slug }>`.
- Back out of a morphed page (popstate where `morphMemory[from].fromUrl === to`):
  the hero photo is cloned, a fixed cardinal band is placed over the hero
  section, `<main>` is snapshotted and hidden, then on paint: scroll to the
  remembered position under the hidden main, header/masthead slide-compensate,
  the band retreats upward (500ms), the clone flies back onto the tile (same
  ease, tracking), neighbours fade back in radiating from the tile from 400ms,
  the tile caption from 600ms, cross-fade on landing. Forward into a morphed
  page replays the forward morph when the tile is in view. Any other Back /
  Forward is a 300ms snapshot cross-fade with the scroll restored instantly
  underneath. A missing target (redirect, resized layout) degrades to that
  cross-fade.
- Reduced motion (or no `html.js`): every sequence is an instant swap; scroll
  memory still applies.
- Reload restores the previous scroll from `sessionStorage` (the browser no
  longer does, since restoration is manual).
- Intro card (homepage hard loads only): `VideoHero` server-renders a fixed
  `bg-cardinal` card (`[data-intro]`, hidden without `html.js`) with the logo and
  wordmark entering via CSS animation. On mount it is dropped at once on phones
  (they fade the mobile cut in over its poster rather than wait on a cellular
  buffer), reduced motion, data-saver, or when `navState.routed` says this is a
  client-side arrival. Otherwise it marks the intro pending
  (`transitions/intro.ts`), shows a 2px progress bar only after 2.5s (real
  `buffered/duration`, drifting to 85% until data arrives), and lifts after
  `canplaythrough` (or `canplay` + 1.5s, `error`, or a 9s timeout) and at least
  900ms: bar completes, content fades, card and dark edge scale up from the top
  (600ms power4.inOut). It dispatches `sac:intro-done` on `window` as it clears
  the top third; the provider's first reveal awaits `whenIntroDone()`. A CSS
  fallback fades the card at 9.5s if hydration never happens.

Micro-interactions (allowed, nothing else):
- Nav underline grow 300ms.
- Tile photo scale 1.03, 600ms out-expo.
- Buttons: background shift 150ms, `translate-y-px` on active. No lift shadows.
- Hero content: single entrance stagger on first load (title, lead, buttons).
- Section `[data-reveal]` entrance on scroll via one ScrollTrigger batch (`once:
  true`, start 85%). Not on every element: section headings, tile groups, cards.
- Mobile menu: overlay 200ms, panel slides in 600ms expo.out with links
  staggered 40ms from `y: 24`, hamburger lines morph to an X; close reverses
  (links 120ms, panel 450ms power3.in), and Radix only unmounts, unlocks scroll
  and restores focus once the close has finished. A menu link starts the close
  and the wipe together.
- Announcement bar dismiss: height collapse 300ms.

Not allowed: parallax, cursor followers, magnetic buttons, text scramble, infinite
marquees, hover tilts, per-letter animation outside the hero title, scroll-jacking.

## 7. Accessibility and quality bar

- WCAG AA contrast everywhere. White on cardinal passes; `black-60` is the lightest
  text on white; `white/85` the lightest on cardinal.
- Every interactive element ≥ 44×44px hit area on touch, visible `focus-visible`
  ring (`ring-2 ring-digital-red ring-offset-2`), no `outline: none` without a
  replacement.
- Semantic landmarks: one `<header>`, `<nav aria-label>`, `<main id="main-content">`,
  `<footer>`. No `role="grid"` on the tiles; a `<ul>` of `<li>` is right.
- Video: `aria-hidden` on the `<video>`, pause control with `aria-pressed`, poster
  fallback, `preload="metadata"`, no audio track.
- Images: `next/image` with explicit `sizes`; the shared-image `<img>` may be a
  plain `<img>` to keep Flip measurement simple (document the exception).
- No layout shift from fonts (`display: "swap"` with `adjustFontFallback`).
- Lighthouse targets on a production build: Performance ≥ 90 desktop / ≥ 80 mobile,
  Accessibility 100, Best Practices 100, SEO 100.
- `npm run lint` and `npm run build` clean. No `any` in new code.
- Keep the file/route structure of the repo; new components go in
  `src/app/components/{chrome,home,group,shows,shared,transitions,ui}/`.

## 8. Copy voice

Plain, confident, short. Sentence case for headings. No exclamation marks in UI
copy (bios written by groups are left as they are). "A cappella", two words, lower
case unless starting a sentence. When copy is replaced, keep the old copy commented
in the component with a dated note (Zane's preference).

## 9. Ownership map for the fan-out

| area | files | owner |
|---|---|---|
| tokens, fonts, layout.tsx, chrome (masthead/header/mobile menu/footer/announcement/cookie/skip link), `ui/*` primitives, transitions provider, about, privacy, 404 | listed | foundation agent |
| homepage: VideoHero, AuditionsStrip, GroupsGrid, GroupTile, ShowsPreview, AboutTeaser, page.tsx | `components/home/*`, `app/page.tsx` | home agent |
| group page: GroupHero, bio layout, AuditionSection, ShareButton, ListenEmbed, MoreGroups, `[slug]/page.tsx` | `components/group/*`, `app/[slug]/page.tsx`, `shared/AuditionSection.tsx`, `shared/ShareButton.tsx` | group agent |
| shows: ShowCard, FeaturedShowCard, AddToCalendarMenu (Radix), InfoRow, shows/page.tsx, plus `lib/shows.ts` (extract the sheet fetching from the page so the homepage can reuse it) | `components/shows/*`, `app/shows/page.tsx`, `lib/shows.ts` | shows agent |
| hero video assets | `public/assets/video/*` | video agent |

Rules for page agents: do not edit `globals.css`, `layout.tsx`, `ui/*`,
`transitions/*`, or `package.json`. If you need a primitive that doesn't exist,
build it inside your own folder and mention it in your report so it can be
promoted. `ShowCard` is owned by the shows agent; the home agent imports it (until
it exists, use a clearly marked placeholder component with the same props:
`{ show: ShowItem; platform: Platform }` from `lib/shows.ts`).

## 10. `ui/*` primitives the foundation provides

- `Container`, `Section` (`tone: "white" | "fog-light" | "fog" | "cardinal"`),
  `Eyebrow`, `Heading` (`as`, `size: "display" | "h1" | "h2" | "h3"`), `Prose`
  (typographic wrapper for bios/legal copy: paragraph spacing, links underlined in
  digital red, lists), `Button` (`variant: "primary" | "secondary" | "ghost" |
  "on-cardinal"`, `size: "md" | "lg"`, renders `TransitionLink` when `href` is
  internal, `<a target=_blank rel=noopener>` when external), `TextLink`, `Badge`
  (`tone: "neutral" | "on-cardinal"`), `IconButton`, `Wordmark` (`tone: "cardinal" |
  "white"`, sizes), `VisuallyHidden`.

## 11. Implementation notes (foundation, 2026-09-16)

Additions/clarifications to the contract above, as built:

- **Reveal gating.** An inline script in `layout.tsx` adds `html.js` before first
  paint unless the visitor prefers reduced motion. `html.js [data-reveal]` is
  `opacity: 0` in CSS; the provider animates it in. Without JS, or with reduced
  motion, nothing is ever hidden. Put `data-reveal` only on elements inside
  `<main>`; the first 8 in view stagger, the rest in view appear at once,
  below-the-fold ones reveal on scroll (once).
- **Header tone.** The page renders `id="hero-sentinel"` on its hero `<section>`.
  CSS `body:has(#hero-sentinel)` pulls content under the header
  (`margin-bottom: calc(-1 * var(--header-h))`) and draws it transparent/white
  until the header's IntersectionObserver reports the sentinel has scrolled
  past. `--header-h` is `64px` (< lg) / `72px` on `:root`.
- **Announcement bar.** The layout's instance is wrapped in `.announcement-slot`,
  hidden by CSS on hero pages; the home page renders `<AnnouncementBar inline />`
  directly below its hero.
- **Hash links.** `[id] { scroll-margin-top: calc(var(--header-h) + 8px) }`;
  after a wipe the provider scrolls to the destination hash if present.
- **`ui/Menu`** (styled Radix DropdownMenu: `Menu`, `MenuTrigger`, `MenuContent`,
  `MenuItem`, `MenuLabel`, `MenuSeparator`) is the primitive for every dropdown;
  `AddToCalendarMenu` should be rebuilt on it.
- **Button** gained an `on-cardinal-outline` variant for the hero's secondary CTA.
- Static pages decide the "Auditions" nav CTA on the client (`AuditionsNavButton`)
  so nothing stale is baked at build time.

## 12. Implementation notes (motion pass, 2026-09-16)

- `transitions/gsap.ts` registers `CustomEase` and exports `EASE.hero`,
  `DURATION.flight` (0.95) and `DURATION.wipe` (0.55).
- `transitions/intro.ts`: `markIntroPending / markIntroDone / whenIntroDone /
  isIntroPending`, `INTRO_DONE_EVENT = "sac:intro-done"`, and `navState.routed`
  (true after the first client-side route change).
- Scroll memory and morph memory are keyed by URL rather than a history-state
  id: Next's `HistoryUpdater` drops custom `history.state` keys after
  navigations, so an id stored there is not reliable.
- Restored scroll positions can differ from the saved value by the height of
  content that mounts after paint (the announcement bar): Chrome's scroll
  anchoring keeps the viewport content in place, which is the intended outcome.
- `GroupTile` / `GroupHero` are unchanged; the provider finds the tile's `<li>`
  and `<section>` via `closest()`, and the hero's caption column as the first
  `[data-reveal]` in the hero `<section>`.
- The masthead carries `id="masthead"` so the provider can slide it with the
  header.

