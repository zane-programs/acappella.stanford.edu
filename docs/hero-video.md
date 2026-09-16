# Hero loop — homepage background video

Seamless muted loop behind the homepage hero, cut from 14 clips of 13 official
group videos covering all ten established groups (Kol Etz, founded 2026, has no
footage yet). Two cuts of the same edit ship, one per orientation:

| Target | File | Frame | Used |
|---|---|---|---|
| desktop | `hero-loop.{mp4,webm}`, `hero-poster.jpg` | 1920×1080 | viewports ≥ 768px |
| mobile | `hero-loop-mobile.{mp4,webm}`, `hero-poster-mobile.jpg` | 720×1280 | viewports < 768px |

Both are 30 fps, silent, and loop with a bit-identical seam (last frame == first
frame). Each poster is exactly frame 0 of its own mp4 so the poster → video
hand-off is invisible. `credits.json` lists every clip in order with source
timecodes and feeds the "Footage credits" menu in `VideoHero`.

The edit (clip list, per-target framing, grade, encode budgets) is
`tools/hero-video/loop.json`; the renderer and its README are in
`tools/hero-video/`. Rebuild with `npm run hero-video -- all`, inspect with
`npm run hero-video -- status`.

## Current render

<!-- hero-video-status:start -->
```
desktop  1920x1080
  hero-loop.mp4                7.60 MB  crf 33  seam 0.0 / motion 5.104  46.43s h264
  hero-loop.webm               7.78 MB  crf 48  seam 0.0 / motion 4.611  46.43s vp9
  hero-poster.jpg              0.23 MB  q 3

mobile  720x1280
  hero-loop-mobile.mp4         3.42 MB  crf 33  seam 0.0 / motion 5.111  46.43s h264
  hero-loop-mobile.webm        3.18 MB  crf 50  seam 0.0 / motion 4.63  46.43s vp9
  hero-poster-mobile.jpg       0.10 MB  q 3
```
<!-- hero-video-status:end -->

## Clips (in order)

| # | Group | Video | Source in–out |
|---|---|---|---|
| 1 | Fleet Street | Clawcappella (Reunion Weekend 2024) | 01:32.0–01:36.5 |
| 2 | Mendicants | Somewhere Only We Know (Live) | 02:34.0–02:38.0 |
| 3 | O-Tone | NewJeans A Cappella Medley [MV] | 02:06.0–02:10.0 |
| 4 | Talisman | Modimo Trilogy (Spring Show 2025) | 04:35.0–04:39.5 |
| 5 | Harmonics | Animals (Live) | 02:23.0–02:27.0 |
| 6 | Testimony | Rather Be (Break it Down LA 2024) | 01:32.0–01:36.5 |
| 7 | Raagapella | Competition Set 2025 | 08:42.0–08:46.0 |
| 8 | Mixed Company | Somebody To Love | 02:33.0–02:37.0 |
| 9 | Everyday People | Let's Stay Together | 01:02.0–01:06.0 |
| 10 | Counterpoint | Hercules (Winter Show 2024) | 02:03.0–02:07.5 |
| 11 | Mendicants | 2024 ICCA Set | 06:00.5–06:04.5 |
| 12 | Fleet Street | Cuncti Potens (Live at Orientation) | 03:02.0–03:06.5 |
| 13 | O-Tone | ICCA 2025 | 03:01.0–03:05.0 |
| 14 | Talisman | Indodana (Gala 2024) | 02:05.0–02:09.5 |

No two consecutive clips are from the same group. All sources are ≥ 1080p; the
1440p ones give room to reframe, which the mobile cut uses (per-clip `framing`
in `loop.json`). Full URLs and channels are in `public/assets/video/credits.json`.

## Look

Per-clip exposure is matched with a gamma value chosen by measuring each
window's average luma. The house grade (`grade` in `loop.json`) is a gentle
S-curve, saturation 0.85, a warm/cardinal shadow tint and a soft vignette. A
light temporal denoise (`hqdn3d`) runs on the master so the delivery encodes
spend their bits on the singers rather than sensor noise.

## Rejected candidates

Counterpoint Winter Show 2026 (too dark/blue), Mixed Company "Toxic" (heavy
vignette), Everyday People "Whitney Medley" (near-black), Fleet Street
"Clawcappella" second window (static), Harmonics "Danger" (soft), O-Tone
"LOSER" (sparse framing).
