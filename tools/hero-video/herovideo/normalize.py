"""Step 1 of the render: one near-lossless, exactly-timed clip per target.

Each source window is cropped/framed for the target, scaled, conformed to the
loop's frame rate, optionally pushed in, gamma-matched and written with an
exact frame count so the crossfade offsets in ``assemble`` are deterministic.
"""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor

from .config import Clip, Config, Layout, Target
from .ffmpeg import count_frames, ffmpeg, probe
from .fetch import sources_present
from .framing import normalize_filters


def normalize(config: Config, layout: Layout, targets: list[Target], *, only: set[int] | None = None) -> None:
    sources_present(config, layout)
    clips = [c for c in config.clips if not only or c.order in only]
    jobs = [(target, clip) for target in targets for clip in clips]

    def render(job: tuple[Target, Clip]) -> str:
        target, clip = job
        source = layout.source(clip)
        assert source is not None
        info = probe(source)
        out = layout.norm(target, clip)
        out.parent.mkdir(parents=True, exist_ok=True)
        want = clip.frames(config.fps)
        ffmpeg(
            [
                "-ss", str(clip.offset),
                "-t", str(clip.duration + 0.5),  # a little slack; -frames:v trims exactly
                "-i", str(source),
                "-vf", ",".join(normalize_filters(clip, info["width"], info["height"], target, config.fps)),
                "-frames:v", str(want),
                "-r", str(config.fps),
                "-c:v", "libx264", "-crf", "10", "-preset", "fast", "-pix_fmt", "yuv420p", "-an",
                str(out),
            ],
            log=layout.build_dir(target) / "normalize.log",
        )
        got = count_frames(out)
        flag = "" if got == want else f"  ** expected {want} frames **"
        return f"{target.name:8s} clip {clip.order:02d}  {info['width']}x{info['height']} → {target.width}x{target.height}  {got} frames{flag}"

    with ThreadPoolExecutor(max_workers=3) as pool:
        for line in pool.map(render, jobs):
            print(line, flush=True)
