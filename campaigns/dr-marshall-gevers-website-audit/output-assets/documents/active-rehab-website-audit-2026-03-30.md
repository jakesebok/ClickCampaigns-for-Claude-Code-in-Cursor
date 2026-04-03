# Active Rehab Chiropractic Website Audit

Date: March 30, 2026

Client: Dr. Marshall Gevers

Audited site: [arctest.active-rehab-chiro.com](https://arctest.active-rehab-chiro.com/)

## Scope

Pages reviewed:

- [Home](https://arctest.active-rehab-chiro.com/)
- [About](https://arctest.active-rehab-chiro.com/about/)
- [Injuries & Pain](https://arctest.active-rehab-chiro.com/injuries/)
- [Concussion](https://arctest.active-rehab-chiro.com/concussion/)
- [FAQ](https://arctest.active-rehab-chiro.com/faq/)
- [Athlete Program](https://arctest.active-rehab-chiro.com/athlete/)
- [Chiropractic Adjustments](https://arctest.active-rehab-chiro.com/treatments/adjustments/)
- [Soft Tissue Therapy](https://arctest.active-rehab-chiro.com/treatments/soft-tissue/)
- [Dry Needling](https://arctest.active-rehab-chiro.com/treatments/dry-needling/)
- [DNS / Functional Rehab](https://arctest.active-rehab-chiro.com/treatments/dns/)

Method used:

- Full internal page crawl of the public site
- Manual copy and UX review
- Desktop and mobile screenshot review
- Structural SEO and accessibility spot checks
- Basic technical checks for broken links, indexation, and page weight

## Executive Summary

This site is better than most local provider sites on positioning. The messaging is sharper, more opinionated, and more differentiated than generic chiropractic websites. The strongest pages are the homepage, concussion page, and FAQ because they clearly articulate the practice philosophy and directly answer common objections.

The biggest issue is not weak copy. The biggest issue is conversion architecture. The site explains the philosophy well, but it does not consistently turn that clarity into low-friction next steps for different visitor intents. A patient with back pain, a parent of an injured athlete, and someone with lingering concussion symptoms all need different reassurance, proof, and booking language. Right now they mostly get the same design system, the same visual tone, and the same booking CTA.

The second major issue is technical readiness. The site is missing several basic SEO/indexation elements, and the homepage is extremely heavy for mobile traffic. Those are fixable, but they should be corrected before driving more traffic.

## What Is Working

### 1. Differentiation is strong

Examples:

- Home hero: "Past the Injury. Back to Everything Else."
- Home / Injuries positioning: the practice treats the cause, not just the pain
- FAQ: explicit statement that this is not a passive-adjustment model

Why it works:

- The site avoids commodity language.
- It gives Dr. Gevers a defensible point of view.
- It filters for better-fit patients instead of sounding like every other local chiropractor.

### 2. The concussion page is the strongest service page

What works:

- It separates three intents quickly: just diagnosed, still symptomatic, baseline testing.
- It gives a treatment philosophy that feels current and structured.
- It handles a high-confusion topic with more clarity than the rest of the site.

Why it works:

- Concussion patients and parents need certainty and a plan.
- This page gives them both, which makes it more conversion-ready than the generic treatment pages.

### 3. The FAQ is unusually honest and useful

What works:

- It addresses fit, visit structure, insurance, soreness, safety, HSA/FSA, and concussion baseline testing.
- It pre-qualifies poor-fit prospects.

Why it works:

- Good objections are already being handled.
- The issue is that too much of this sales-critical information is buried on the FAQ page instead of being surfaced earlier in the journey.

### 4. The site architecture is lean and easy to understand

What works:

- Clear top-level navigation
- Limited number of pages
- Consistent layout language

Why it works:

- Simplicity reduces decision fatigue.
- The redesign does not need more pages for the sake of more pages. It needs better purpose-built pages.

## What Is Broken

### 1. Core SEO/indexation infrastructure is missing

Observed:

- `robots.txt` returns 404
- `sitemap.xml` returns 404
- No canonical tags detected on any audited page
- No JSON-LD schema detected on any audited page

Why this matters:

- Search engines have less structure for crawling and consolidating page authority.
- Local SEO is harder than it needs to be.
- FAQ content and local business details are not being marked up in a way that can improve visibility.

Fix:

- Add a valid `robots.txt`
- Add an XML sitemap and submit it in Google Search Console
- Add self-referencing canonicals on every page
- Add `LocalBusiness` / `Chiropractor`, `Physician` or appropriate healthcare schema, `FAQPage` schema on the FAQ page, and `BreadcrumbList` where relevant

### 2. Page weight is too high for a local-service site

Observed:

- Homepage transfer weight measured at roughly 8.9 MB
- Largest assets include multiple 1.5 MB to 2.1 MB hero/background images

Why this matters:

- A large share of local traffic is mobile and often arrives from search or maps.
- Heavy pages slow down first impression, hurt conversion, and weaken SEO.
- The visual payoff is not large enough to justify the transfer cost.

Fix:

- Compress and resize hero/background images aggressively
- Prefer modern formats everywhere possible
- Serve smaller mobile-specific images
- Audit whether every large decorative image needs to load above the fold

### 3. Conversion paths are too uniform

Observed:

- Nearly every page funnels to the same generic "Book Now" action
- There is no dedicated "New Patient / First Visit" page
- There is no softer mid-intent conversion path for visitors who are interested but not ready to book

Why this matters:

- Different traffic sources arrive with different confidence levels.
- A patient with acute pain may book now.
- A parent researching concussion recovery or an athlete comparing providers may need more reassurance first.
- When every path is the same, you lose visitors who needed one more step before booking.

Fix:

- Build separate conversion paths for:
  - General injury/pain patients
  - Concussion cases
  - Athlete return-to-sport / parent decision-makers
- Add a "New Patients" page covering first visit, length, what happens, expected plan, pricing philosophy, insurance / out-of-network process, and what kind of patient is a fit
- Add a secondary CTA such as "See If This Is The Right Fit" or "Learn What Your First Visit Includes"

### 4. The site does not surface enough proof early enough

Observed:

- Homepage proof is limited to a few text testimonials below the process explanation
- Athlete page has no strong parent / athlete proof near the top
- Treatment pages rely heavily on philosophy and explanation with minimal outcome evidence

Why this matters:

- Positioning creates interest, but proof closes doubt.
- Medical and health buyers need evidence that this approach works for people like them.
- Without enough proof, the site can feel intellectually persuasive but not yet conviction-building.

Fix:

- Add star rating / review count if available
- Add stronger testimonials with condition, timeline, or outcome specificity
- Add before/after functional outcomes where compliant and appropriate
- Add "who this is for" proof by segment: active adults, athletes, post-concussion patients, parents
- Add association logos, certifications, techniques, or relevant authority cues if they are real and verifiable

### 5. The visual system over-signals "athlete only"

Observed:

- The homepage, FAQ, injuries page, and treatment pages all lean heavily on sports imagery
- The brand aesthetic reads performance-first even on pages meant for general pain patients

Why this matters:

- Sports visuals support the athlete program, but they may unintentionally filter out non-athlete local patients who still fit the practice
- A desk worker with chronic neck pain may wrongly assume the clinic is mainly for competitive athletes

Fix:

- Keep the athletic edge, but diversify imagery and examples
- On the homepage, explicitly state who the practice serves: active adults, athletes, and people with recurring musculoskeletal pain
- Use more human proof and less repeated hero art across non-athlete pages

### 6. Some metadata and structural details need cleanup

Observed:

- Home title is redundant: "Active Rehab Chiropractic | Active Rehab Chiropractic"
- About title duplicates the brand name
- Athlete page contains two H1s
- Missing image alt text appears on multiple pages

Why this matters:

- These are easy quality wins for SEO and accessibility
- They also signal a site that is not fully tightened before launch

Fix:

- Rewrite title tags for clarity and intent
- Keep one H1 per page
- Complete alt text across all content images

## Biggest Opportunities

### 1. Turn the homepage into a true routing page

Recommendation:

- Keep the strong positioning
- Add three explicit paths immediately after the hero:
  - I keep getting re-injured
  - I’m dealing with a concussion
  - My athlete needs a return-to-sport plan

Reason:

- The site already has these three major segments.
- The homepage should route visitors into the right story faster instead of making them infer where they belong.

### 2. Build a stronger first-visit trust sequence

Recommendation:

- Add a dedicated "What To Expect" or "New Patients" page
- Pull elements from the FAQ into higher-visibility sections

Reason:

- The FAQ already answers critical objections well.
- Moving that information earlier will reduce booking hesitation and cut repeated pre-visit questions.

### 3. Add more patient-benefit translation on treatment pages

Observed:

- Treatment pages lean into technical terms like MPI, DNS, PIR, IASTM, and neurodynamic assessment

Reason this matters:

- Technical precision builds credibility, but too much jargon makes cold traffic work too hard
- Patients convert faster when they understand what a method means for their pain, movement, sport, or timeline

Fix:

- Keep the techniques, but pair each with a plain-language outcome statement
- Example pattern:
  - Technique
  - What it helps with
  - Who it is best for
  - What a patient should expect

### 4. Add more page-level CTA repetition

Observed:

- Several pages rely on a top CTA and a bottom CTA with long explanatory sections in between

Why this matters:

- Long-form service pages should not assume visitors read top to bottom in order
- Repeated CTAs after major proof or explanation sections improve conversion

Fix:

- Add contextual CTA blocks after major sections, especially on:
  - Concussion
  - Athlete Program
  - Injuries & Pain
  - DNS / Functional Rehab

## Page-by-Page Notes

### Home

What works:

- Strong headline and practice thesis
- Good three-path summary cards
- Strong process explanation

Needs improvement:

- Add more above-the-fold clarity on who the clinic serves and where it is
- Add stronger proof higher on the page
- Add a secondary CTA for visitors not ready to book immediately
- Reduce visual dependence on sports imagery only

### About

What works:

- Marshall's story is credible and differentiating
- The "why this practice exists" narrative is compelling

Needs improvement:

- The hero should feature Marshall, not the building
- H1 "About" is too generic
- Add a fast-scanning credentials section near the top
- Add stronger authority markers and patient-fit framing

### Injuries & Pain

What works:

- Strong recurring-injury framing
- Good condition coverage
- Clear three-part process

Needs improvement:

- Make condition-level proof stronger
- Add a short "who this is for / not for" section
- Add CTA blocks after the process and conditions sections

### Concussion

What works:

- Best segmented page on the site
- Strong clinical clarity
- Handles a confusing category well

Needs improvement:

- Add proof from concussion patients / parents if available
- Add clearer CTA copy by use case: baseline test vs active treatment
- Break some dense explanatory sections into more scannable blocks

### Athlete Program

What works:

- Clear audience
- Good problem-agitate-solution structure
- Strong parent-focused framing

Needs improvement:

- Add more proof, especially parent testimonials or sport-specific outcomes
- Reduce generic claims and add specifics around assessment, return-to-play progression, and timeline expectations
- Fix the double H1 structure

### FAQ

What works:

- Excellent objection handling
- Strong honesty about fit and insurance model

Needs improvement:

- Add FAQ schema
- Bring the most conversion-critical answers onto core landing pages so users do not need to hunt for them

### Treatment Pages

Pages:

- Adjustments
- Soft Tissue
- Dry Needling
- DNS / Functional Rehab

What works:

- Consistent visual template
- Strong philosophy
- Good attempt to explain what makes the methods different

Needs improvement:

- Too much method-first language and not enough outcome-first language
- Not enough proof or case examples
- Limited CTA repetition
- Could use "best for / not for / what to expect" sections on each page

## Recommended Priorities

### Priority 1: Before redesign launch

- Fix page weight and image compression
- Add `robots.txt`, XML sitemap, canonicals, and schema
- Rewrite title tags and clean heading structure
- Create a New Patients / First Visit page
- Strengthen proof on Home, Athlete, and Concussion

### Priority 2: Conversion upgrades

- Add audience-specific routing on the homepage
- Add repeated contextual CTAs on long pages
- Translate technical methods into patient outcomes more clearly
- Add more authority and testimonial proof by segment

### Priority 3: SEO growth

- Build dedicated condition pages if local SEO expansion is part of the strategy
- Add internal linking between symptom, treatment, and audience pages
- Expand local entity signals across the site

## Bottom Line

This is already a more serious and differentiated site than most local chiropractic websites. The redesign should preserve that sharp positioning. Do not water it down into generic wellness language.

The best next move is to keep the core message and rebuild the site around clearer audience pathways, stronger proof, lower-friction conversion, and technical launch readiness. If those pieces are fixed, this can become a legitimately high-converting local authority site rather than just a better-looking brochure.
