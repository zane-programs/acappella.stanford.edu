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
| `--color-palo-alto` | `#175E54` | ONLY the "sign-ups open" status dot/label |

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
   preload="metadata" poster>` with `<source webm>` then `<source mp4>`, from
   `/assets/video/hero-loop.{webm,mp4}` and `/assets/video/hero-poster.jpg`.
   On `(max-width: 767px)` or `prefers-reduced-motion` or `navigator.connection.
   saveData`, don't attach sources: show the poster only (portrait poster
   `hero-poster-mobile.jpg` under 768px via `<picture>`-like logic). Bottom
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
   one sentence, then a compact list of groups with sign-ups (name, status label
   with `palo-alto` dot when open, "opens <date>" when upcoming) linking to each
   group page. Server component; the open/closed decision is per request.
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
  serif white, tagline in `type-lead text-white/85`, voice-part chips derived from
  the `VoicePart` bitmask (S · A · T · B), then a row of social icon links (white,
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

`TransitionProvider` (client, wraps `{children}` in the root layout):
- Renders a fixed `#wipe` layer (`bg-cardinal`, `z-[90]`, `pointer-events-none`,
  hidden by default) and a fixed `#shared-clone` slot.
- Exposes `useTransitionRouter()` returning `{ push(href, opts?) }` where `opts =
  { sharedImage?: { slug: string; from: DOMRect; src: string } }`.
- Exposes `TransitionLink`, a `next/link` wrapper that intercepts left-clicks
  without modifier keys on internal hrefs and calls `push`. External links and
  `target="_blank"` pass through. All internal navigation in the app uses
  `TransitionLink` (nav, tiles, footer, buttons-as-links).
- Wipe sequence (default): (1) `#wipe` scales in from bottom (`scaleY 0→1`,
  `transform-origin bottom`, 600ms in-out-quart) while the wordmark lockup in white
  fades in at center (150ms delay); (2) `router.push`; (3) when `usePathname()`
  changes and the new page has painted (double rAF), scroll to top, then `#wipe`
  scales out to the top (`transform-origin top`, 600ms), and the new page's
  `[data-reveal]` elements stagger in (`y: 24→0, opacity 0→1`, 900ms out-expo,
  stagger 60ms, max 8 elements).
- Shared-image sequence (when `opts.sharedImage` is present): (1) create a fixed
  `<img>` clone at `from` with the same `src`, `object-fit: cover`,
  `border-radius: 6px`; fade the source tile's image to 0 and dim the page
  (`#wipe` at `opacity 0.0→1` behind the clone is NOT used here; instead a
  `bg-white` fade to 0.6). (2) `router.push`. (3) On pathname change + paint,
  find `[data-shared-image="<slug>"]` on the new page; if found within 800ms,
  measure and `gsap.to(clone, { top, left, width, height, duration: 0.9, ease:
  out-expo })`, meanwhile `[data-reveal]` staggers in; on complete, set the target
  image opacity 1 and remove the clone. (4) If not found (e.g. redirect), fall back
  to a fast wipe-out. Back/forward navigation never uses the shared clone; it just
  does a 300ms opacity crossfade.
- `prefers-reduced-motion`: all sequences become an instant swap with a 150ms
  opacity crossfade. No wipe, no clone.
- Header stays above the wipe? No: wipe is `z-[90]`, header `z-[80]`, mobile menu
  `z-[100]`, cookie card `z-[70]`.

Micro-interactions (allowed, nothing else):
- Nav underline grow 300ms.
- Tile photo scale 1.03, 600ms out-expo.
- Buttons: background shift 150ms, `translate-y-px` on active. No lift shadows.
- Hero content: single entrance stagger on first load (title, lead, buttons).
- Section `[data-reveal]` entrance on scroll via one ScrollTrigger batch (`once:
  true`, start 85%). Not on every element: section headings, tile groups, cards.
- Mobile menu slide + link stagger.
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
  (`tone: "neutral" | "open"`), `IconButton`, `Wordmark` (`tone: "cardinal" |
  "white"`, sizes), `VisuallyHidden`.
