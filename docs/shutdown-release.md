# Shutdown release handoff

Prepared 16 October 2026; cutover prepared on 24 October 2026. Pre-closure changes were published through PR #15. This release replaces the homepage with the approved closure page and updates retained pages to closed status.

## Previous pre-closure version

The pre-closure release contained static closure notices on all 11 public HTML pages, no acquisition CTAs, retained descriptive/pricing copy, and existing-user login links. Metadata and discovery files reflect closure. Terms and privacy text remain intact. PostHog remains until closure.

Preview at http://127.0.0.1:8000/ using:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

The support mailbox is `hello@jobalchemist.tech`. Users must save materials manually; the notice simply asks them to save anything they wish to keep and email for help. No fixed support or deletion deadline is published.

Before publishing, verify the notice against the email already sent to customers and confirm the application team has disabled new registrations and purchasing. Hiding links in this repository does not disable those endpoints. Review the local changes, then use the existing GitHub Pages release process; verify actual repository publishing settings rather than following the historical README's `/docs` instructions without checking.

## Separate post-closure version

Generate a complete public-site copy into a new directory outside the repository:

```sh
python3 scripts/prepare-post-closure.py --output /tmp/ja-post-closure-NEW
python3 -m http.server 8001 --bind 127.0.0.1 --directory /tmp/ja-post-closure-NEW
```

Open http://127.0.0.1:8001/. The generator refuses to overwrite a directory or write inside the source checkout. It copies only public files and assets, substitutes a minimal homepage, updates notices/metadata/discovery, removes application links and PostHog, and repairs old homepage section links. No scheduled service or browser-clock switch is installed.

The reviewed snapshot from this implementation is `/private/tmp/ja-post-closure-reviewed`, served on port 8001. Temporary files are disposable; regenerate from the final pre-closure source before cutover if it changes.

At **00:00 Saturday 24 October 2026 NZDT (23 October 11:00 UTC)**, coordinate the application shutdown and release this version:

1. Generate and review a fresh snapshot from the final phase-1 source. Check both homepage and retained direct-entry URLs.
2. Copy the generated HTML files, `resources/`, `styles.css`, `script.js`, `llms.txt`, `sitemap.xml`, `robots.txt`, `CNAME` and assets into the release checkout. Preserve repository history, documentation and scripts. Review the diff before committing/deploying; do not replace the repository wholesale with the generated directory.
3. Run the site-readiness validator and review internal links including fragments. Confirm no PostHog initialization or application links remain in public HTML.
4. Publish through the verified GitHub Pages process. Verify the public homepage, audience/resource/policy URLs, assets and support email link after deployment propagation.
5. Record the actual deployment time and result. Application-host redirects, sessions, backend endpoints and infrastructure shutdown are managed outside this repo.

Do not delete customer data during this site cutover. The existing terms discuss an export-request period generally around 30 days after account closure and deletion generally within about 90 days, subject to stated exceptions. The operational retention schedule must be managed separately.

## Validation recorded

- Site-readiness validator: zero errors and warnings for the pre-closure checkout.
- Both 11-page versions: JSON-LD parses, sitemap XML parses, local link/asset destinations and fragment targets resolve, no signup/Google Form links remain.
- Post-closure snapshot: no PostHog initialization or application links remain in public HTML.
- Browser checks: pre/post homepages at 390px mobile and 1280px desktop; student desktop layout; outplacement/resource notice content; post-closure about notice; mobile navigation, workflow controls and proof-image modal.

No new marketing 404 page is included: all existing public page URLs are retained. Unknown paths continue to use the host's normal 404 behavior.

## Cutover record — 24 October 2026

- Generated the approved post-closure site from the latest `origin/main` and applied public files to `codex/post-closure-site`.
- Confirmed GitHub Pages publishes from the root of `main`.
- Retained resource/policy URLs, support email, assets and domain configuration. Removed application links and PostHog; no customer-data or infrastructure deletion.
- Deployment and live-verification outcomes are recorded in the closure release PR. Application shutdown remains outside this repository.

## Resource retirement — 24 October 2026

The owner requested removal of all job-search resources after reviewing the closure site. Remove the resource hub and four articles from published files, navigation, sitemap and llms.txt. Existing article URLs should return HTTP 404. The generator must not restore them. Keep the closure homepage, support contact and policies available. This supersedes earlier instructions to retain resources. Historical source remains recoverable from Git.
