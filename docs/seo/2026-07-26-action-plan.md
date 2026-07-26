# JobAlchemist SEO Action Plan

## Phase 1 — immediate, high-confidence

| Order | Action | Impact | Effort | Verification |
|---:|---|---|---|---|
| 1 | Enable GitHub Pages **Enforce HTTPS** | High | Small, external setting | Both HTTP host variants permanently redirect to `https://www.jobalchemist.tech/` |
| 2 | Add responsive AVIF/WebP variants for the three large landing images | High | Medium | Mobile no longer downloads desktop originals; visual comparison passes |
| 3 | Add responsive lazy thumbnails for the three proof screenshots | High | Medium | Proof images are absent from initial network requests and modal originals still work |
| 4 | Replace deprecated `HowTo` schema on both guides | Medium | Small | JSON-LD parses and contains truthful Article/BlogPosting fields |
| 5 | Update internal links from `index.html` forms to canonical `/` forms | Medium | Small | Static link audit finds no internal non-canonical index links |

## Phase 2 — content authority and discoverability

1. Expand the job-ad, ATS and ChatGPT comparison guides with worked examples, primary sources and stronger internal linking.
2. Add visible author/reviewer details and publication/update dates to resource pages.
3. Add a concise homepage methodology block: how fit is assessed, what evidence is used, uncertainty, limitations and human review.
4. Add a compact founder-expertise block linking to About.
5. Turn suitable testimonials into consented, dated case studies with inputs, outputs and outcomes.
6. Resolve the 2025/2026 founding-date inconsistency across structured data and external profiles.

## Phase 3 — metadata and machine-readable hygiene

1. Rewrite the short About title and shorten the Resources, ATS, Glossary and Students titles where click intent improves.
2. Consolidate Organization schema around one stable `@id`.
3. Decide whether to retain FAQPage for non-Google semantics; do not expect a commercial Google rich result.
4. Synchronize material `lastmod` dates and remove ignored sitemap fields.
5. Convert `llms.txt` page entries to `[Title](URL): description`, remove its BOM and keep facts synchronized.
6. Add intrinsic dimensions/aspect ratios and asynchronous decoding to proof/logo imagery.
7. Enlarge mobile interaction hit areas, especially the navigation toggle and carousel dots.

## Phase 4 — measured experiments

1. Test a candidate-qualified proposition such as “AI job-fit assessment for job seekers” rather than broad “job fit assessment.”
2. Prototype a no-login sample report, prefilled demo or lightweight checker to better match transactional SERP expectations.
3. Configure Search Console and PageSpeed/CrUX access before setting performance targets.
4. Add conversion tracking for signup CTAs before judging SEO landing-page changes.
5. Consider immutable, fingerprinted asset caching through a CDN only after modern responsive images are implemented.

## Explicitly deprioritized

- IndexNow: optional and not used by Google.
- RSL licensing markup: optional governance, not a current ranking priority.
- Readability score or word-count targets: useful editorial checks, not direct ranking factors.
- Missing CSP/X-Frame-Options as SEO work: valuable security hardening, but secondary to HTTPS enforcement.
- PDF audit generation: blocked by local WeasyPrint system libraries and unnecessary for implementation.

## Suggested first implementation batch

The safest repository-only batch is:

1. Modern responsive images and proof thumbnails.
2. Canonical internal links.
3. Resource schema replacement.
4. Metadata and sitemap corrections.
5. Touch-target and image-dimension hygiene.

HTTPS enforcement is the first overall action but must be changed in GitHub Pages settings.
