"""Step 2: grade + crossfade chain + seamless-loop trim → a near-lossless master.

Clip 1 is appended again after the last clip so the final crossfade lands on
the same footage the loop starts with. The chain is then trimmed so frame 0 is
clip 1 just after it has fully faded in, and the last frame is the *copy* of
clip 1 at that same instant. First and last frame therefore show identical
content (a one-frame hold nobody can see), which is what lets ``encode`` make
them the same bytes.

A second pass applies a temporal denoise over two laps of the video
(``-stream_loop 1``) and keeps the second lap, so frame 0 carries the same
temporal history as the frames before the seam.
"""

from __future__ import annotations

import json

from .config import Config, Layout, Target
from .ffmpeg import count_frames, extract_frame, ffmpeg, mean_abs_diff


def expected_frames(config: Config) -> int:
    """Frames in the finished loop: Σ(duration − crossfade) at the loop's fps,
    plus the one closing frame that repeats frame 0 (see module docstring)."""
    total = sum(c.duration - config.crossfade for c in config.clips)
    return round(total * config.fps) + 1


def assemble(config: Config, layout: Layout, targets: list[Target]) -> None:
    for target in targets:
        _assemble_target(config, layout, target)


def _assemble_target(config: Config, layout: Layout, target: Target) -> None:
    build = layout.build_dir(target)
    build.mkdir(parents=True, exist_ok=True)
    xf = config.crossfade
    frame = 1 / config.fps

    files = [layout.norm(target, c) for c in config.clips]
    for f in files:
        if not f.exists():
            raise SystemExit(f"missing {f}; run `normalize` first")
    files.append(files[0])  # clip 1 again, for the loop
    durations = [c.duration for c in config.clips] + [config.clips[0].duration]

    graph: list[str] = []
    for i in range(len(files)):
        graph.append(f"[{i}:v]{config.grade},setpts=PTS-STARTPTS[v{i}]")
    prev = "v0"
    offset = 0.0
    for i in range(1, len(files)):
        offset += durations[i - 1] - xf
        graph.append(f"[{prev}][v{i}]xfade=transition=fade:duration={xf}:offset={offset:.6f}[x{i}]")
        prev = f"x{i}"
    start = xf + frame  # clip 1 fully faded in
    end = offset + xf + 2 * frame  # the clip-1 copy, one frame after its fade-in
    graph.append(f"[{prev}]trim=start={start:.6f}:end={end:.6f},setpts=PTS-STARTPTS,fps={config.fps},format=yuv420p[out]")
    (build / "filtergraph.txt").write_text(";\n".join(graph))

    want = expected_frames(config)
    print(f"{target.name}: {len(files) - 1} clips, crossfade {xf}s, expect {want} frames ({want / config.fps:.2f}s)", flush=True)

    inputs: list[str] = []
    for f in files:
        inputs += ["-i", str(f)]
    master = layout.master(target)
    ffmpeg(
        [*inputs, "-filter_complex", ";".join(graph), "-map", "[out]",
         "-c:v", "libx264", "-crf", "8", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", str(config.fps), "-an",
         str(master)],
        log=build / "assemble.log",
    )
    got = count_frames(master)
    if got != want:
        raise SystemExit(f"{target.name}: master has {got} frames, expected {want}")

    final = master
    if config.denoise:
        final = layout.master_denoised(target)
        ffmpeg(
            ["-stream_loop", "1", "-i", str(master),
             "-vf", f"{config.denoise},trim=start_frame={got},setpts=PTS-STARTPTS",
             "-c:v", "libx264", "-crf", "8", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", str(config.fps), "-an",
             str(final)],
            log=build / "assemble.log",
        )
        got_dn = count_frames(final)
        if got_dn != want:
            raise SystemExit(f"{target.name}: denoised master has {got_dn} frames, expected {want}")

    seam = seam_report(final, got, build)
    print(f"{target.name}: master ready, seam {seam}", flush=True)
    report = _load(layout, target)
    report.update(frames=got, master_seam=seam)
    layout.report(target).write_text(json.dumps(report, indent=1))


def seam_report(video, frames: int, scratch) -> dict[str, float]:
    """Luma MAD across the loop seam vs ordinary frame-to-frame motion."""
    first, second, last = (scratch / f"seam-{n}.png" for n in ("first", "second", "last"))
    extract_frame(video, 0, first)
    extract_frame(video, 1, second)
    extract_frame(video, frames - 1, last)
    return {
        "last_to_first": round(mean_abs_diff(last, first), 3),
        "first_to_second": round(mean_abs_diff(first, second), 3),
    }


def _load(layout: Layout, target: Target) -> dict:
    path = layout.report(target)
    return json.loads(path.read_text()) if path.exists() else {}
