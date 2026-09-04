# PracticeSpend — Design System and UX Direction

## Design objective

PracticeSpend should feel credible inside a premium physician-owned dermatology practice, not like a generic startup analytics dashboard.

The initial visual direction is inspired by the current Modern Dermatology Seattle website: restrained, editorial, premium, spacious, physician-led, and highly readable.

**Important:** PracticeSpend should not copy Modern Dermatology's logo, proprietary images, exact trade dress, or imply affiliation. The goal is visual familiarity and quality, not imitation.

## Brand personality

- calm;
- precise;
- premium;
- intelligent;
- clinical without feeling sterile;
- financially serious without feeling like accounting software;
- transparent rather than flashy;
- confident but not alarmist.

## Visual principles

### 1. Space over density

Use generous whitespace and strong grouping. Avoid the crowded enterprise-dashboard aesthetic.

### 2. Neutral palette

Prototype palette should be primarily:

- warm white / off-white backgrounds;
- near-black primary text;
- charcoal secondary text;
- soft warm gray surfaces/borders;
- one restrained accent for interactive controls;
- semantic colors only where meaning requires them (verified, attention, warning).

Do not use a saturated blue SaaS dashboard as the default visual language.

### 3. Editorial typography

Use a refined display/serif or elegant high-contrast heading treatment paired with a highly legible sans-serif for data and controls.

Because the application must work entirely from GitHub without purchased font dependencies, prefer robust web-safe/system or freely redistributable options in implementation.

### 4. Uppercase micro-labels

Use selective uppercase labels for section categories and navigation, echoing the disciplined service-label presentation of the reference site.

Examples:

- SPEND OVERVIEW
- PRICE CHANGES
- VENDOR REVIEW
- VERIFIED OPPORTUNITIES

Do not uppercase long prose.

### 5. Financial numbers get hierarchy

Large numbers should be elegant, not neon.

Example:

`$18,420`

Potential annualized opportunity

The explanation should be visually close to the number.

### 6. Evidence-first cards

Opportunity cards should show:

- finding;
- amount;
- confidence;
- short explanation;
- `Why?` action.

Avoid mysterious AI score widgets.

## Header concept

Left:

`PracticeSpend`

Center/primary navigation:

- Overview
- Opportunities
- Invoices
- Products
- Vendors

Right:

- `DEMO MODE` or `LOCAL PRACTICE MODE`
- Data / Import action

## Demo-mode treatment

Demo mode should be clearly visible but visually quiet:

`DEMO MODE — Fictional practice data`

When real local data is loaded:

`LOCAL PRACTICE MODE — Stored only in this browser`

## Dashboard concept

Top:

**See what your practice is really paying.**

Then four primary metrics:

- analyzed spend;
- potential annualized opportunities;
- material price changes;
- vendors reviewed.

Below that:

1. largest findings;
2. price trend visualization;
3. spend concentration;
4. recent invoices / data health.

## Modern Dermatology inspiration boundaries

Use the following qualities from the reference experience:

- strong editorial hierarchy;
- physician-practice sophistication;
- premium restraint;
- whitespace;
- simple navigation;
- black/neutral typography;
- strong section labeling.

Do not use:

- Modern Dermatology logo;
- their photographs;
- their copy;
- their address/phone in PracticeSpend branding;
- anything implying PracticeSpend is already endorsed by Modern Dermatology.

Synthetic demo data may be described as a fictional Seattle dermatology practice, but should not falsely represent itself as Modern Dermatology's actual purchasing data.
