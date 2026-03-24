# Final PR Checklist

Use this checklist after running `scripts/validate-site-readiness.py` (or the PowerShell fallback on Windows).

## Blocking checks

- Fix all validator errors.
- Keep internal links and asset paths valid.
- Remove trailing whitespace (`git diff --check` must be clean).

## Metadata and discovery checks

- Ensure changed indexable pages have accurate:
  - title
  - meta description
  - canonical URL
  - OG tags
  - Twitter tags
- Ensure `og:updated_time` and `dateModified` are updated where used.
- Ensure `sitemap.xml` `<lastmod>` matches changed indexable pages.
- Ensure `llms.txt` canonical list reflects added/renamed/removed pages.
- Ensure `llms.txt` "Last updated" is current.

## Repo-specific quality checks

- Update `AGENT.md` if site behavior/workflow changed.
- Confirm analytics includes remain intact on pages that should include them.
- Confirm noindex pages remain noindex (for example print pages).
- Validate audience/page positioning remains coherent:
  - Main job-seeker page
  - Students/teachers page
  - Outplacement page

## Manual smoke pass

- Serve locally with `python -m http.server 8000`.
- Check desktop and mobile for:
  - nav behavior
  - workflow tabs/carousels/modals
  - CTA/link destinations

## PR summary template

Use this concise structure in your PR or handoff note:

1. Scope: files/areas changed
2. Metadata/discovery updates made
3. Validator result
4. Manual smoke result
5. Residual risk or deferred follow-up
