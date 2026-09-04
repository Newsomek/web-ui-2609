# PracticeSpend - GitHub Pages Deployment and Demo Privacy

## Purpose

PracticeSpend Gate 2 is intended to be shared as a restricted demonstration while the source repository remains private.

## Repository visibility

The GitHub repository should be PRIVATE.

The repository may contain implementation source, tests, QA reports, continuity files, and internal documentation. None of those should be intentionally published as part of the GitHub Pages artifact unless they are required by the running application.

## Public demo surface

The Pages workflow publishes only:

- index.html
- robots.txt
- css/
- data/
- js/
- assets/ when present
- .nojekyll

It does NOT intentionally publish:

- PracticeSpend_Documentation/
- tests/
- BUILD_STATUS.md
- NEXT_SESSION.md
- QA reports
- ZIP update packages
- other repository files

## Search-engine indexing

The demo uses both:

- a robots meta directive requesting noindex/nofollow/noarchive/nosnippet/noimageindex
- robots.txt with `Disallow: /`

These directives discourage normal search-engine discovery. They are not authentication and they do not make the URL secret.

## Important security boundary

PracticeSpend is currently a static browser application. Anyone who can load the demo can inspect the HTML, CSS, JavaScript, and demo data delivered to their browser. Keeping the repository private prevents casual GitHub source browsing, but it cannot make browser-delivered JavaScript secret.

Do not put real Modern Dermatology invoices, credentials, tokens, secrets, patient information, PHI, private keys, or production credentials into the static deployment.

## Demo identification

The footer identifies the site as a restricted demo for Dr. James C. Collyer and Dr. Heather D. Rogers of Modern Dermatology and includes the Michael Kelly Newsome copyright notice.

## Production direction

If PracticeSpend proceeds beyond validation, proprietary financial logic and sensitive business data should move behind authenticated server-side APIs. Client-side code should not be treated as confidential.
