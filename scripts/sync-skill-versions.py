#!/usr/bin/env python3
"""Sync skills.json version fields to match SKILL.md frontmatter.
One-shot: fixes all 18 version mismatches in one pass.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(ROOT, "skills.json")


def fm_version(skill_path: str) -> str | None:
    raw = open(os.path.join(ROOT, skill_path), encoding="utf-8").read()
    m = re.match(r"^---\n([\s\S]*?)\n---\n", raw)
    if not m:
        return None
    for line in m.group(1).split("\n"):
        kv = re.match(r'^version:\s*"?(\d+\.\d+(?:\.\d+)?)"?\s*$', line)
        if kv:
            return kv.group(1)
    return None


def main():
    data = json.load(open(JSON_PATH, encoding="utf-8"))
    skills = data["skills"]
    fixed = []
    for s in skills:
        fm_ver = fm_version(s["path"])
        if fm_ver and fm_ver != s["version"]:
            old = s["version"]
            s["version"] = fm_ver
            fixed.append((s["name"], old, fm_ver))
    json.dump(data, open(JSON_PATH, "w", encoding="utf-8"), indent=2)
    json.dump(data, open(JSON_PATH, "w", encoding="utf-8"), indent=2)
    print(f"Fixed {len(fixed)} version(s):")
    for name, old, new in fixed:
        print(f"  {name:<22} {old!r:<10} -> {new!r}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
