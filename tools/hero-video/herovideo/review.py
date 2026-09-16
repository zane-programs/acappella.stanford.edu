"""Framing review sheets: the middle frame of every clip, cropped as each
target will see it, tiled in order. Use these to set ``framing`` in loop.json
before spending minutes on a full render.
"""

from __future__ import annotations

from .config import Config, Layout, Target
from .ffmpeg import ffmpeg, probe
from .fetch import sources_present
from .framing import crop_rect


def review(config: Config, layout: Layout, targets: list[Target]) -> None:
    sources_present(config, layout)
    layout.review.mkdir(parents=True, exist_ok=True)
    for target in targets:
        cell_w = 420 if target.aspect >= 1 else 180
        cell_h = round(cell_w / target.aspect)
        inputs: list[str] = []
        graph: list[str] = []
        for i, clip in enumerate(config.clips):
            source = layout.source(clip)
            assert source is not None
            info = probe(source)
            rect = crop_rect(info["width"], info["height"], target, clip.framing_for(target.name))
            inputs += ["-ss", f"{clip.offset + clip.duration / 2:.3f}", "-i", str(source)]
            graph.append(
                f"[{i}:v]{rect.filter()},scale={cell_w}:{cell_h},eq=gamma={clip.gamma},{config.grade},"
                f"format=yuv420p,setsar=1,trim=end_frame=1[c{i}]"
            )
        cols = 7 if target.aspect >= 1 else 14
        rows = -(-len(config.clips) // cols)
        pads = "".join(f"[c{i}]" for i in range(len(config.clips)))
        graph.append(f"{pads}concat=n={len(config.clips)}:v=1:a=0,tile={cols}x{rows}:padding=6:margin=6[out]")
        out = layout.review / f"framing-{target.name}.jpg"
        ffmpeg([*inputs, "-filter_complex", ";".join(graph), "-map", "[out]", "-frames:v", "1", "-q:v", "3", str(out)])
        print(f"{target.name}: {out}", flush=True)
