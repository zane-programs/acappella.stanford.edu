"""Download the source windows from YouTube into ``.work/sources``.

Only the requested window is fetched (``--download-sections``), never a whole
video. The ``web_embedded`` player client is used because the default client's
URLs reject mid-file range requests. Each window is cached under
``<videoId>_<window>.<ext>`` next to a ``.json`` with the probe result and the
video's title/channel, which ``deliver`` uses to build ``credits.json``.
"""

from __future__ import annotations

import json
from pathlib import Path

from .config import Clip, Config, Layout
from .ffmpeg import probe, run, tool

FORMAT = "bv*[height>=1080][height<=1440]/bv*[height>=1080]/bv*[height>=720]"


def fetch(config: Config, layout: Layout, *, force: bool = False) -> None:
    layout.sources.mkdir(parents=True, exist_ok=True)
    for clip in config.clips:
        existing = layout.source(clip)
        if existing and not force:
            print(f"clip {clip.order:02d}  cached  {existing.name}")
            continue
        _download(clip, layout)
    _write_metadata(config, layout)


def _download(clip: Clip, layout: Layout) -> None:
    start, end = clip.window.split("-")
    out = layout.sources / f"{clip.source_stem}.%(ext)s"
    print(f"clip {clip.order:02d}  fetching {clip.video} {start}–{end} …", flush=True)
    run(
        [
            tool("yt-dlp"),
            "--no-update",
            "-q",
            "--no-warnings",
            "--extractor-args",
            "youtube:player_client=web_embedded",
            "-f",
            FORMAT,
            "--download-sections",
            f"*{start}-{end}",
            "--force-keyframes-at-cuts",
            "-o",
            str(out),
            f"https://www.youtube.com/watch?v={clip.video}",
        ]
    )
    if not layout.source(clip):
        raise SystemExit(f"yt-dlp produced no file for clip {clip.order}")


def _write_metadata(config: Config, layout: Layout) -> None:
    """Probe each cached window and record title/channel for the credits."""
    for clip in config.clips:
        meta_path = layout.source_meta(clip)
        source = layout.source(clip)
        if meta_path.exists() or source is None:
            continue
        info = probe(source)
        info.update(video=clip.video, window=clip.window, file=source.name)
        video = config.video_for(clip)
        info.update(title=video.title, channel=video.channel)
        meta_path.write_text(json.dumps(info, indent=1, ensure_ascii=False))


def describe(video_ids: list[str]) -> None:
    """Print a ``videos`` entry for each id, ready to paste into loop.json."""
    entries = {}
    for vid in video_ids:
        out = run(
            [
                tool("yt-dlp"),
                "--no-update",
                "--no-warnings",
                "--skip-download",
                "--print",
                "%(title)s\t%(channel)s\t%(width)s\t%(height)s\t%(upload_date)s",
                f"https://www.youtube.com/watch?v={vid}",
            ]
        ).stdout.strip()
        title, channel, width, height, uploaded = out.split("\t")
        entries[vid] = {"group": "", "title": title, "channel": channel}
        print(f"{vid}  {width}x{height}  uploaded {uploaded}", flush=True)
    print(json.dumps(entries, indent=2, ensure_ascii=False))


def sources_present(config: Config, layout: Layout) -> list[Path]:
    missing = [clip for clip in config.clips if layout.source(clip) is None]
    if missing:
        names = ", ".join(f"{c.order:02d} ({c.source_stem})" for c in missing)
        raise SystemExit(f"missing source windows for clips {names}; run `fetch` first")
    return [layout.source(c) for c in config.clips]  # type: ignore[misc]
