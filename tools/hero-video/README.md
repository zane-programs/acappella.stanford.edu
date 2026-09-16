# Hero loop pipeline

Builds the homepage background video (`public/assets/video/hero-loop*.{mp4,webm}`,
the matching posters and `credits.json`) from short windows of the groups' own
YouTube performances. Two targets ship: a 16:9 `desktop` cut (1920×1080) and a
9:16 `mobile` cut (720×1280) made from the same clips with their own framing.

Requirements: `ffmpeg`, `ffprobe`, `yt-dlp` (all `brew install`), Python 3.11+.
No Python packages.

```
npm run hero-video -- --help
npm run hero-video -- fetch          # download + cache each clip's source window
npm run hero-video -- review         # framing sheets → .work/review/framing-<target>.jpg
npm run hero-video -- all            # normalize → assemble → encode → deliver
npm run hero-video -- status         # what is in public/assets/video and how it measured
```

Add `-t mobile` (repeatable) to any step to work on one target. Individual steps
(`normalize`, `assemble`, `encode --kind mp4`, `deliver`) exist so you can iterate
on one stage without redoing the rest. Everything intermediate lives in
`tools/hero-video/.work/` (git-ignored, safe to delete).

## The edit: `loop.json`

| Key | Meaning |
|---|---|
| `fps`, `crossfade` | Loop frame rate and the fade length between clips (seconds). |
| `grade` | ffmpeg filter string applied to every clip after normalisation (the house look). |
| `denoise` | Temporal denoise applied to the master, for compressibility. Empty string to skip. |
| `targets.<name>` | `width`, `height`, output `suffix`, per-container CRF ladders with a byte budget, `seamQuality` for the lone frame-0 segment, `posterMaxBytes`. |
| `clips[]` | In order. `video` (YouTube id), `window` (`MM:SS-MM:SS` slice fetched and cached), `offset`/`duration` (seconds inside the window), `gamma` (exposure match), optional `framing` and `push`. |
| `clips[].framing.<target>` | `x`, `y` = crop centre as fractions of the source; `zoom` ≥ 1 tightens the crop. Default is the largest centred crop of the target's aspect ratio. |
| `clips[].push` | Slow push-in: `from`/`to` zoom, `anchor` `center` or `bottom`. |
| `videos.<id>` | `group`, `title`, `channel` for the credits. `describe <id>` prints a starter entry. |

### Adding or swapping a clip

1. Find the video and the moment; run `describe <id>` and add the `videos` entry.
2. Add a `clips` entry with a `window` around the moment (20 s is plenty) and run `fetch`.
3. Run `review` and look at both framing sheets; set `framing` per target until the
   subjects sit well in a phone crop as well as the wide one.
4. Run `all` (about ten minutes for both targets) and check `status`: the seam numbers
   must read `0.0` for every encode, and each file must be under its budget.
5. Play `public/assets/video/hero-loop*.mp4` on loop and eyeball the contact sheets in
   `.work/review/`.

## How the loop is made

1. **normalize** – each clip is cropped for the target (`framing`), scaled with Lanczos,
   conformed to `fps`, optionally pushed in, gamma-matched and written near-losslessly
   with an exact frame count (`duration × fps`).
2. **assemble** – clips are graded and chained with `xfade`; clip 1 is appended again so the
   last crossfade lands on the footage the loop starts with. The chain is trimmed so frame 0
   and the final frame show the same instant of clip 1. A temporal denoise then runs over two
   laps of the video (`-stream_loop 1`, keeping the second) so frame 0 carries the same
   temporal history as the frames leading into the seam.
3. **encode** – three segments joined with the concat demuxer: frame 0 alone as a
   high-quality intra frame, frames 1…N−2 encoded normally, then the *same* frame-0 file
   again. First and last frame are the same bytes, so the loop point is invisible whatever
   the codec did in between. CRF walks down the ladder until the file fits the budget.
4. **deliver** – the poster is exactly frame 0 of the delivered mp4 (so poster → video is
   seamless), `credits.json` lists every clip with source timecodes, and a contact sheet per
   target lands in `.work/review/`.

Seam quality is measured as the mean absolute luma difference between the last and first
frame (should be 0.0) against the first-to-second frame difference (ordinary motion, ~5).

## Sourcing notes

Windows are fetched with `yt-dlp --download-sections --force-keyframes-at-cuts` using the
`web_embedded` player client, whose URLs accept mid-file range requests (the default
client's do not). Nothing is downloaded in full. Shortlist landscape, ≥ 1080p, recent
uploads; 1440p sources give room to reframe. Keep to the groups' official channels
(`socialLinks.youtube` in `src/app/config/groups.tsx`) so the footage credits stay honest.
