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
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(ROOT, "skills.json")
LLM_PATH = os.path.join(ROOT, "llms.txt")


def safe_path(rel_path: str) -> str:
    """Resolve a repo-relative path and refuse anything that escapes ROOT."""
    resolved = os.path.realpath(os.path.join(ROOT, rel_path))
    if resolved != ROOT and not resolved.startswith(ROOT + os.sep):
        raise ValueError(f"path escapes repository: {rel_path}")
    return resolved


def patch_registry_text(raw: str, skills: list) -> str:
    """Replace each skill's version/description value without touching layout."""
    out = raw
    for skill in skills:
        name = json.dumps(skill["name"], ensure_ascii=False)
        start = out.find(f'"name": {name}')
        if start == -1:
            continue
        for field in ("version", "description"):
            if field not in skill:
                continue
            pattern = re.compile(rf'("{field}":\s*)("(?:[^"\\]|\\.)*")')
            match = pattern.search(out, start)
            # Compare decoded values, never encoded text: the registry mixes
            # literal and \u-escaped non-ASCII, and re-encoding a value that did
            # not change would rewrite the line for no reason.
            if match and json.loads(match.group(2)) != skill[field]:
                replacement = json.dumps(skill[field])
                out = out[: match.start(2)] + replacement + out[match.end(2) :]
    return out


def write_if_changed(path: str, text: str) -> bool:
    """Write only when the bytes differ, so a no-op sync leaves the tree clean."""
    current = open(path, encoding="utf-8").read() if os.path.exists(path) else None
    if current == text:
        return False
    atomic_write(path, text)
    return True


def atomic_write(path: str, text: str) -> None:
    """Write via a sibling temp file so a crash never truncates the registry."""
    fd, tmp = tempfile.mkstemp(dir=os.path.dirname(path), prefix=".tmp-registry-")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write(text)
        os.replace(tmp, path)
    except BaseException:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise


def fm_fields(skill_path: str) -> dict:
    raw = open(safe_path(skill_path), encoding="utf-8").read()
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
    raw_text = open(JSON_PATH, encoding="utf-8").read()
    data = json.loads(raw_text)
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

    # Canonical generated style: json.dumps(indent=2). The registry used to be
    # hand-formatted (some arrays inline, some wrapped inconsistently), which made
    # every sync rewrite the whole file. One style means a sync is idempotent.
    # Preserve formatting: sync only owns two scalar fields per skill, so patch
    # them in place instead of re-serialising. Re-serialising with json.dumps
    # rewrote every array in the file (the registry is formatter-maintained),
    # which made a no-op sync look like a 1000-line change.
    write_if_changed(JSON_PATH, patch_registry_text(raw_text, skills))

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
    atomic_write(LLM_PATH, "\n".join(llms))
    if ll_fixed:
        print(f"\nllms.txt: fixed {len(ll_fixed)} line(s)")
        for n in ll_fixed:
            print(f"  {n}")
    else:
        print("\nllms.txt: no changes needed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
