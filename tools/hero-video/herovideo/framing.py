"""Crop maths shared by the normalizer and the review sheets."""

from __future__ import annotations

from dataclasses import dataclass

from .config import Clip, Framing, Push, Target


@dataclass(frozen=True)
class CropRect:
    w: int
    h: int
    x: int
    y: int

    def filter(self) -> str:
        return f"crop={self.w}:{self.h}:{self.x}:{self.y}"


def _even(v: float) -> int:
    return max(2, int(round(v / 2)) * 2)


def crop_rect(src_w: int, src_h: int, target: Target, framing: Framing) -> CropRect:
    """The largest crop of the target's aspect ratio, tightened by ``zoom`` and
    centred on (``x``, ``y``), clamped to the source."""
    if src_w / src_h > target.aspect:
        base_h = src_h
        base_w = src_h * target.aspect
    else:
        base_w = src_w
        base_h = src_w / target.aspect
    zoom = max(1.0, framing.zoom)
    w = _even(base_w / zoom)
    h = _even(base_h / zoom)
    x = int(round(framing.x * src_w - w / 2))
    y = int(round(framing.y * src_h - h / 2))
    x = min(max(0, x), src_w - w)
    y = min(max(0, y), src_h - h)
    return CropRect(w, h, x, y)


def push_filter(push: Push, target: Target, frames: int, fps: int) -> str:
    """zoompan expression for a linear push from ``start`` to ``end`` zoom."""
    z = f"{push.start}+{push.end - push.start}*on/{frames}"
    if push.anchor == "bottom":
        y = "ih-(ih/zoom)"
    else:
        y = "ih/2-(ih/zoom/2)"
    return f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='{y}':d=1:s={target.width}x{target.height}:fps={fps}"


def normalize_filters(clip: Clip, src_w: int, src_h: int, target: Target, fps: int) -> list[str]:
    """The full per-clip filter chain: crop → scale → fps → push → gamma."""
    rect = crop_rect(src_w, src_h, target, clip.framing_for(target.name))
    chain = [
        rect.filter(),
        f"scale={target.width}:{target.height}:flags=lanczos",
        f"fps={fps}",
    ]
    if clip.push:
        chain.append(push_filter(clip.push, target, clip.frames(fps), fps))
    chain += [f"eq=gamma={clip.gamma}", "format=yuv420p", "setsar=1"]
    return chain
