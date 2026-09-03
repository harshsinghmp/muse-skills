#!/usr/bin/env python3
"""
WCAG 2.1 Color Contrast Ratio Calculator (Zero Dependencies)
Calculates relative luminance and contrast ratio between foreground and background colors.
"""

import sys
import re
import argparse


def parse_hex(hex_str: str):
    """Normalize hex string to (R, G, B) tuple in 0-255 range."""
    hex_str = hex_str.strip().lstrip("#")
    if len(hex_str) == 3:
        hex_str = "".join([c * 2 for c in hex_str])
    if len(hex_str) != 6:
        raise ValueError(f"Invalid hex color format: #{hex_str}")
    return int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16)


def srgb_to_linear(channel: int) -> float:
    """Convert sRGB channel (0-255) to linear light value (0.0-1.0)."""
    c = channel / 255.0
    if c <= 0.04045:
        return c / 12.92
    else:
        return ((c + 0.055) / 1.055) ** 2.4


def relative_luminance(r: int, g: int, b: int) -> float:
    """Calculate relative luminance per WCAG 2.1 formula."""
    r_lin = srgb_to_linear(r)
    g_lin = srgb_to_linear(g)
    b_lin = srgb_to_linear(b)
    return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin


def calculate_contrast(fg_hex: str, bg_hex: str) -> float:
    """Calculate WCAG contrast ratio between foreground and background colors."""
    fg_rgb = parse_hex(fg_hex)
    bg_rgb = parse_hex(bg_hex)
    l1 = relative_luminance(*fg_rgb)
    l2 = relative_luminance(*bg_rgb)
    
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


def evaluate_contrast(ratio: float):
    """Evaluate contrast ratio against WCAG AA and AAA thresholds."""
    return {
        "ratio": f"{ratio:.2f}:1",
        "aa_normal_text": "PASS (≥ 4.5:1)" if ratio >= 4.5 else "FAIL (< 4.5:1)",
        "aa_large_text": "PASS (≥ 3.0:1)" if ratio >= 3.0 else "FAIL (< 3.0:1)",
        "aa_ui_components": "PASS (≥ 3.0:1)" if ratio >= 3.0 else "FAIL (< 3.0:1)",
        "aaa_normal_text": "PASS (≥ 7.0:1)" if ratio >= 7.0 else "FAIL (< 7.0:1)",
        "aaa_large_text": "PASS (≥ 4.5:1)" if ratio >= 4.5 else "FAIL (< 4.5:1)",
    }


def main():
    parser = argparse.ArgumentParser(description="WCAG 2.1 Contrast Ratio Calculator")
    parser.add_argument("--fg", required=True, help="Foreground color hex code (e.g. '#1E293B')")
    parser.add_argument("--bg", required=True, help="Background color hex code (e.g. '#FFFFFF')")
    
    args = parser.parse_args()
    
    try:
        ratio = calculate_contrast(args.fg, args.bg)
        results = evaluate_contrast(ratio)
        
        print("\n" + "=" * 50)
        print(f" WCAG 2.1 Contrast Assessment")
        print("=" * 50)
        print(f" Foreground : {args.fg}")
        print(f" Background : {args.bg}")
        print(f" Contrast Ratio : {results['ratio']}")
        print("-" * 50)
        print(f" • Normal Text (AA)      : {results['aa_normal_text']}")
        print(f" • Large Text (AA)       : {results['aa_large_text']}")
        print(f" • UI Components (AA)    : {results['aa_ui_components']}")
        print(f" • Normal Text (AAA)     : {results['aaa_normal_text']}")
        print(f" • Large Text (AAA)      : {results['aaa_large_text']}")
        print("=" * 50 + "\n")
        
        if ratio < 4.5:
            sys.exit(1)
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
