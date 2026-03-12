# Resource Page Template (JobAlchemist)

Use this structure for new pages in `resources/`.

## 1) Head metadata
- Intent-aligned `<title>`
- Intent-aligned `<meta name="description">`
- Canonical URL under `https://www.jobalchemist.tech/resources/...`
- Matching `og:title`, `og:description`, `og:url`, `twitter:title`, `twitter:description`

## 2) Page body structure
1. Intro with direct answer/value.
2. 3-6 practical sections (steps, checklist, framework, comparison).
3. Contextual “Use JobAlchemist for this workflow” section linking to:
   - `../index.html`
   - `../students.html` and/or `../outplacement-support.html`
4. `Related resources` block linking to `resources/index.html` and related pages.

## 3) JSON-LD
Use one of these depending on content:
- `WebPage`
- `HowTo` for process/tutorial pages
- `FAQPage` only when visible FAQ exists and text matches exactly

## 4) Footer/navigation
- Keep existing site footer style.
- Ensure resource pages can navigate back to hub (`resources/index.html`).

## 5) Language
- AU/NZ spellings only.
- Keep wording practical and concrete.

## 6) External links
- Add external links only when citing specific facts/frameworks.
- Prefer high-trust sources.
