# Hero loop — Stanford a cappella (homepage background video)

Seamless muted looping background for the acappella.stanford.edu hero. 14 clips from 13 official
group videos covering all 10 established groups, 1920×1080 @ 30 fps, no audio, 46.43 s (1393 frames).

## Deliverables

| File | Size |
|---|---|
| `contact-sheet.jpg` | 0.257 MB |
| `credits.json` | 0.004 MB |
| `hero-loop.mp4` | 7.596 MB |
| `hero-loop.webm` | 7.770 MB |
| `hero-poster-mobile.jpg` | 0.182 MB |
| `hero-poster.jpg` | 0.234 MB |

- `hero-loop.mp4` — H.264 High L4.1, CRF 33 (frame 0 / last frame at QP 20), preset slow, GOP 60, faststart, yuv420p.
- `hero-loop.webm` — VP9 two-pass, `-b:v 0 -crf 48` (frame 0 / last frame at CRF 18), row-mt, 2 tile columns, GOP 60, yuv420p.
- `hero-poster.jpg` — exactly frame 0 of `hero-loop.mp4` (1920×1080, JPEG q=3).
- `hero-poster-mobile.jpg` — 1080×1920 portrait crop of clip 1 (Fleet Street at Old Union) at output t≈1.6 s, rendered from the 1440p source through the same normalize + grade chain (subjects in the middle, paving/shadows in the bottom third for text).
- `credits.json` — every clip in sequence order with group, title, URL, channel, in/out timecodes in the source video.
- `contact-sheet.jpg` — one frame from the middle of each clip, in order (7×2).

## Clips used (in order)

