#!/usr/bin/env python3
"""Validate JobAlchemist resource pages for core SEO/AEO and style rules."""

from __future__ import annotations

import re
import sys
from pathlib import Path

REQUIRED_INTERNAL_TARGETS = (
    "../index.html",
    "../students.html",
    "../outplacement-support.html",
)

US_SPELLINGS = {
    "analyze": "analyse",
    "analyzing": "analysing",
    "optimize": "optimise",
    "optimization": "optimisation",
    "optimizing": "optimising",
    "prioritize": "prioritise",
    "prioritization": "prioritisation",
    "organize": "organise",
    "organization": "organisation",
    "stabilize": "stabilise",
}


def check(path: Path) -> list[str]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    lower = text.lower()

    if 'class="legal-page resource-page"' not in text:
        errors.append("missing body class 'legal-page resource-page'")

    if '<meta name="description"' not in text:
        errors.append("missing meta description")

    if '<link rel="canonical" href="https://www.jobalchemist.tech/resources/' not in text:
        errors.append("canonical URL is missing or not under /resources/")

    if "<h1" not in text:
        errors.append("missing H1")

    if path.name != "index.html" and "related resources" not in lower:
        errors.append("missing 'Related resources' section")

    if 'href="index.html"' not in text:
        errors.append("missing link back to resources hub (index.html)")

    if not any(f'href="{target}"' in text for target in REQUIRED_INTERNAL_TARGETS):
        errors.append("missing link to core product pages")

    for us, au in US_SPELLINGS.items():
        if re.search(rf"\b{re.escape(us)}\b", lower):
            errors.append(f"US spelling detected: '{us}' (prefer '{au}')")

    return errors


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("Usage: validate_resource_page.py <file1.html> [file2.html ...]")
        return 2

    exit_code = 0
    for arg in argv[1:]:
        path = Path(arg)
        if not path.exists():
            print(f"[FAIL] {arg}: file not found")
            exit_code = 1
            continue
        errs = check(path)
        if errs:
            print(f"[FAIL] {arg}")
            for err in errs:
                print(f"  - {err}")
            exit_code = 1
        else:
            print(f"[OK] {arg}")

    return exit_code


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
