#!/usr/bin/env python3
import argparse
import os
import re
import subprocess
import sys
from pathlib import Path


class Reporter:
    def __init__(self) -> None:
        self.errors = 0
        self.warnings = 0

    def error(self, msg: str) -> None:
        print(f"ERROR: {msg}")
        self.errors += 1

    def warn(self, msg: str) -> None:
        print(f"WARN:  {msg}")
        self.warnings += 1


def first_match(text: str, pattern: str) -> str | None:
    m = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL)
    if not m:
        return None
    return m.group(1)


def all_matches(text: str, pattern: str) -> list[str]:
    return re.findall(pattern, text, flags=re.IGNORECASE | re.DOTALL)


def expected_canonical_url(file_path: Path, repo_root: Path) -> str:
    rel = file_path.relative_to(repo_root).as_posix()
    if rel == "index.html":
        return "https://www.jobalchemist.tech/"
    if rel.endswith("/index.html"):
        return f"https://www.jobalchemist.tech/{rel[:-11]}/"
    return f"https://www.jobalchemist.tech/{rel}"


def resolve_local_path(value: str, page_dir: Path, repo_root: Path) -> Path | None:
    if re.match(r"^(https?:|mailto:|tel:|data:|javascript:|//|#)", value, flags=re.IGNORECASE):
        return None
    clean = value.split("#", 1)[0].split("?", 1)[0].strip()
    if not clean:
        return None
    if clean.startswith("/"):
        return repo_root / clean.lstrip("/")
    return page_dir / clean


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate JobAlchemist site readiness.")
    parser.add_argument("--repo-root", default=".", help="Repo root path")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    report = Reporter()
    print(f"Running site readiness checks in {repo_root}")

    html_files: list[Path] = []
    for root, dirs, files in os.walk(repo_root):
        dirs[:] = [d for d in dirs if d != ".codex"]
        for f in files:
            if f.lower().endswith(".html"):
                html_files.append(Path(root) / f)

    if not html_files:
        report.error("No HTML files found in repo.")

    indexable_canonical_to_date: dict[str, str] = {}
    indexable_canonical_to_file: dict[str, str] = {}

    for html_file in html_files:
        text = html_file.read_text(encoding="utf-8")
        rel = html_file.relative_to(repo_root).as_posix()

        lang = first_match(text, r'<html[^>]*\blang="([^"]+)"')
        if not lang:
            report.error(f"{rel} missing <html lang>.")
        elif lang != "en-NZ":
            report.error(f"{rel} lang is '{lang}' (expected en-NZ).")

        if not first_match(text, r"<title>\s*([^<]+?)\s*</title>"):
            report.error(f"{rel} missing <title>.")

        if not first_match(text, r'<meta[^>]*name="description"[^>]*content="([^"]+)"'):
            report.error(f"{rel} missing meta description.")

        canonical = first_match(text, r'<link[^>]*rel="canonical"[^>]*href="([^"]+)"')
        if not canonical:
            report.error(f"{rel} missing canonical URL.")
        elif not canonical.startswith("https://www.jobalchemist.tech/"):
            report.error(f"{rel} canonical must use https://www.jobalchemist.tech/.")

        robots = first_match(text, r'<meta[^>]*name="robots"[^>]*content="([^"]+)"') or ""
        is_noindex = "noindex" in robots.lower()

        if canonical and not is_noindex:
            expected = expected_canonical_url(html_file, repo_root)
            if canonical != expected:
                report.warn(f"{rel} canonical differs from expected path URL ({expected}).")

        if not is_noindex:
            required = {
                "og:title": r'<meta[^>]*property="og:title"[^>]*content="([^"]+)"',
                "og:description": r'<meta[^>]*property="og:description"[^>]*content="([^"]+)"',
                "og:url": r'<meta[^>]*property="og:url"[^>]*content="([^"]+)"',
                "og:image": r'<meta[^>]*property="og:image"[^>]*content="([^"]+)"',
                "twitter:card": r'<meta[^>]*name="twitter:card"[^>]*content="([^"]+)"',
                "twitter:title": r'<meta[^>]*name="twitter:title"[^>]*content="([^"]+)"',
                "twitter:description": r'<meta[^>]*name="twitter:description"[^>]*content="([^"]+)"',
                "twitter:image": r'<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"',
            }
            for key, pattern in required.items():
                if not first_match(text, pattern):
                    report.error(f"{rel} missing required tag: {key}.")

        og_url = first_match(text, r'<meta[^>]*property="og:url"[^>]*content="([^"]+)"')
        if og_url and canonical and og_url != canonical and not is_noindex:
            report.warn(f"{rel} has og:url that differs from canonical.")

        og_updated = first_match(text, r'<meta[^>]*property="og:updated_time"[^>]*content="([^"]+)"')
        og_date = None
        if og_updated:
            if not re.match(r"^\d{4}-\d{2}-\d{2}T", og_updated):
                report.error(f"{rel} og:updated_time has invalid format.")
            else:
                og_date = og_updated[:10]

        date_modified_values = all_matches(text, r'"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"')
        date_modified = date_modified_values[0] if date_modified_values else None

        if date_modified and og_date and date_modified != og_date:
            report.error(
                f"{rel} has mismatched dateModified ({date_modified}) and og:updated_time ({og_date})."
            )

        resolved_date = date_modified or og_date
        if not is_noindex and canonical:
            indexable_canonical_to_file[canonical] = rel
            if resolved_date:
                indexable_canonical_to_date[canonical] = resolved_date

        page_dir = html_file.parent
        for ref in all_matches(text, r'(?:href|src)\s*=\s*"([^"]+)"'):
            resolved = resolve_local_path(ref, page_dir, repo_root)
            if resolved and not resolved.exists():
                report.error(f"{rel} references missing path: {ref}")

        for modal_ref in all_matches(text, r'data-image-modal\s*=\s*"([^"]+)"'):
            resolved = resolve_local_path(modal_ref, page_dir, repo_root)
            if resolved and not resolved.exists():
                report.error(f"{rel} data-image-modal missing file: {modal_ref}")

    sitemap_map: dict[str, str] = {}
    sitemap_lastmods: list[str] = []
    sitemap_path = repo_root / "sitemap.xml"
    if not sitemap_path.exists():
        report.error("Missing sitemap.xml.")
    else:
        sitemap_text = sitemap_path.read_text(encoding="utf-8")
        for loc, lastmod in re.findall(
            r"<url>\s*<loc>([^<]+)</loc>[\s\S]*?<lastmod>([^<]+)</lastmod>",
            sitemap_text,
            flags=re.IGNORECASE,
        ):
            sitemap_map[loc.strip()] = lastmod.strip()
            sitemap_lastmods.append(lastmod.strip())
            if not re.match(r"^\d{4}-\d{2}-\d{2}$", lastmod.strip()):
                report.error(f"sitemap.xml lastmod has invalid format for {loc.strip()}: {lastmod.strip()}")

        for canonical in indexable_canonical_to_file:
            if canonical not in sitemap_map:
                report.error(f"sitemap.xml missing indexable page: {canonical}")
                continue
            if canonical in indexable_canonical_to_date:
                if indexable_canonical_to_date[canonical] != sitemap_map[canonical]:
                    report.warn(
                        f"Date mismatch for {canonical}: "
                        f"page={indexable_canonical_to_date[canonical]} sitemap={sitemap_map[canonical]}"
                    )

    llms_path = repo_root / "llms.txt"
    if not llms_path.exists():
        report.error("Missing llms.txt.")
    else:
        llms_text = llms_path.read_text(encoding="utf-8")
        llms_date = first_match(llms_text, r"## Last updated\s*\r?\n(\d{4}-\d{2}-\d{2})")
        if not llms_date:
            report.error("llms.txt missing '## Last updated' date.")

        llms_urls = set(all_matches(llms_text, r"(https://www\.jobalchemist\.tech[^\s]+)"))
        for canonical in sitemap_map:
            if canonical not in llms_urls:
                report.warn(f"llms.txt canonical list missing sitemap URL: {canonical}")

        if llms_date:
            all_dates = sitemap_lastmods + list(indexable_canonical_to_date.values())
            if all_dates:
                latest = sorted(all_dates)[-1]
                if llms_date < latest:
                    report.warn(f"llms.txt date ({llms_date}) is older than latest metadata date ({latest}).")

    if not (repo_root / "AGENT.md").exists():
        report.warn("AGENT.md missing at repo root.")

    try:
        diff_check = subprocess.run(
            ["git", "diff", "--check"],
            cwd=repo_root,
            capture_output=True,
            text=True,
            check=False,
        )
        out = (diff_check.stdout or "").strip()
        if out:
            report.error(f"git diff --check reported whitespace issues.\n{out}")
    except FileNotFoundError:
        report.warn("git not found; skipped whitespace check.")

    print(f"\nValidation complete: {report.errors} error(s), {report.warnings} warning(s).")
    return 1 if report.errors else 0


if __name__ == "__main__":
    sys.exit(main())
