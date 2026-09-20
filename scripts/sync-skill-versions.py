#!/usr/bin/env python3
"""Sync skills.json version fields to match SKILL.md frontmatter.
One-shot: fixes all 18 version mismatches in one pass.

JSON-output contract (doctor pattern, runkids/skillshare `doctor --format json`
shape, MIT pattern-only): `--json` is READ-ONLY (no writes) and prints
{"tool":"sync_skill_versions","passed":bool,"drift":[{"name":..,"registry":..,"frontmatter":..}],
"counts":{"checked":N,"drifted":M}} with exit 0/1/2. Default behavior unchanged.
"""
import argparse
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
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true", help="read-only version-drift report as JSON (doctor contract)")
    args = ap.parse_args()
    data = json.load(open(JSON_PATH, encoding="utf-8"))
    skills = data["skills"]
    if args.json:
        drift = [{"name": s["name"], "registry": s["version"], "frontmatter": fm}
                 for s in skills if (fm := fm_version(s["path"])) and fm != s["version"]]
        print(json.dumps({"tool": "sync_skill_versions", "passed": not drift, "drift": drift,
                          "counts": {"checked": len(skills), "drifted": len(drift)}}))
        return 0 if not drift else 1
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
