#!/usr/bin/env python3
"""Archive a session report into .agents/archive/reports/.

Session-versioned: each run produces session-<id>--<date>.html.
Reads an existing .agents/artifacts/drafts/session-history-*.html,
copies it into the archive with a versioned name, prints the new path.

Usage:
    python3 scripts/gen-repo-report.py                          # auto-detect latest
    python3 scripts/gen-repo-report.py path/to/session.html     # explicit source
"""
import os
import re
import shutil
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRAFTS = os.path.join(ROOT, ".agents", "artifacts", "drafts")
ARCHIVE = os.path.join(ROOT, ".agents", "archive", "reports")


def default_source():
    """Find the most recent session-history HTML in drafts."""
    pattern = re.compile(r"^session-history-\d{4}-\d{2}-\d{2}\.html$")
    candidates = [
        f for f in os.listdir(DRAFTS)
        if pattern.match(f) and os.path.isfile(os.path.join(DRAFTS, f))
    ]
    if not candidates:
        print("[gen-repo-report] no session-history-*.html found in drafts", file=sys.stderr)
        sys.exit(2)
    candidates.sort()
    return os.path.join(DRAFTS, candidates[-1])


def session_id_from_filename(filename):
    """Extract session identifier from filename (date portion)."""
    m = re.search(r"session-history-(\d{4}-\d{2}-\d{2})", filename)
    return m.group(1) if m else date.today().isoformat()


def main():
    source = sys.argv[1] if len(sys.argv) > 1 else default_source()

    if not os.path.isfile(source):
        print(f"[gen-repo-report] source not found: {source}", file=sys.stderr)
        sys.exit(2)

    os.makedirs(ARCHIVE, exist_ok=True)

    src_name = os.path.basename(source)
    sid = session_id_from_filename(src_name)
    today = date.today().isoformat()
    dest_name = f"session-{sid}--{today}.html"
    dest = os.path.join(ARCHIVE, dest_name)

    shutil.copy2(source, dest)
    size = os.path.getsize(dest)
    print(f"[gen-repo-report] archived: {dest} ({size} bytes)")


if __name__ == "__main__":
    main()