| # | Group | Video | Source in–out | Source res | ID |
|---|---|---|---|---|---|
| 1 | Fleet Street | Clawcappella | Stanford Reunion Weekend 2024 | 01:32.0–01:36.5 | 2274x1440 | [zOUumrRziCQ](https://www.youtube.com/watch?v=zOUumrRziCQ) |
| 2 | Mendicants | Somewhere Only We Know (Live) | Stanford Mendicants Cover | 02:34.0–02:38.0 | 2560x1440 | [5X50utN-rCY](https://www.youtube.com/watch?v=5X50utN-rCY) |
| 3 | O-Tone | NewJeans A Cappella Medley | OMG, Hype Boy, Ditto, Cool With You, Attention [MV] | 02:06.0–02:10.0 | 2560x1440 | [bDEJ1SM8H6Q](https://www.youtube.com/watch?v=bDEJ1SM8H6Q) |
| 4 | Talisman | Modimo Trilogy - Spring Show 2025 - Stanford Talisman | 04:35.0–04:39.5 | 1920x1080 | [cFfWEUnUaOk](https://www.youtube.com/watch?v=cFfWEUnUaOk) |
| 5 | Harmonics | Animals - Nickelback A Cappella Cover (Live) | The Harmonics (Lucky Harmz) | 02:23.0–02:27.0 | 2560x1440 | [_0Nxa4fUFlQ](https://www.youtube.com/watch?v=_0Nxa4fUFlQ) |
| 6 | Testimony | Rather Be - Break it Down Los Angeles 2024 | 01:32.0–01:36.5 | 1920x1080 | [6jXvoJZlxhU](https://www.youtube.com/watch?v=6jXvoJZlxhU) |
| 7 | Raagapella | Stanford Raagapella Competition Set 2025 | 08:42.0–08:46.0 | 1920x1080 | [oNp35rb3FY8](https://www.youtube.com/watch?v=oNp35rb3FY8) |
| 8 | Mixed Company | Somebody To Love | 02:33.0–02:37.0 | 2560x1440 | [Ze71xbPVO2g](https://www.youtube.com/watch?v=Ze71xbPVO2g) |
| 9 | Everyday People | Let's Stay Together (Al Green) by Stanford Everyday People | 01:02.0–01:06.0 | 2560x1440 | [-1s3-NV9nVg](https://www.youtube.com/watch?v=-1s3-NV9nVg) |
| 10 | Counterpoint | Hercules - Stanford Counterpoint Winter Show 2024 | 02:03.0–02:07.5 | 1920x1080 | [VdI3TUiz-5I](https://www.youtube.com/watch?v=VdI3TUiz-5I) |
| 11 | Mendicants | The Stanford Mendicants - 2024 ICCA Set | 06:00.5–06:04.5 | 2560x1440 | [MuJ_ho2Qs5Y](https://www.youtube.com/watch?v=MuJ_ho2Qs5Y) |
| 12 | Fleet Street | Cuncti Potens (Live at Stanford Freshman Orientation) - Stanford Fleet Street Singers | 03:02.0–03:06.5 | 2560x1440 | [f2iQFNYIa3g](https://www.youtube.com/watch?v=f2iQFNYIa3g) |
| 13 | O-Tone | Stanford O-Tone | ICCA 2025 | 03:01.0–03:05.0 | 1920x1080 | [8MW6DoUN2YY](https://www.youtube.com/watch?v=8MW6DoUN2YY) |
| 14 | Talisman | Indodana - Gala 2024 - Stanford Talisman | 02:05.0–02:09.5 | 1920x1080 | [L17D-XqqNDw](https://www.youtube.com/watch?v=L17D-XqqNDw) |

Groups covered: Fleet Street (×2), Mendicants (×2), O-Tone (×2), Talisman (×2), Harmonics, Testimony, Raagapella, Mixed Company, Everyday People, Counterpoint.
Kol Etz (founded 2026) has no channel and no official footage was found, so it is not represented.
No two consecutive clips are from the same group. All sources are ≥1080p (1440p sources were downscaled; nothing was upscaled from below 1080p).

## How it was made

### 1. Sourcing
Each group's channel from `src/app/config/groups.tsx` was listed with
`yt-dlp --flat-playlist --print "%(id)s|%(title)s|%(duration)s" <channel>/videos`, then per-video
metadata (`upload_date`, `width×height`, `fps`) was pulled with `--skip-download --print`. Only landscape,
≥1080p, 2018+ performances were shortlisted (Raagapella's only ≥1080p recent uploads are the 2025 competition set and 2021 Fall Show).

YouTube's default player URLs returned HTTP 403 to ffmpeg's open-ended range request, so windows were fetched with the
`web_embedded` player client, which serves URLs that accept mid-file ranges:

```
yt-dlp --extractor-args "youtube:player_client=web_embedded" \
  -f "bv*[height>=1080][height<=1440]/bv*[height>=1080]/bv*[height>=720]" \
  --download-sections "*MM:SS-MM:SS" --force-keyframes-at-cuts \
  -o "cand/<group>_<id>_<MMSS>.%(ext)s" https://www.youtube.com/watch?v=<id>
```
49 twenty-second windows were downloaded (≈470 MB); nothing was downloaded in full. `manifest.json` tracks them.

### 2. Curation
Per-window contact sheets (`ffmpeg -vf "fps=1/3,scale=320:-1,tile=6x1"` then `fps=1,tile=10x2`) were reviewed; 14 sub-clips of 4.0–4.5 s were picked
for visible singing/motion, exposure, stability and variety (Old Union arches at golden hour, Memorial Church and Main Quad exteriors,
theatre stages under colour wash, a church sanctuary, a rehearsal room, a wide competition stage, a tight solo shot).
Rejected: Counterpoint Winter Show 2026 (too dark/blue), Mixed Company "Toxic" (heavy vignette), Everyday People "Whitney Medley" (near-black), Fleet Street "Clawcappella" second window (static), Harmonics "Danger" (soft), O-Tone "LOSER" (sparse framing).

### 3. Normalize (per clip, `norm.py`)
```
[crop=W:H:X:Y,]scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,fps=30,
[zoompan=z='1+0.06*on/N':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,]
eq=gamma=<per-clip>,format=yuv420p,setsar=1      → libx264 crf 10, exact frame count
```
Per-clip exposure was matched by measuring `signalstats` YAVG on each window and setting gamma (0.86–1.22):
- clip 01 `fleet_zOUumrRziCQ_0130`: offset 2.0 s, 4.5 s, gamma 1.0
- clip 02 `mendicants_5X50utN-rCY_0230`: offset 4.0 s, 4.0 s, gamma 1.12
- clip 03 `otone_bDEJ1SM8H6Q_0200`: offset 6.0 s, 4.0 s, gamma 1.0
- clip 04 `talisman_cFfWEUnUaOk_0430`: offset 5.0 s, 4.5 s, gamma 1.0, push-in 1.00→1.06
- clip 05 `harmonics__0Nxa4fUFlQ_0220`: offset 3.0 s, 4.0 s, gamma 1.0, pre-crop `1920:1080:320:360`, push-in anchored at bottom edge 1.06→1.10
- clip 06 `testimony_6jXvoJZlxhU_0130`: offset 2.0 s, 4.5 s, gamma 1.05
- clip 07 `raagapella_oNp35rb3FY8_0830`: offset 12.0 s, 4.0 s, gamma 0.92
- clip 08 `mixedco_Ze71xbPVO2g_0230`: offset 3.0 s, 4.0 s, gamma 1.0, pre-crop `1920:1080:320:200`
- clip 09 `everydaypeople_-1s3-NV9nVg_0100`: offset 2.0 s, 4.0 s, gamma 1.22, pre-crop `1920:1080:320:360`, push-in anchored at bottom edge 1.06→1.10
- clip 10 `counterpoint_VdI3TUiz-5I_0200`: offset 3.0 s, 4.5 s, gamma 1.05
- clip 11 `mendicants_MuJ_ho2Qs5Y_0600`: offset 0.5 s, 4.0 s, gamma 1.08
- clip 12 `fleet_f2iQFNYIa3g_0300`: offset 2.0 s, 4.5 s, gamma 1.18, pre-crop `1920:1080:320:180`, push-in 1.00→1.06
- clip 13 `otone_8MW6DoUN2YY_0300`: offset 1.0 s, 4.0 s, gamma 0.86
- clip 14 `talisman_L17D-XqqNDw_0200`: offset 5.0 s, 4.5 s, gamma 0.93, push-in 1.00→1.06

### 4. Grade (identical on every clip, applied inside the assembly graph)
```
curves=master='0/0.04 0.25/0.235 0.5/0.465 0.75/0.705 1/0.95',eq=saturation=0.85:brightness=-0.02,colorbalance=rs=0.05:gs=-0.01:bs=-0.04:rm=0.01:bm=-0.01,vignette=angle=PI/6
```
Lifted blacks (0→0.04) with the top end held to 0.95 and a slight overall pull-down (≈ −0.2 EV at midtones), saturation −15 %,
warm/cardinal shadow tint via colorbalance (red +, blue −), gentle vignette (angle π/6).

### 5. Assemble + seamless loop (`assemble.py`)
14 graded clips plus a duplicate of clip 1 appended, chained with `xfade=transition=fade:duration=0.9` (offsets accumulate as
Σ(dur−0.9)). The chain is then trimmed to `start = 0.9 + 1/30` (clip 1 fully faded in) and
`end = offset_last + 0.9 + 2/30`, so the final frame is the clip-1 copy at the same instant as frame 0. Rendered to a
near-lossless master (`libx264 -crf 8`). Denoise for compressibility is `hqdn3d=2.5:2:4:4` run over two passes of the
video (`-stream_loop 1`, keep the second) so frame 0 has the same temporal history as the last frame; the last frame is then
replaced by a pixel-exact copy of frame 0 (`master_dn2.mp4`, seam MAD 0.93 before delivery encoding).

Delivery encodes are built from three segments so the two seam frames are *bit-identical*: frame 0 is encoded alone as a
high-quality intra frame (x264 `-qp 20`, VP9 `-crf 18`), frames 1…N−2 are encoded normally, and the *same* frame-0 file is
appended again as the final segment, joined with the concat demuxer (`-c copy`). The stream therefore has keyframes at
0, 1, 61, 121, … and N−1, which every browser decodes normally.
Full filter graph: `build/filtergraph.txt` in the work dir.

### 6. Loop-seam measurement (mean absolute RGB pixel difference, 0–255)
- master (crf 8): `frames=1393  MAD(last,first)=1.136  MAD(prelast,first)=4.438  MAD(first,second)=4.650  MAD(last,second)=4.774`
- hero-loop.mp4: `frames=1393  MAD(last,first)=0.000  MAD(prelast,first)=6.770  MAD(first,second)=5.472  MAD(last,second)=5.472`
- hero-loop.webm: `frames=1393  MAD(last,first)=0.000  MAD(prelast,first)=4.815  MAD(first,second)=4.925  MAD(last,second)=4.925`

MAD(first,second) is the ordinary consecutive-frame motion difference for reference. A 6 s check clip of the last 3 s + first 3 s
was rendered (`build/loop-check.mp4`) and reviewed as a 6 fps frame sheet; the wrap is continuous.

## Encode commands
```
# frame 0 (also reused as the last frame)
ffmpeg -i master_dn2.mp4 -frames:v 1 -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -qp 20 -preset slow -bf 0 -an f0.mp4
ffmpeg -i master_dn2.mp4 -frames:v 1 -c:v libvpx-vp9 -b:v 0 -crf 18 -cpu-used 1 -row-mt 1 -tile-columns 2 -pix_fmt yuv420p -an f0.webm

# frames 1..N-2
ffmpeg -i master_dn2.mp4 -vf "select=between(n\,1\,1391),setpts=N/30/TB" -r 30   -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -crf 33 -preset slow -g 60 -keyint_min 60 -sc_threshold 0 -an mid.mp4
ffmpeg -i master_dn2.mp4 -vf "select=between(n\,1\,1391),setpts=N/30/TB" -r 30   -c:v libvpx-vp9 -b:v 0 -crf 48 -row-mt 1 -tile-columns 2 -g 60 -pix_fmt yuv420p -an -pass 1 -cpu-used 4 -f null /dev/null
ffmpeg ... (same) ... -pass 2 -cpu-used 2 mid.webm

# join: f0 + mid + f0
printf "file f0.mp4
file mid.mp4
file f0.mp4
" > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy -movflags +faststart hero-loop.mp4
ffmpeg -f concat -safe 0 -i list_webm.txt -c copy hero-loop.webm

ffmpeg -i hero-loop.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
```

## Quality caveats
- Under 8 MB for 46 s of 1080p30 means ≈1.3 Mb/s; fine on gradients and stage lighting, with mild softening on the two
  crowded outdoor shots (clips 1 and 12). Serve the WebM first where supported; it is the smaller file.
- Four clips use a subtle 6–10 % push-in (zoompan) applied to the 1080p frame, i.e. a slight magnification of native-resolution pixels, not an upscale from a sub-1080p source.
- Sources at 24/25 fps (Mixed Company, Talisman, Mendicants ICCA set) were conformed to 30 fps by frame repetition; motion is slow so no visible judder.
- Clip 3 (O-Tone) comes from a music video with a stylised soft/lifted look; the grade evens it out but it remains the softest shot.
- Clip 5 (Harmonics) has the group's banner at the top of the frame in the source; it is cropped out except for a sliver at the top edge at the start of the push.
