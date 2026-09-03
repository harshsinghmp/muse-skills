#!/usr/bin/env python3
"""
Refactoring UI Anti-Pattern Linter / Static Auditor (Zero Dependencies)
Scans frontend files (JSX, TSX, Vue, HTML, CSS) for common visual design anti-patterns.
"""

import sys
import os
import re
import argparse

PATTERNS = [
    {
        "id": "ARBITRARY_PIXELS",
        "regex": re.compile(r'(?:p|m|gap|w|h|text)-\[(\d+)px\]', re.IGNORECASE),
        "message": "Arbitrary pixel value '{match}' detected. Use standard 4px/8px scale tokens instead (e.g. p-4, text-sm, gap-6).",
        "severity": "WARNING"
    },
    {
        "id": "INACCESSIBLE_GRAY_TEXT",
        "regex": re.compile(r'\btext-(?:gray|slate|zinc|neutral|stone)-(?:200|300|400)\b', re.IGNORECASE),
        "message": "Potential low-contrast gray text class '{match}'. Check if it meets WCAG AA (≥ 4.5:1). Prefer text-muted-foreground or 600+ for body copy.",
        "severity": "WARNING"
    },
    {
        "id": "PURE_BLACK_TEXT",
        "regex": re.compile(r'(?:color:\s*#000000|color:\s*#000\b|\btext-black\b)', re.IGNORECASE),
        "message": "Pure black text '{match}' detected. Prefer deep tinted neutrals (#0f172a / slate-900 / zinc-900) to avoid optical vibration.",
        "severity": "SUGGESTION"
    },
    {
        "id": "SYMMETRICAL_SHADOW",
        "regex": re.compile(r'box-shadow:\s*0\s+0\s+\d+px', re.IGNORECASE),
        "message": "Symmetrical shadow '{match}' detected. Natural light comes from above; ensure vertical Y-offset > 0.",
        "severity": "WARNING"
    },
    {
        "id": "ALL_CAPS_NO_TRACKING",
        "regex": re.compile(r'\buppercase\b(?!.*\btracking-(?:wider|widest)\b)', re.IGNORECASE),
        "message": "Uppercase text without wide letter-spacing. Add 'tracking-wider' or 'tracking-widest' to improve optical legibility.",
        "severity": "SUGGESTION"
    }
]


def audit_file(filepath: str):
    if not os.path.exists(filepath):
        print(f"Error: File not found at {filepath}", file=sys.stderr)
        return False, 0
    
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()
        
    issues = []
    for line_idx, line in enumerate(lines, start=1):
        for pattern in PATTERNS:
            matches = pattern["regex"].findall(line)
            for m in matches:
                match_str = m if isinstance(m, str) else m[0]
                issues.append({
                    "line": line_idx,
                    "id": pattern["id"],
                    "severity": pattern["severity"],
                    "message": pattern["message"].format(match=match_str),
                    "code": line.strip()
                })
                
    print("\n" + "=" * 60)
    print(f" Refactoring UI Static Audit: {os.path.basename(filepath)}")
    print("=" * 60)
    
    if not issues:
        print("✅ No common Refactoring UI anti-patterns detected.")
        print("=" * 60 + "\n")
        return True, 0
        
    for issue in issues:
        icon = "⚠️" if issue["severity"] == "WARNING" else "💡"
        print(f"{icon} Line {issue['line']} [{issue['severity']}] ({issue['id']}):")
        print(f"   {issue['message']}")
        print(f"   Snippet: {issue['code'][:80]}")
        print("-" * 60)
        
    print(f"Total findings: {len(issues)}")
    print("=" * 60 + "\n")
    return False, len(issues)


def main():
    parser = argparse.ArgumentParser(description="Audit a frontend file for Refactoring UI anti-patterns.")
    parser.add_argument("file", help="Path to frontend file (JSX, TSX, HTML, CSS)")
    args = parser.parse_args()
    
    success, count = audit_file(args.file)
    sys.exit(0 if count == 0 else 1)


if __name__ == "__main__":
    main()
