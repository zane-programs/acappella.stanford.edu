"""Thin wrappers around ffmpeg / ffprobe / yt-dlp. No other module shells out."""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path


def tool(name: str) -> str:
    path = shutil.which(name)
    if not path:
        raise SystemExit(f"{name} not found on PATH (brew install {name})")
    return path


def run(cmd: list[str], *, log: Path | None = None, check: bool = True) -> subprocess.CompletedProcess[str]:
    """Run a command, capturing output. On failure print the tail of stderr."""
    result = subprocess.run(cmd, capture_output=True, text=True)
    if log is not None:
        log.parent.mkdir(parents=True, exist_ok=True)
        with log.open("a") as fh:
            fh.write("$ " + " ".join(cmd) + "\n" + result.stderr + "\n")
    if check and result.returncode != 0:
        print(result.stderr[-2000:], file=sys.stderr)
        raise SystemExit(f"command failed ({result.returncode}): {cmd[0]} … {cmd[-1]}")
    return result


def ffmpeg(args: list[str], *, log: Path | None = None) -> None:
    run([tool("ffmpeg"), "-hide_banner", "-loglevel", "error", "-y", *args], log=log)


def probe(path: Path) -> dict:
    """codec, width, height, fps (float), duration (s) of the first video stream."""
    out = run(
        [
            tool("ffprobe"),
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=codec_name,width,height,r_frame_rate,profile,level:format=duration,size",
            "-of",
            "json",
            str(path),
        ]
    ).stdout
    data = json.loads(out)
    stream = data["streams"][0]
    num, den = stream["r_frame_rate"].split("/")
    return {
        "codec": stream["codec_name"],
        "width": int(stream["width"]),
        "height": int(stream["height"]),
        "fps": int(num) / int(den),
        "profile": stream.get("profile"),
        "level": stream.get("level"),
        "duration": float(data["format"]["duration"]),
        "size": int(data["format"]["size"]),
    }


def count_frames(path: Path) -> int:
    out = run(
        [
            tool("ffprobe"),
            "-v",
            "error",
            "-count_frames",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=nb_read_frames",
            "-of",
            "default=nw=1:nk=1",
            str(path),
        ]
    ).stdout.strip()
    return int(out.splitlines()[0])


def extract_frame(video: Path, index: int, out: Path) -> None:
    """Write frame ``index`` (0-based) of ``video`` as a PNG."""
    out.parent.mkdir(parents=True, exist_ok=True)
    ffmpeg(["-i", str(video), "-vf", f"select=eq(n\\,{index})", "-frames:v", "1", str(out)])


def mean_abs_diff(a: Path, b: Path) -> float:
    """Mean absolute luma difference (0–255) between two same-size images.

    Used for the loop-seam check: last frame vs first frame should be ~0,
    while first vs second (ordinary motion) is the reference scale.
    """
    result = run(
        [
            tool("ffmpeg"),
            "-hide_banner",
            "-loglevel",
            "info",
            "-i",
            str(a),
            "-i",
            str(b),
            "-filter_complex",
            "[0:v][1:v]blend=all_mode=difference,format=gray,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-",
            "-f",
            "null",
            "-",
        ],
        check=False,
    )
    for line in result.stdout.splitlines():
        if "lavfi.signalstats.YAVG" in line:
            return float(line.split("=")[-1])
    raise SystemExit("could not measure seam difference:\n" + result.stderr[-800:])


def file_size(path: Path) -> int:
    return path.stat().st_size


def mb(n: int) -> str:
    return f"{n / 1e6:.2f} MB"
