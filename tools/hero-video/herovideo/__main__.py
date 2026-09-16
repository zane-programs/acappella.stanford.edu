"""CLI. Run ``python3 tools/hero-video/build.py --help``."""

from __future__ import annotations

import argparse
from pathlib import Path

from .config import Config, Layout, DEFAULT_CONFIG


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(
        prog="hero-video",
        description="Build the homepage hero loop from loop.json. Steps: fetch → review → normalize → assemble → encode → deliver.",
    )
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG, help="edit file (default: loop.json)")
    parser.add_argument("-t", "--target", action="append", dest="targets", metavar="NAME",
                        help="only this target (repeatable); default: all targets in loop.json")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("fetch", help="download each clip's source window into .work/sources (cached)")
    p.add_argument("--force", action="store_true", help="re-download even if cached")

    p = sub.add_parser("describe", help="print a loop.json `videos` entry for YouTube ids")
    p.add_argument("ids", nargs="+")

    sub.add_parser("review", help="write framing sheets to .work/review so you can tune `framing` per target")

    p = sub.add_parser("normalize", help="render each clip for each target (near-lossless, exact frame count)")
    p.add_argument("--clip", type=int, action="append", dest="clips", metavar="ORDER", help="only this clip (repeatable)")

    sub.add_parser("assemble", help="grade, crossfade, loop-trim and denoise into a master per target")

    p = sub.add_parser("encode", help="write hero-loop*.mp4/.webm into public/assets/video")
    p.add_argument("--kind", choices=["mp4", "webm"], action="append", dest="kinds", help="only this container (repeatable)")

    sub.add_parser("deliver", help="posters, credits.json and contact sheets from the delivered encodes")
    sub.add_parser("status", help="show what is in public/assets/video and the last render's numbers")
    sub.add_parser("all", help="normalize → assemble → encode → deliver (sources must be fetched)")

    args = parser.parse_args(argv)
    config = Config.load(args.config)
    layout = Layout()
    targets = config.select_targets(args.targets)

    if args.command == "fetch":
        from .fetch import fetch
        fetch(config, layout, force=args.force)
    elif args.command == "describe":
        from .fetch import describe
        describe(args.ids)
    elif args.command == "review":
        from .review import review
        review(config, layout, targets)
    elif args.command == "normalize":
        from .normalize import normalize
        normalize(config, layout, targets, only=set(args.clips) if args.clips else None)
    elif args.command == "assemble":
        from .assemble import assemble
        assemble(config, layout, targets)
    elif args.command == "encode":
        from .encode import encode
        encode(config, layout, targets, args.kinds or ["mp4", "webm"])
    elif args.command == "deliver":
        from .deliver import deliver
        deliver(config, layout, targets)
    elif args.command == "status":
        from .deliver import summary
        summary(config, layout, targets)
    elif args.command == "all":
        from .normalize import normalize
        from .assemble import assemble
        from .encode import encode
        from .deliver import deliver, summary
        normalize(config, layout, targets)
        assemble(config, layout, targets)
        encode(config, layout, targets, ["mp4", "webm"])
        deliver(config, layout, targets)
        summary(config, layout, targets)


if __name__ == "__main__":
    main()
