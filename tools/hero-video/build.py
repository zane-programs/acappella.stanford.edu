#!/usr/bin/env python3
"""Shim so the pipeline runs from anywhere: ``python3 tools/hero-video/build.py <command>``."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from herovideo.__main__ import main  # noqa: E402

main()
