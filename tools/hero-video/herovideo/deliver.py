"""Step 4: posters, credits and a contact sheet from the delivered encodes."""

from __future__ import annotations

import json

from .config import Config, Layout, Target, OUTPUT_DIR
from .ffmpeg import ffmpeg, file_size, mb, probe

POSTER_QUALITIES = (3, 4, 5, 6, 8)


def deliver(config: Config, layout: Layout, targets: list[Target]) -> None:
    for target in targets:
        _poster(layout, target)
        _contact_sheet(config, layout, target)
    _credits(config, layout)


def _poster(layout: Layout, target: Target) -> None:
    """Exactly frame 0 of the delivered mp4, so poster → video is seamless."""
    mp4 = target.output("mp4")
    if not mp4.exists():
        raise SystemExit(f"no {mp4.name}; run `encode` first")
    poster = target.output("poster")
    chosen = POSTER_QUALITIES[-1]
    for q in POSTER_QUALITIES:
        ffmpeg(["-i", str(mp4), "-frames:v", "1", "-q:v", str(q), str(poster)])
        if file_size(poster) <= target.poster_max_bytes:
            chosen = q
            break
    print(f"{target.name}: {poster.name} q={chosen} {mb(file_size(poster))}", flush=True)
    report = json.loads(layout.report(target).read_text())
    report["poster"] = {"quality": chosen, "bytes": file_size(poster)}
    layout.report(target).write_text(json.dumps(report, indent=1))


def _contact_sheet(config: Config, layout: Layout, target: Target) -> None:
    """One frame from the middle of each clip, in order, for a quick eyeball."""
    mp4 = target.output("mp4")
    times: list[float] = []
    cursor = 0.0
    for clip in config.clips:
        times.append(cursor - config.crossfade + clip.duration / 2)
        cursor += clip.duration - config.crossfade
    select = "+".join(f"eq(n\\,{max(0, round(t * config.fps))})" for t in times)
    cols = 7 if target.aspect >= 1 else 14
    rows = -(-len(times) // cols)
    cell = 480 if target.aspect >= 1 else 200
    layout.review.mkdir(parents=True, exist_ok=True)
    out = layout.review / f"contact-sheet-{target.name}.jpg"
    ffmpeg(["-i", str(mp4), "-vf", f"select='{select}',scale={cell}:-1,tile={cols}x{rows}:padding=4:margin=4",
            "-frames:v", "1", "-q:v", "4", str(out)])
    print(f"{target.name}: contact sheet → {out.relative_to(layout.work.parent)}", flush=True)


def _credits(config: Config, layout: Layout) -> None:
    """``credits.json``: every clip in order with its source video and timecodes."""
    entries = []
    for clip in config.clips:
        video = config.video_for(clip)
        start = clip.source_in()
        source = layout.source(clip)
        resolution = None
        if source:
            info = probe(source)
            resolution = f"{info['width']}x{info['height']}"
        entries.append(
            {
                "group": video.group,
                "title": video.title,
                "url": video.url,
                "channel": video.channel,
                "in": _timecode(start),
                "out": _timecode(start + clip.duration),
                "order": clip.order,
                "source_resolution": resolution,
            }
        )
    out = OUTPUT_DIR / "credits.json"
    out.write_text(json.dumps(entries, indent=2, ensure_ascii=False) + "\n")
    print(f"credits → {out.relative_to(OUTPUT_DIR.parent.parent.parent)} ({len(entries)} clips)", flush=True)


def _timecode(seconds: float) -> str:
    return f"{int(seconds // 60):02d}:{seconds % 60:04.1f}"


def summary(config: Config, layout: Layout, targets: list[Target]) -> None:
    """Print what is currently in public/assets/video for each target."""
    for target in targets:
        report = json.loads(layout.report(target).read_text()) if layout.report(target).exists() else {}
        print(f"\n{target.name}  {target.width}x{target.height}")
        for kind in ("mp4", "webm", "poster"):
            path = target.output(kind)
            if not path.exists():
                print(f"  {path.name:26s} (missing)")
                continue
            extra = ""
            if kind in report:
                r = report[kind]
                extra = f"  q {r['quality']}" if kind == "poster" else f"  crf {r['crf']}"
                if "seam" in r:
                    extra += f"  seam {r['seam']['last_to_first']} / motion {r['seam']['first_to_second']}"
            if kind != "poster":
                p = probe(path)
                extra += f"  {p['duration']:.2f}s {p['codec']}"
            print(f"  {path.name:26s} {mb(file_size(path)):>9s}{extra}")
