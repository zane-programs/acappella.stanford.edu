"""Step 3: delivery encodes with a bit-identical loop seam.

Each file is three segments joined with the concat demuxer (``-c copy``):

1. frame 0 alone, as a high-quality intra frame;
2. frames 1 … N−2 encoded normally;
3. the *same* frame-0 file again.

The first and last frames are therefore the same bytes, so the loop point is
invisible whatever the codec did in between. CRF is walked down a ladder until
the file fits the target's size budget.
"""

from __future__ import annotations

import json
from pathlib import Path

from .config import Config, Ladder, Layout, Target
from .ffmpeg import count_frames, ffmpeg, file_size, mb
from .assemble import seam_report


def encode(config: Config, layout: Layout, targets: list[Target], kinds: list[str]) -> None:
    for target in targets:
        for kind in kinds:
            _encode_target(config, layout, target, kind)


def _master(layout: Layout, target: Target) -> Path:
    denoised = layout.master_denoised(target)
    master = denoised if denoised.exists() else layout.master(target)
    if not master.exists():
        raise SystemExit(f"no master for {target.name}; run `assemble` first")
    return master


def _encode_target(config: Config, layout: Layout, target: Target, kind: str) -> None:
    build = layout.build_dir(target)
    master = _master(layout, target)
    frames = count_frames(master)
    ladder = target.mp4 if kind == "mp4" else target.webm
    log = build / f"encode-{kind}.log"

    head = build / f"seam-frame.{kind}"
    mid = build / f"middle.{kind}"
    listing = build / f"concat-{kind}.txt"
    listing.write_text(f"file '{head}'\nfile '{mid}'\nfile '{head}'\n")
    middle_select = ["-vf", f"select=between(n\\,1\\,{frames - 2}),setpts=N/{config.fps}/TB", "-r", str(config.fps)]

    if kind == "mp4":
        codec = ["-c:v", "libx264", "-profile:v", "high", "-level", "4.1", "-pix_fmt", "yuv420p", "-an"]
        ffmpeg(["-i", str(master), "-frames:v", "1", *codec, "-qp", str(ladder.seam_quality), "-preset", "slow", "-bf", "0", str(head)], log=log)
    else:
        codec = ["-c:v", "libvpx-vp9", "-b:v", "0", "-row-mt", "1", "-tile-columns", "2", "-pix_fmt", "yuv420p", "-an"]
        ffmpeg(["-i", str(master), "-frames:v", "1", *codec, "-crf", str(ladder.seam_quality), "-cpu-used", "1", str(head)], log=log)
    print(f"{target.name} {kind}: seam frame {file_size(head) / 1e3:.0f} kB", flush=True)

    out = target.output(kind)
    out.parent.mkdir(parents=True, exist_ok=True)
    chosen: int | None = None
    for crf in ladder.crf:
        if kind == "mp4":
            ffmpeg(["-i", str(master), *middle_select, *codec, "-crf", str(crf), "-preset", "slow",
                    "-g", "60", "-keyint_min", "60", "-sc_threshold", "0", str(mid)], log=log)
            ffmpeg(["-f", "concat", "-safe", "0", "-i", str(listing), "-c", "copy", "-movflags", "+faststart", str(out)], log=log)
        else:
            base = ["-i", str(master), *middle_select, *codec, "-crf", str(crf), "-g", "60", "-passlogfile", str(build / "vp9")]
            ffmpeg([*base, "-pass", "1", "-cpu-used", "4", "-f", "null", "/dev/null"], log=log)
            ffmpeg([*base, "-pass", "2", "-cpu-used", "2", str(mid)], log=log)
            ffmpeg(["-f", "concat", "-safe", "0", "-i", str(listing), "-c", "copy", str(out)], log=log)
        size = file_size(out)
        fits = size <= ladder.max_bytes
        print(f"{target.name} {kind}: crf {crf} → {mb(size)}{'  ✓' if fits else '  (over budget)'}", flush=True)
        if fits:
            chosen = crf
            break
    if chosen is None:
        print(f"{target.name} {kind}: WARNING no CRF on the ladder met {mb(ladder.max_bytes)}; keeping crf {ladder.crf[-1]}")
        chosen = ladder.crf[-1]

    got = count_frames(out)
    if got != frames:
        raise SystemExit(f"{target.name} {kind}: delivered {got} frames, expected {frames}")
    seam = seam_report(out, got, build)
    if seam["last_to_first"] > 0.01:
        raise SystemExit(f"{target.name} {kind}: loop seam is not bit-identical ({seam})")
    print(f"{target.name} {kind}: {got} frames, seam {seam}", flush=True)

    report = json.loads(layout.report(target).read_text()) if layout.report(target).exists() else {}
    report[kind] = {"crf": chosen, "seam_quality": ladder.seam_quality, "bytes": file_size(out), "seam": seam}
    layout.report(target).write_text(json.dumps(report, indent=1))
