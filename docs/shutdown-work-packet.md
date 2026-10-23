# JobAlchemist marketing-site shutdown work packet

Prepared: 14 October 2026 (Pacific/Auckland)

Reviewed: 16 October 2026, including an independent subagent review.

Status: Pre-closure implementation and separate post-closure preview completed locally on 16 October 2026. Publication and application shutdown remain pending.

## Objective and source

Prepare the public marketing site for JobAlchemist's closure, stop directing visitors into acquisition flows, and give existing customers clear access and support instructions.

Source: [Shutdown email draft](chatgpt-conversation://6acc9724-85a8-83ec-a321-73233c444c83), reviewed with the user in this chat. The source checklist targets website changes by 16 October and product closure on Friday 23 October 2026. Its proposed export-support window through 6 November is a recommendation, not a confirmed commitment.

This repository serves `www.jobalchemist.tech` as static HTML/CSS/JavaScript on GitHub Pages. The application at `app.jobalchemist.tech` is separate. No build step is required.

## Confirmed decisions

- Retain existing product descriptions and pricing as historical copy. Do not undertake a wholesale marketing-content rewrite.
- Remove acquisition CTAs rather than greying them out: signup, free trial, purchase/upgrade, school-access enquiries, and outplacement sales enquiries.
- Preserve ordinary navigation and resource links. A button styled as a CTA is not automatically an acquisition CTA (for example, “Back to Home”).
- Prepare a prominent closure notice and a minimal post-closure homepage.
- Keep existing-user login available until closure; remove it at cutover.
- Keep terms and privacy pages accessible.
- The user authorised local implementation on 16 October. Publication and infrastructure shutdown remain separate.

## Details to resolve before final public copy and cutover

| Detail | Current evidence | Needed decision |
| --- | --- | --- |
| Closure date/time | Confirmed: end of Friday 23 October 2026, at 00:00 Saturday 24 October NZDT (23 October 11:00 UTC) | Use “at the end of Friday 23 October 2026 (NZDT)” in public copy; coordinate application shutdown at the same instant |
| Support address | User confirmed `hello@jobalchemist.tech` remains monitored for a month or more after closure | Use this address; keep monitoring while outstanding requests require it |
| Saving work | User confirmed users must copy and paste manually; all previous app users have already been emailed | Keep website instructions brief: save anything you wish to keep before closure; do not advertise a download/export button |
| Post-closure export support | User confirmed manual assistance by email; no fixed public deadline selected | Invite users to email for help; do not publish the earlier proposed 6 November deadline |
| Retained pages after closure | User wants existing copy retained | Default proposal: keep audience, about and resource pages available with closure context and no acquisition CTAs |

Drafting, CTA inventory and local preview preparation can proceed without inventing these details. Public copy must not contain unresolved placeholders or unverified export instructions. Do not publish a data-deletion date or claim that data has been deleted without a confirmed operational decision.

## Existing policy commitments reviewed on 16 October

The repository's terms and privacy policy both have an effective/last-updated date of 14 February 2026. This review describes those files; it does not establish which version each customer accepted or verify production parity.

- Terms section 9 permits modifying, suspending or discontinuing the service, and discusses notification and possible pro-rated credit/refunds for materially reduced paid functionality, subject to statutory rights.
- Terms section 17 says users may request an export for a reasonable period after closing an account, generally about 30 days. It says User Content is generally deleted within about 90 days, subject to backups, legal obligations, dispute resolution and fraud/security needs. These are qualified timeframes following account closure, not fixed dates expressly defined for whole-service shutdown.
- Privacy section 7 retains User Content while an account is active and for a limited period afterward. Its typical, variable retention periods are up to 7 years for billing/tax records, 2 years for support communications and 12 months for logs/analytics before deletion or aggregation. These periods do not require retaining all CVs or application content for seven years.
- Privacy section 10 provides for requests to access/correct information, delete an account subject to exceptions, and export key account data/User Content in a common format where practicable. Requests go to `hello@jobalchemist.tech`; identity may be verified.
- Privacy section 16 aims for responses often within 5–7 business days and within legally required timeframes.

Implementation consequence: retain email-assisted access/export support consistent with the existing terms, distinguish an export request window from deletion timing, and do not replace either with an unsupported short deadline. The user expects not to delete data for at least a month; the operational team still needs a retention/deletion schedule and an agreed account-closure trigger. Retention should be tied to actual support/legal needs, rather than indefinite storage simply because infrastructure permits it. See [NZ Privacy Principle 9](https://www.privacy.org.nz/privacy-principles/9/).

Suggested concise website support wording: “Please save any materials you wish to keep before closure. If you need help accessing your work, email hello@jobalchemist.tech.” Do not promise that all data will remain recoverable indefinitely or that a self-service export feature exists. Preserve the existing policy text; no substantive policy change is authorised by this packet.

## Phase 1 — Pre-closure site changes

- [x] Add a prominent, accessible closure notice to the homepage and all other public HTML pages, including direct-entry audience, resource and policy pages.
- [x] Say JA is closing on the confirmed date/time and is no longer accepting new users.
- [x] Explain how existing users can save their work or request assistance, using verified instructions and the confirmed support address.
- [x] Label retained product/pricing content as closed to new customers, while preserving the existing descriptive copy. Before cutoff, avoid implying the service is already unavailable to existing customers; after cutoff, use historical/closed wording.
- [x] Remove signup/free-trial CTAs in navigation and page bodies across `index.html`, `students.html` and `about.html`.
- [x] Remove school-access Google Form CTAs from `students.html`.
- [x] Remove sales-enquiry CTAs from `outplacement-support.html`. Keep a clearly labelled support contact; inspect other email links by purpose rather than removing every `mailto:` link.
- [x] Inventory all public HTML for any other purchase, upgrade, waitlist, feedback, demo or unmonitored contact destinations and remove acquisition/unmonitored CTAs if present.
- [x] Keep existing-user login links, with wording that explains access remains available until the cutoff.
- [x] Review retained resource links and surrounding copy for invitations to use or buy the retiring service; add closure context without rewriting educational articles wholesale.
- [x] Update page titles/descriptions, Open Graph/Twitter metadata and structured data where closure changes page intent. Remove active signup, trial and offer claims from machine-readable data.
- [x] Update `llms.txt` to describe the closure and retained pages; update relevant `sitemap.xml` last-modified dates and keep `robots.txt` coherent with the retained site.

## Phase 2 — Prepare and execute the post-closure change

- [x] Prepare a minimal static homepage saying JA has closed, with a brief explanation, support contact, and confirmed instructions for outstanding export requests.
- [x] Keep the post-closure version in a separate, locally reviewable generated directory outside the repository until cutover. Do not place an alternate future homepage in the published site or mix its changes into the pre-closure release. Record how to apply it on top of the released phase-1 version.
- [x] Keep this page independent of the application, Supabase, Stripe and AI services.
- [x] Prepare post-closure notice wording for retained pages and remove all application login links at cutover.
- [x] Repair links to sections removed by the minimal homepage. For example, `about.html` currently links to `index.html#how-it-works`, `index.html#see-it-in-action` and `index.html#pricing`; replace these destinations with useful retained navigation at cutover.
- [x] Remove PostHog tracking at closure from `index.html`, `students.html` and `about.html` (all three currently initialize it).
- [x] Keep existing marketing URLs useful through retained pages with closure context. Add a helpful `404.html` if needed for unknown marketing URLs; GitHub Pages does not provide application-host routing.
- [x] Verify the final site as a signed-out visitor on desktop and mobile.
- [ ] Release the post-closure version at the confirmed cutoff in coordination with the separate application shutdown. Do not rely on a visitor's browser clock to retire the service.

The marketing domain already has a static site. Moving it to Vercel is not required by this packet. Redirecting retired application URLs or moving `app.jobalchemist.tech` to a closure page requires changes outside this repository.

## Files and responsibilities

| Files | Intended work |
| --- | --- |
| `index.html` | Closure notice, historical-copy context, CTA removal, login/support links, metadata/schema; later minimal closed homepage |
| `students.html` | Closure context, signup and school-enquiry CTA removal; later login/tracking removal |
| `about.html` | Closure context, signup CTA removal, metadata review; later login/tracking removal |
| `outplacement-support.html` | Closure context, remove sales CTAs, retain support contact, review service schema |
| `resources/index.html`, `resources/*.html` | Closure notice and review product referrals/metadata while retaining useful content |
| `terms.html`, `privacy.html` | Keep accessible, add closure context; review consistency without inventing policy commitments |
| `styles.css`, `script.js` | Shared notice/layout support and only necessary interaction changes; avoid unrelated refactoring |
| `llms.txt`, `sitemap.xml`, `robots.txt` | Reflect actual retained public content and closure status |
| `404.html` if added | Clear closure context and navigation for unknown marketing URLs |
| `README.md`, `AGENT.md` | Update obsolete active-product instructions and document the closure-site workflow as needed |
| `CNAME`, `site-assests/` | Preserve domain assignment and assets needed by retained pages |

`AGENT.md` mentions `outplacement-support-print.html`, but that file was not present in the working tree inventory. Verify whether a print flyer exists in production; update it if found, rather than creating a new promotional flyer.

## Validation and acceptance criteria

- [ ] No marketing page links users to signup, trial, payment, upgrade, school-access forms or sales enquiries.
- [ ] Navigation, resource and policy links still work; support links remain distinguishable from sales CTAs.
- [ ] Every directly accessible retained page clearly communicates closure; product/pricing copy cannot reasonably be mistaken for a current offer.
- [ ] Pre-closure release provides existing-user login; post-closure release has no login CTA.
- [ ] Dates, time zone, mailbox and export instructions match customer communications and application behavior.
- [ ] Metadata, JSON-LD, `llms.txt` and sitemap match the visible site and actual page availability.
- [ ] Post-closure pages make no PostHog requests and do not depend on the retiring application.
- [ ] Check internal links/assets, parse JSON-LD and XML, and inspect desktop/mobile layouts and keyboard navigation. No new automated test suite is needed for these static content changes.
- [ ] Validate fragment destinations as well as file existence in both release versions, and confirm CTA removal leaves no empty wrappers, broken spacing or orphaned navigation items. Check retained mobile navigation, image modals and workflow tabs where affected.
- [ ] Run applicable existing metadata validation where its runtime is available; record any unavailable checks and use equivalent checks where practical.
- [ ] Apply `.codex/skills/ja-pre-pr-readiness/SKILL.md` before opening a PR, as required by that workflow's trigger.
- [ ] Record changed files, validation results, unresolved deployment dependencies, and the release/cutover instructions in the implementation handoff.

## External dependencies — outside this repo

- Disable backend registration and Stripe purchasing, including old direct links.
- Add dashboard/login-page notices in the application repository.
- Verify customer downloads and provide manual export assistance.
- Handle customer emails, refunds, subscription cancellation and data-retention decisions.
- Retire application functionality, sessions, API access, jobs and credentials at cutoff.
- Route old application URLs to a closure notice or appropriate retired-service response.
- Manage Supabase, Gemini, Stripe, PostHog account/data deletion and Vercel application infrastructure.
- Keep the support mailbox and marketing domain/hosting operational for the agreed support period.
- Verify GitHub Pages deployment settings and any external automation before release; no `.github` workflow directory was present locally during this review.

Do not archive the repository or disable the marketing-site hosting while it is needed to serve the closure notice. No customer data, infrastructure, billing resources or external forms are deleted by these repository changes.

## Deliverables

1. Pre-closure marketing-site patch and local preview, with validation evidence.
2. Prepared post-closure generator/preview and documented cutover steps.
3. Updated discovery metadata and repository guidance.
4. Release handoff identifying the confirmed cutoff and application/support dependencies.

## Local development and user preview

Run from the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [local homepage](http://127.0.0.1:8000/) in a browser or the Codex browser panel. Also inspect `/students.html`, `/about.html`, `/outplacement-support.html`, `/resources/`, `/terms.html` and `/privacy.html` directly. Refresh after file edits; this server does not provide automatic reload. Stop it with Ctrl+C. If port 8000 is occupied, use another available port and update the preview URL.

Local preview serves the working files without publishing them. External login, Google Form and email links still point to real destinations until removed; do not submit forms or exercise production signup/payment flows as part of layout review. Existing PostHog snippets may still send events during pre-closure preview; account for this when inspecting local behavior.

Review phase 1 and phase 2 separately using their respective working copies. A local preview does not verify GitHub Pages deployment configuration, custom-domain routing, backend shutdown or the monitored mailbox. Publication and infrastructure actions remain separate from local review.

## Progress

- [x] Review shutdown conversation and inspect repository scope.
- [x] Capture user's decision to retain descriptive copy and remove acquisition CTAs.
- [x] Create this work packet.
- [x] Review the packet with a subagent and add release separation, fragment-link checks and local preview instructions.
- [x] Verify a local preview server returns HTTP 200 (16 October 2026).
- [x] Resolve public-copy details: end-of-Friday cutoff, monitored support address, brief saving instructions and email assistance without a fixed public deadline.
- [x] Implement and validate the pre-closure version.
- [x] Prepare and validate the post-closure version.
- [ ] Complete release handoff and coordinated publication.

## Implementation evidence — 16 October 2026

See `docs/shutdown-release.md` for preview and cutover instructions. The readiness validator passes with zero errors/warnings. Both 11-page versions passed JSON-LD/XML, local asset/link and fragment checks; post-closure public HTML has no PostHog initialization or application links. Browser review covered 390px mobile and 1280px desktop views, retained page notices, mobile navigation, workflow controls and the proof-image modal. The user can preview phase 1 on port 8000 and the separate phase 2 snapshot on port 8001. No deployment, backend changes or customer-data operations were performed.

## Notice simplification — user revision

The pre-closure notice now contains only the closure heading, date/new-user statement and “Please save any materials you wish to keep before closure.” Remove the support sentence and explanatory historical-copy paragraph from these notices, per user review. This supersedes earlier notice-copy guidance above. Retain the post-closure email contact and existing policy/support links.

## Login label — user revision

Retain the original “Login” label on pre-closure navigation links. The closure notice provides the new-user restriction; additional button wording is unnecessary. Remove login links at post-closure cutover as planned.

## Post-closure cutover — 24 October 2026

The user authorised publishing the post-closure site. Generated from the latest main; the working tree now contains the minimal homepage, closed notices, support email and retained resource/policy pages. Application links and PostHog are removed. Production deployment and live verification are being completed through the GitHub Pages release process.

## Resource retirement — user revision, 24 October 2026

Remove the resource hub and all four job-search articles from the public site, links and discovery files. Keep the closure homepage, support address and policy pages. Update the generator to avoid republishing resources. This supersedes prior retained-resource acceptance criteria.
