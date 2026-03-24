---
name: ja-pre-pr-readiness
description: Run a final pre-PR release-hygiene workflow for the JobAlchemist static site. Use when branch work is complete and before opening/merging a PR to ensure AGENT.md guidance, llms.txt, sitemap.xml, robots/discovery coherence, page metadata, and internal links are accurate and consistent.
---

# JA Pre-PR Readiness

## Overview

Run a deterministic final pass before PR. Validate technical hygiene, apply missing updates, and produce a concise readiness summary with any residual risks.

## Workflow

1. Scope branch changes.
- Run `git diff --name-status main...HEAD` (or `origin/main...HEAD` when available).
- Identify changed page files (`*.html`) and discovery/docs files (`AGENT.md`, `llms.txt`, `sitemap.xml`, `robots.txt`).

2. Run deterministic validation.
- Execute:
  - `python3 .codex/skills/ja-pre-pr-readiness/scripts/validate-site-readiness.py --repo-root .`
- On Windows-only environments, fallback is:
  - `powershell -ExecutionPolicy Bypass -File .codex/skills/ja-pre-pr-readiness/scripts/validate-site-readiness.ps1 -RepoRoot .`
- Treat validator failures as blocking for PR.

3. Fix metadata and discovery drift.
- For changed indexable pages, update:
  - `<title>`, `<meta name="description">`, canonical, OG/Twitter tags.
  - `og:updated_time` and JSON-LD `dateModified` where present.
- Sync `sitemap.xml` `<lastmod>` for changed indexable pages.
- Sync `llms.txt`:
  - Canonical page list (add/remove pages if needed).
  - "Last updated" date.

4. Review agent/operator docs.
- Update `AGENT.md` when behavior or workflow changed (new JS interactions, new page family, new required files, new validation steps).
- Keep instructions aligned with actual repo behavior.

5. Run manual smoke checks.
- Serve locally:
  - `python -m http.server 8000`
- Check core pages on desktop/mobile:
  - `index.html`
  - `students.html`
  - `outplacement-support.html`
  - `resources/index.html`

6. Prepare PR readiness summary.
- Report:
  - Files updated.
  - Validator status.
  - Remaining manual checks (if any).
  - Anything intentionally deferred.

## Repo-Specific Rules

- Keep AU/NZ language conventions (`en-NZ`, AU/NZ spelling) unless a page has a clear exception.
- Preserve `site-assests/` folder spelling unless doing a full migration.
- Keep noindex behavior for print/non-indexable pages.
- Do not raise a PR with stale dates across metadata/discovery files.

## References

- For the final human checklist and PR summary template, read:
  - `references/final-pr-checklist.md`
- For deterministic checks, use:
  - `scripts/validate-site-readiness.py` (cross-platform default)
  - `scripts/validate-site-readiness.ps1` (Windows fallback)
