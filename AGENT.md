# JobAlchemist Agent Guide

## Purpose
This repository hosts the production static website for JobAlchemist (`https://www.jobalchemist.tech`) on GitHub Pages.

Use this guide when making content, SEO, UX, or structural updates so changes stay consistent with the live site.

## Stack and Runtime
- Static site only: HTML + CSS + vanilla JS.
- No build step, no package manager, no framework.
- Shared styles in `styles.css`.
- Shared interactions in `script.js` (mobile nav + proof image modal).
- Assets live in `site-assests/` (intentional existing folder name; do not rename without full path migration).

## Core File Map
- `index.html`: Main product landing page (general job seekers).
- `students.html`: Student/first-job audience landing page.
- `outplacement-support.html`: HR/people leader outplacement page.
- `outplacement-support-print.html`: Print-friendly outplacement flyer (`noindex`).
- `resources/index.html`: Resources hub.
- `resources/*.html`: SEO/AEO resource pages.
- `terms.html`, `privacy.html`: Policy pages.
- `sitemap.xml`, `robots.txt`, `llms.txt`, `CNAME`: Discovery/domain files.

## Content and Brand Rules
- English variant is AU/NZ (`en-NZ` in pages, AU/NZ spellings in copy).
- Keep core positioning aligned with current messaging:
  - "Apply with confidence, not guesswork."
  - Product helps users analyse job ads, assess fit, and tailor CV/cover letter drafts.
- Preserve audience separation:
  - Main page: broad job seekers.
  - `students.html`: student and early-career language/examples.
  - `outplacement-support.html`: HR/employer tone and outcomes.

## SEO/AEO Baseline (All Public Pages)
- Keep `<html lang="en-NZ">`.
- Keep unique `<title>` and `<meta name="description">`.
- Keep canonical URL using `https://www.jobalchemist.tech/...`.
- Keep Open Graph and Twitter meta tags aligned with page intent.
- Keep/maintain JSON-LD blocks and ensure structured data matches visible content.
- Update page freshness fields when content materially changes:
  - JSON-LD `dateModified`.
  - `og:updated_time` on pages that already use it.

## Internal Linking Expectations
- Resource pages should include:
  - Link to `../index.html`.
  - Link to relevant audience page(s): `../students.html` and/or `../outplacement-support.html`.
  - Link back to `resources/index.html`.
  - "Related resources" list for topic clustering.
- Keep footer links consistent across page families.

## Required Discovery Updates
When adding a new indexable page (especially in `resources/`), update all of:
1. `resources/index.html` (new link/card).
2. `sitemap.xml` (new `<url>` entry + accurate `<lastmod>` date).
3. `llms.txt` (canonical page entry in the "Canonical pages" list).

When only editing existing content, update `lastmod`/`dateModified` where appropriate.

## JS and UI Interaction Constraints
- `script.js` currently supports:
  - Mobile nav toggle (`.nav-toggle`, `.nav-menu`).
  - Proof image modal (`#image-modal`, `#image-modal-img`, `data-image-modal` attributes).
- If you add/modify proof image cards in `index.html` or `students.html`, keep modal data attributes and IDs intact.
- Test desktop + mobile behavior after nav, modal, or layout edits.

## Analytics and Third-Party Includes
- `index.html` and `students.html` include PostHog snippet (`us.i.posthog.com`).
- Bootstrap Icons CDN is used in key pages.
- Do not remove tracking/scripts unintentionally during content edits.

## Recommended Validation Workflow
1. Review changed files for broken internal links and asset paths.
2. For resource-page work, run:
   - `python3 .codex/skills/ja-resource-page-builder/scripts/validate_resource_page.py resources/*.html`
3. Serve locally and manually verify:
   - `python3 -m http.server 8000`
   - Check `index.html`, `students.html`, `outplacement-support.html`, `resources/index.html`.
4. Confirm `sitemap.xml`, `robots.txt`, and `llms.txt` remain coherent.

## Repo-Specific Skill
For planning or creating resource pages, use:
- `.codex/skills/ja-resource-page-builder/SKILL.md`

That workflow requires:
- Auditing existing site content first.
- Doing web research before recommendations/drafting.
- AU/NZ language compliance.
- Updating `resources/index.html`, `sitemap.xml`, and `llms.txt`.
