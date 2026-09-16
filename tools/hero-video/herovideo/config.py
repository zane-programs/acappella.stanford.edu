"""Typed view of ``loop.json`` plus the work/output directory layout."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

TOOL_DIR = Path(__file__).resolve().parent.parent
REPO_DIR = TOOL_DIR.parent.parent
DEFAULT_CONFIG = TOOL_DIR / "loop.json"
WORK_DIR = TOOL_DIR / ".work"
OUTPUT_DIR = REPO_DIR / "public" / "assets" / "video"


def _timecode(text: str) -> float:
    """``MM:SS`` or ``MM:SS.s`` (or plain seconds) to seconds."""
    if ":" not in text:
        return float(text)
    minutes, seconds = text.split(":", 1)
    return int(minutes) * 60 + float(seconds)


def _window_tag(text: str) -> str:
    """``01:30-01:50`` -> ``0130-0150`` for use in cache filenames."""
    return text.replace(":", "").replace(".", "_")


@dataclass(frozen=True)
class Framing:
    """Where a clip is cropped for one target, in source-relative units.

    ``x``/``y`` are the crop centre as fractions of the source width/height;
    ``zoom`` is how much tighter than the largest cover crop (1 = whole cover).
    """

    x: float = 0.5
    y: float = 0.5
    zoom: float = 1.0

    @staticmethod
    def parse(raw: dict | None) -> "Framing":
        raw = raw or {}
        return Framing(float(raw.get("x", 0.5)), float(raw.get("y", 0.5)), float(raw.get("zoom", 1.0)))


@dataclass(frozen=True)
class Push:
    """A slow push-in over the length of the clip (a zoompan filter)."""

    start: float
    end: float
    anchor: str  # "center" | "bottom"

    @staticmethod
    def parse(raw: dict | None) -> "Push | None":
        if not raw:
            return None
        return Push(float(raw.get("from", 1.0)), float(raw.get("to", 1.06)), str(raw.get("anchor", "center")))


@dataclass(frozen=True)
class Clip:
    order: int
    video: str  # YouTube id
    window: str  # "MM:SS-MM:SS" fetched from the source; the cache key
    offset: float  # seconds into the window where the clip starts
    duration: float
    gamma: float
    framing: dict[str, Framing]  # per target name; missing -> Framing()
    push: Push | None

    @property
    def window_start(self) -> float:
        return _timecode(self.window.split("-")[0])

    @property
    def window_end(self) -> float:
        return _timecode(self.window.split("-")[1])

    @property
    def source_stem(self) -> str:
        return f"{self.video}_{_window_tag(self.window)}"

    def source_in(self) -> float:
        """Start of the clip as seconds into the original YouTube video."""
        return self.window_start + self.offset

    def framing_for(self, target: str) -> Framing:
        return self.framing.get(target, Framing())

    def frames(self, fps: int) -> int:
        return round(self.duration * fps)


@dataclass(frozen=True)
class Ladder:
    """CRF values tried in order until the output is under ``max_bytes``."""

    crf: tuple[int, ...]
    max_bytes: int
    seam_quality: int  # x264 qp / vp9 crf for the lone frame-0 intra segment


@dataclass(frozen=True)
class Target:
    name: str
    width: int
    height: int
    suffix: str  # appended to output basenames, e.g. "-mobile"
    mp4: Ladder
    webm: Ladder
    poster_max_bytes: int

    @property
    def aspect(self) -> float:
        return self.width / self.height

    def output(self, kind: str) -> Path:
        base = {"mp4": "hero-loop", "webm": "hero-loop", "poster": "hero-poster"}[kind]
        ext = "jpg" if kind == "poster" else kind
        return OUTPUT_DIR / f"{base}{self.suffix}.{ext}"


@dataclass(frozen=True)
class Video:
    id: str
    group: str
    title: str
    channel: str

    @property
    def url(self) -> str:
        return f"https://www.youtube.com/watch?v={self.id}"


@dataclass(frozen=True)
class Config:
    fps: int
    crossfade: float
    grade: str
    denoise: str
    targets: dict[str, Target]
    clips: list[Clip]
    videos: dict[str, Video]
    path: Path = field(default=DEFAULT_CONFIG)

    @staticmethod
    def load(path: Path = DEFAULT_CONFIG) -> "Config":
        raw = json.loads(path.read_text())
        targets = {
            name: Target(
                name=name,
                width=int(t["width"]),
                height=int(t["height"]),
                suffix=str(t.get("suffix", "")),
                mp4=_ladder(t["mp4"]),
                webm=_ladder(t["webm"]),
                poster_max_bytes=int(t.get("posterMaxBytes", 250_000)),
            )
            for name, t in raw["targets"].items()
        }
        clips = sorted(
            (
                Clip(
                    order=int(c["order"]),
                    video=str(c["video"]),
                    window=str(c["window"]),
                    offset=float(c["offset"]),
                    duration=float(c["duration"]),
                    gamma=float(c.get("gamma", 1.0)),
                    framing={k: Framing.parse(v) for k, v in (c.get("framing") or {}).items()},
                    push=Push.parse(c.get("push")),
                )
                for c in raw["clips"]
            ),
            key=lambda c: c.order,
        )
        videos = {
            vid: Video(id=vid, group=str(v["group"]), title=str(v["title"]), channel=str(v["channel"]))
            for vid, v in raw["videos"].items()
        }
        for clip in clips:
            if clip.video not in videos:
                raise SystemExit(f"loop.json: clip {clip.order} uses video {clip.video} with no entry in \"videos\"")
            unknown = set(clip.framing) - set(targets)
            if unknown:
                raise SystemExit(f"loop.json: clip {clip.order} has framing for unknown target(s) {sorted(unknown)}")
        return Config(
            fps=int(raw.get("fps", 30)),
            crossfade=float(raw.get("crossfade", 0.9)),
            grade=str(raw["grade"]),
            denoise=str(raw.get("denoise", "")),
            targets=targets,
            clips=clips,
            videos=videos,
            path=path,
        )

    def video_for(self, clip: Clip) -> Video:
        return self.videos[clip.video]

    def select_targets(self, names: list[str] | None) -> list[Target]:
        if not names:
            return list(self.targets.values())
        missing = [n for n in names if n not in self.targets]
        if missing:
            raise SystemExit(f"unknown target(s) {missing}; have {sorted(self.targets)}")
        return [self.targets[n] for n in names]


def _ladder(raw: dict) -> Ladder:
    return Ladder(
        crf=tuple(int(v) for v in raw["crf"]),
        max_bytes=int(raw["maxBytes"]),
        seam_quality=int(raw.get("seamQuality", 20)),
    )


class Layout:
    """Where intermediate files go. Everything under ``.work`` is disposable."""

    def __init__(self, work: Path = WORK_DIR):
        self.work = work
        self.sources = work / "sources"
        self.review = work / "review"

    def source(self, clip: Clip) -> Path | None:
        """The cached window for a clip, whatever container yt-dlp chose."""
        matches = sorted(self.sources.glob(f"{clip.source_stem}.*"))
        matches = [m for m in matches if m.suffix in {".mp4", ".webm", ".mkv"}]
        return matches[0] if matches else None

    def source_meta(self, clip: Clip) -> Path:
        return self.sources / f"{clip.source_stem}.json"

    def norm_dir(self, target: Target) -> Path:
        return self.work / "norm" / target.name

    def norm(self, target: Target, clip: Clip) -> Path:
        return self.norm_dir(target) / f"{clip.order:02d}.mp4"

    def build_dir(self, target: Target) -> Path:
        return self.work / "build" / target.name

    def master(self, target: Target) -> Path:
        return self.build_dir(target) / "master.mp4"

    def master_denoised(self, target: Target) -> Path:
        return self.build_dir(target) / "master-denoised.mp4"

    def report(self, target: Target) -> Path:
        return self.build_dir(target) / "report.json"
