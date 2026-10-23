#!/usr/bin/env python3
"""Build a separate closure-site preview; never edit the source checkout."""
from pathlib import Path
import argparse
import re
import shutil

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', required=True, type=Path, help='New directory outside this repository')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
out = args.output.expanduser().resolve()
if out == root or root in out.parents or out in root.parents:
    parser.error('Output must be outside the source repository and not its parent.')
if out.exists():
    parser.error('Output already exists. Choose a new directory; existing files will not be overwritten.')
out.mkdir(parents=True)
for name in ('styles.css', 'script.js', 'CNAME', 'robots.txt', 'sitemap.xml', 'llms.txt'):
    shutil.copy2(root / name, out / name)
shutil.copytree(root / 'site-assests', out / 'site-assests')
# Job-search resources were retired after closure; do not republish them.
for p in root.glob('*.html'):
    shutil.copy2(p, out / p.name)
for p in list(out.glob('*.html')) + list((out / 'resources').glob('*.html')):
    s = p.read_text(encoding='utf-8-sig')
    s = s.replace('data-closure-phase="before"', 'data-closure-phase="after"')
    s = s.replace('JobAlchemist is closing', 'JobAlchemist has closed')
    s = s.replace('JA will close at the end of', 'JA closed at the end of')
    s = s.replace('Please save any materials you wish to keep before closure.', 'For help accessing your saved work after closure, email <a href="mailto:hello@jobalchemist.tech">hello@jobalchemist.tech</a>.')
    s = s.replace('Existing users can continue to sign in until closure. These pages remain available for reference.', 'Application access has ended. These pages remain available for reference.')
    s = s.replace('The product information and pricing below describe our existing service.', 'The product information and pricing below are historical.')
    s = re.sub(r'<script\b[^>]*>.*?</script>', lambda m: '' if 'posthog.init' in m[0] else m[0], s, flags=re.S)
    s = re.sub(r'<a\b[^>]*href="https://app\.jobalchemist\.tech[^"]*"[^>]*>.*?</a>', '', s, flags=re.S)
    s = re.sub(r'<li>\s*</li>', '', s)
    # These anchors disappear when the promotional homepage is replaced.
    s = re.sub(r'href="(?:\.\./)?index\.html#(?:how-it-works|see-it-in-action|pricing)"', lambda m: m[0].split('#')[0]+'"', s)
    s = s.replace('JobAlchemist closes at the end of Friday 23 October 2026 (NZDT). Closed to new users. Existing users should save any materials they wish to keep before closure.', 'JobAlchemist closed at the end of Friday 23 October 2026 (NZDT). Email hello@jobalchemist.tech for help accessing saved work.')
    s = re.sub(r'(<lastmod>).*?(</lastmod>)', r'\g<1>2026-10-24\2', s)
    s = s.replace('2026-10-16T00:00:00+13:00', '2026-10-24T00:00:00+13:00')
    s = s.replace('"dateModified": "2026-10-16"', '"dateModified": "2026-10-24"')
    # The retired application is no longer an organization identity link.
    s = re.sub(r',?\s*"https://app\.jobalchemist\.tech"\s*,?', '', s)
    p.write_text("\n".join(line.rstrip() for line in s.splitlines()) + "\n")

head = '''<!DOCTYPE html>
<html lang="en-NZ"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>JobAlchemist has closed</title>
<meta name="description" content="JobAlchemist closed at the end of Friday 23 October 2026 (NZDT). Email us for help accessing your saved work.">
<link rel="canonical" href="https://www.jobalchemist.tech/">
<meta property="og:locale" content="en_NZ"><meta property="og:type" content="website">
<meta property="og:site_name" content="JobAlchemist"><meta property="og:title" content="JobAlchemist has closed">
<meta property="og:description" content="Thank you for using JobAlchemist. Contact us for help accessing saved work.">
<meta property="og:url" content="https://www.jobalchemist.tech/">
<meta property="og:image" content="https://www.jobalchemist.tech/site-assests/JobAlchemist-unfurl-main-image.png">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="JobAlchemist has closed">
<meta name="twitter:description" content="Thank you for using JobAlchemist. Contact us for help accessing saved work.">
<meta name="twitter:image" content="https://www.jobalchemist.tech/site-assests/JobAlchemist-unfurl-main-image.png">
<link rel="icon" href="site-assests/ja-favicon.png"><link rel="stylesheet" href="styles.css?v=20261024">
</head><body data-closure-phase="after"><main class="closed-home">
<img src="site-assests/email_logo.svg" alt="JobAlchemist">
<h1>Thank you for being part of JobAlchemist.</h1>
<p>JobAlchemist closed at the end of <strong>Friday 23 October 2026 (NZDT)</strong>. The application is no longer available.</p>
<p>We appreciate everyone who used JA and shared their job-search journey with us.</p>
<p>If you need help accessing your saved work, please email <a href="mailto:hello@jobalchemist.tech">hello@jobalchemist.tech</a>.</p>
<nav aria-label="Further information"><a href="terms.html">Terms of Use</a><a href="privacy.html">Privacy Policy</a></nav>
</main></body></html>
'''
(out / 'index.html').write_text(head)
p = out / 'llms.txt'
s = p.read_text().replace('Existing-user login (until closure): https://app.jobalchemist.tech/login', 'Application access has ended.')
s = s.replace('JobAlchemist closes', 'JobAlchemist closed').replace('Please save materials before closure; email', 'For help accessing saved work, email').replace('2026-10-16', '2026-10-24')
p.write_text(s)
p = out / 'sitemap.xml'
p.write_text(re.sub(r'<lastmod>.*?</lastmod>', '<lastmod>2026-10-24</lastmod>', p.read_text()))
print(f'Prepared post-closure site at {out}. Source checkout unchanged.')
print('Preview this directory separately. At cutover, copy its reviewed public files into the release checkout, review the diff, then deploy through the existing GitHub Pages process.')
