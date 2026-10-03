#!/usr/bin/env python3
"""Sync versions + descriptions in skills.json and llms.txt to match SKILL.md frontmatter.
One-shot fix for all 18 version mismatches + git/telegram description mismatches.

JSON-output contract (doctor pattern, runkids/skillshare `doctor --format json`
shape, MIT pattern-only): `python3 scripts/sync_registry.py --json` is
READ-ONLY (no writes) and prints
{"tool":"sync_registry","passed":bool,"drift":[{"name":..,"issues":["version"|"description"]}],
"counts":{"checked":N,"drifted":M}} with exit 0 (no drift) / 1 (drift) / 2 (error).
Default (no flag) behavior unchanged.
"""
import argparse
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(ROOT, "skills.json")
LLM_PATH = os.path.join(ROOT, "llms.txt")


def fm_fields(skill_path: str) -> dict:
    raw = open(os.path.join(ROOT, skill_path), encoding="utf-8").read()
    m = re.match(r"^---\n([\s\S]*?)\n---\n", raw)
    if not m:
        return {}
    out = {}
    for line in m.group(1).split("\n"):
        kv = re.match(r'^(name|version|description):\s*"?(.*?)"?\s*$', line)
        if kv:
            out[kv[1]] = kv[2]
    return out


def json_report() -> int:
    """Read-only drift check; exit 0 clean / 1 drift / 2 error."""
    try:
        data = json.load(open(JSON_PATH, encoding="utf-8"))
        skills = data["skills"]
    except Exception as e:  # noqa: BLE001 — error exit path, message is the payload
        print(json.dumps({"tool": "sync_registry", "passed": False, "error": str(e)}))
        return 2
    drift = []
    for s in skills:
        fm = fm_fields(s["path"])
        issues = []
        if fm.get("version", s["version"]) != s["version"]:
            issues.append("version")
        if fm.get("description", s["description"]) != s["description"]:
            issues.append("description")
        if issues:
            drift.append({"name": s["name"], "issues": issues})
    print(json.dumps({"tool": "sync_registry", "passed": not drift, "drift": drift,
                      "counts": {"checked": len(skills), "drifted": len(drift)}}))
    return 0 if not drift else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true", help="read-only drift report as JSON (doctor contract)")
    args = ap.parse_args()
    if args.json:
        return json_report()
    data = json.load(open(JSON_PATH, encoding="utf-8"))
    skills = data["skills"]

    # 1. Sync skills.json versions + descriptions from SKILL.md frontmatter
    fixed = []
    for s in skills:
        fm = fm_fields(s["path"])
        old_ver = s["version"]
        old_desc = s["description"]
        s["version"] = fm.get("version", old_ver)
        s["description"] = fm.get("description", old_desc)
        if s["version"] != old_ver or s["description"] != old_desc:
            why = []
            if s["version"] != old_ver:
                why.append(f"ver {old_ver}→{s['version']}")
            if s["description"] != old_desc:
                why.append("desc")
            fixed.append(f"{s['name']:<22} {', '.join(why)}")

    json.dump(data, open(JSON_PATH, "w", encoding="utf-8"), indent=2)
    # json.dump writes \n at end when indent is set; ensure trailing newline
    with open(JSON_PATH, "a", encoding="utf-8") as f:
        f.write("\n")

    print(f"skills.json: fixed {len(fixed)} skill(s)")
    for line in fixed:
        print(f"  {line}")

    # 2. Sync llms.txt descriptions from skills.json (already updated)
    llms = open(LLM_PATH, encoding="utf-8").read().split("\n")
    ll_fixed = []
    for i, line in enumerate(llms):
        for s in skills:
            prefix = f"- [{s['name']}]({s['path']}): "
            if line.startswith(prefix):
                new_line = prefix + s["description"]
                if line != new_line:
                    llms[i] = new_line
                    ll_fixed.append(s["name"])
                break
    open(LLM_PATH, "w", encoding="utf-8").write("\n".join(llms))
    if ll_fixed:
        print(f"\nllms.txt: fixed {len(ll_fixed)} line(s)")
        for n in ll_fixed:
            print(f"  {n}")
    else:
        print("\nllms.txt: no changes needed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
