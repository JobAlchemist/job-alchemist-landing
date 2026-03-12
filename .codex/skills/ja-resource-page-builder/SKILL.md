---
name: ja-resource-page-builder
description: Recommend and create high-impact JobAlchemist resource pages for SEO and AEO outcomes. Use when users ask to plan new resource content, identify which pages to publish next, or create specific resource pages under resources/. This skill audits existing site content first, performs web research before recommending or drafting, uses AU/NZ English, adds strategic internal links to core JobAlchemist pages, and updates discovery files (resources/index.html, sitemap.xml, llms.txt).
---

# JA Resource Page Builder

## Objective
Create resource content that drives organic discovery and answer-engine visibility while remaining genuinely useful for students, recent graduates, and professionals.

Prioritise outcomes:
1. Rankable, intent-matched pages.
2. AEO-friendly structure with direct, useful answers.
3. Strong internal linking to JobAlchemist product pages.
4. AU/NZ language and tone.

## Modes
This skill has two modes only.

### Mode 1: Recommend Pages
Use when the user asks what pages to add next.

Actions:
1. Audit current content before proposing anything.
2. Perform web research to validate demand, competing content patterns, and information gaps.
3. Produce a recommendation list with clear reasons and expected value.
4. Ask the user to confirm which pages to create before writing any pages.

Required output format:
1. `Page title`
2. `Primary intent/query`
3. `Audience` (students, recent grads, professionals, HR)
4. `Why this page now` (SEO/AEO opportunity)
5. `Internal links to include`
6. `External sources to cite`

Always end Mode 1 with a confirmation prompt.

### Mode 2: Create Specific Page
Use when the user asks for a specific page (single page or batch).

Actions:
1. Audit existing site content first to avoid duplication.
2. Perform web research before drafting.
3. Create the page in `resources/` using the resource template and local design conventions.
4. Add strong internal links to relevant JobAlchemist pages.
5. Add external links when claims or frameworks are sourced from external material.
6. Update discovery assets (`resources/index.html`, `sitemap.xml`, `llms.txt`) when a new page is added.

## Mandatory First Step: Audit Existing Site Content
Before recommending or creating pages, review at least:
1. `index.html`
2. `students.html`
3. `outplacement-support.html`
4. `resources/index.html` and existing `resources/*.html`
5. `sitemap.xml`
6. `llms.txt`

Use this audit to:
1. Prevent duplicate pages.
2. Reuse existing positioning and terminology.
3. Identify missing intent coverage.

## Mandatory Research Step
Web research is required in both modes.

Minimum expectations:
1. Search current, authoritative sources (official docs, reputable career sites, government/employer guidance, high-quality industry resources).
2. Identify common questions, practical frameworks, and gaps not yet covered on JobAlchemist.
3. Use findings to improve usefulness, not to copy competitor phrasing.

When external facts or specific frameworks are used:
1. Add source links in-page where appropriate.
2. Keep claims grounded and verifiable.

## Content Standards for New Resource Pages

### Audience coverage
Each page should clearly serve one or more audiences:
1. Students
2. Recent graduates
3. Professionals

### Useful-content requirements
1. Lead with direct answer/value in the first paragraph.
2. Use practical steps, decision rules, examples, or checklists.
3. Avoid generic filler and obvious AI phrasing.
4. Keep advice specific enough to act on immediately.

### SEO/AEO requirements
1. One clear primary intent per page.
2. Descriptive title and meta description aligned to intent.
3. Clear H1 and scannable H2 sections.
4. Optional structured data where useful (WebPage, HowTo, FAQPage) that matches visible text.
5. Include “Related resources” block and contextual links to product pages.

### Internal linking requirements
Every new resource page must include:
1. Link to `../index.html`.
2. Link to at least one of `../students.html` or `../outplacement-support.html` when relevant.
3. Link back to `resources/index.html`.
4. Links to 2+ related resource pages where relevant.

### AU/NZ language requirements
Use AU/NZ spellings and conventions.

Use forms like:
1. `analyse`, `analysing`
2. `optimise`, `optimisation`
3. `prioritise`, `prioritisation`
4. `organise`, `organisation`
5. `stabilise`

Do not publish US `-ize`/`-yze` variants unless required in a quoted source.

## File Placement and Naming
1. Place all new resource content in `resources/`.
2. Use lowercase hyphenated filenames.
3. Prefer `/resources/<slug>.html` URLs.
4. Keep canonical and Open Graph URLs consistent with final URL.

## Required Updates When Adding a New Page
1. Add the page card/link in `resources/index.html`.
2. Add the URL entry in `sitemap.xml` with current date.
3. Add the canonical page entry in `llms.txt`.
4. Ensure footer/resource navigation still works from root pages.

## Quality Gate Before Finishing
Run this validator on all changed/new resource pages:

```bash
python3 .codex/skills/ja-resource-page-builder/scripts/validate_resource_page.py resources/*.html
```

If any check fails, fix before finalising.

## References
Load only what is needed:
1. Page template and section pattern: `references/resource-page-template.md`
2. Recommendation rubric and prioritisation criteria: `references/recommendation-rubric.md`

## Completion Criteria
The task is complete when:
1. Mode requirements are satisfied.
2. Research has informed recommendations/content.
3. Pages are useful, intent-aligned, and AU/NZ compliant.
4. Internal/external links are in place and relevant.
5. Discovery files are updated.
6. Validator passes.
