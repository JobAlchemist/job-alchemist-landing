# Google Ads EXP01 homepage intent tracking

## Summary

Use the attached V2 text as the source of truth. The repo should track paid landing-page intent, not product activation.

The primary marketing event is `try_free_clicked`, emitted when an eligible Australian paid visitor clicks any signup/trial CTA.

## Repo changes

- Update [index.html](/Users/suhel/Documents/code/job-alchemist-landing/index.html) to annotate the six signup links with stable locations:
  - `navigation`
  - `hero`
  - `comparison_section` for the three pricing CTAs
  - `footer` for the closing CTA
- Update [script.js](/Users/suhel/Documents/code/job-alchemist-landing/script.js) homepage-only to:
  - Capture and persist `gclid`, campaign UTMs, `ads_match_type`, and `ads_device`.
  - Mark sessions matching `google / cpc / au_search_fit_exp01` as eligible paid-entry sessions.
  - Forward those parameters to `app.jobalchemist.tech/signup` and `/login`.
  - Capture `try_free_clicked` with `cta_location` and stable `cta_destination: "app_signup"`.
  - Suppress or mark test traffic using `is_test=true`.
  - Preserve first-touch attribution and avoid sending CV text, job-ad text, names, emails, filenames, or raw errors.
- Update [privacy.html](/Users/suhel/Documents/code/job-alchemist-landing/privacy.html) to disclose Google Ads campaign measurement and attribution parameters, while distinguishing measurement from ad targeting.

Do not add a new landing page, change the existing homepage proposition substantially, or implement signup/product milestone events in this repository.

## External campaign setup

- Use the existing homepage as the final URL.
- Configure the supplied Final URL suffix and Google Ads auto-tagging.
- Configure `try_free_clicked` as the sole Primary conversion with Count One if importing it into Google Ads.
- Keep signup, CV, and analysis events as Secondary/observation-only conversions outside custom bidding goals.
- Set Australia Presence targeting, Search-only networks, exact-match launch keywords, NZ$173.91 media budget when NZ$200 includes GST, and the documented campaign dates.

The app must consume the forwarded attribution through signup and authentication; that is outside this repository.

## Acceptance tests

- Paid campaign URL creates the correct stored cohort and forwards all allowlisted parameters.
- Organic traffic does not create a paid cohort or `try_free_clicked`.
- Each CTA reports the correct location and destination.
- Repeated CTA clicks remain deduplicable by PostHog person and Google Ads Count One.
- `is_test=true` traffic is excluded from headline conversion reporting.
- No sensitive content appears in event properties or outbound URLs.
- Desktop, mobile, consent-declined, and blocked-analytics journeys continue functioning.
- The six homepage signup links and all existing site interactions remain intact.

## Assumptions

- PostHog remains the marketing-site source of truth for paid sessions and CTA behaviour.
- Google Ads conversion importing is configured outside the static repo.
- The document’s downstream signup, CV, and analysis milestones belong to the app/backend system, not this workspace.
