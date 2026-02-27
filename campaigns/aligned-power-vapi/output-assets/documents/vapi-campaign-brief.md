# VAPI Campaign Brief: Values-Aligned Performance Indicator Assessment

**Campaign name:** Aligned Power Values-Aligned Performance Indicator Assessment  
**Short name:** VAPI Assessment  
**Brand:** Aligned Power (brand kit and style guide in `campaigns/aligned-power-vapi/brand-kit/`)

---

## 1. Campaign overview

- **Landing page:** Visitor learns about the VAPI assessment and clicks to start (no email required to begin).
- **Quiz:** 54 questions, Typeform-style (one question per screen). Answer scale: Strongly agree → Strongly disagree (7 options). Questions map to **9 domains**; answers are weighted per domain to produce 9 separate scores.
- **Email gate:** At the end of the quiz, user enters name/email to receive results.
- **Results page:** Shows 9-domain scores (downloadable graphic), interpretation, suggested next steps, and upsells (free course, join community/team).

---

## 2. Nine domains (personal, business, relationship & learning)

| # | Domain | Category | Description |
|---|--------|----------|-------------|
| 1 | Values Clarity | Personal | Knowing what matters most; decisions aligned with core values |
| 2 | Strategic Vision | Business | Clear direction, priorities, and long-term picture |
| 3 | Internal Alignment | Personal | Mindset, limiting beliefs, self-trust, resistance |
| 4 | Aligned Action | Business | Execution, follow-through, doing the right things |
| 5 | Embodied Execution | Business | Systems, habits, sustainable operations |
| 6 | Relationship & Presence | Relationship | Quality of relationships; presence at work and home |
| 7 | Learning & Growth | Learning | Willingness to learn, adapt, and grow |
| 8 | Energy & Well-being | Personal | Energy management, boundaries, health |
| 9 | Impact & Leadership | Relationship / Learning | Influence, leading others, making a difference |

**Scoring:** 6 questions per domain (54 total). Each question uses the same 7-point scale; answers are weighted per domain to produce a score (e.g. 0–100 or 1–7 average) per domain.

---

## 3. Answer scale (use in Typeform/quiz tool)

- Strongly agree  
- Agree  
- Somewhat agree  
- Neither agree nor disagree  
- Somewhat disagree  
- Disagree  
- Strongly disagree  

**Weighting suggestion:** Strongly agree = 7, Agree = 6, … Strongly disagree = 1. Domain score = average (or sum) of the 6 questions in that domain, then normalize to a 0–100 or 1–7 display.

---

## 4. Funnel flow

1. **Landing page** (`vapi-landing.html`)  
   - Headline/subhead about discovering alignment across 9 areas  
   - CTA: “Start the VAPI Assessment” → links to Typeform (or quiz URL)

2. **Quiz (external)**  
   - Build in Typeform (or similar): 54 questions, one per screen, progress bar  
   - Last screen: “Enter your name and email to get your results”  
   - On submit: redirect to results page (with token/ID so results can be loaded or passed)

3. **Results page** (`vapi-results.html`)  
   - 9-domain score graphic (downloadable)  
   - Short interpretation of what scores mean  
   - 2–3 next steps (e.g. focus on lowest domain, join free workshop)  
   - Upsells: free Aligned Success course, Aligned Entrepreneurs Community / join the team

---

## 5. Upsells to feature on results page

- **Free:** Aligned Success course (in Aligned Entrepreneurs Community)  
- **Free:** Aligned Success Workshop (monthly 90-minute)  
- **Community:** Join Aligned Entrepreneurs Community (free tier or paid)  
- **Next step:** Book a call / join the team (as appropriate)

---

## 6. Deliverables in this campaign

| Asset | Path | Purpose |
|-------|------|---------|
| Landing page | `output-assets/html/vapi-landing.html` | Opt-in to start assessment |
| Results page | `output-assets/html/vapi-results.html` | Scores, interpretation, next steps, upsells |
| Quiz question spec | `output-assets/documents/vapi-quiz-questions-by-domain.md` | 54 questions by domain for Typeform build |

The actual Typeform (or quiz) is built in the chosen tool and linked from the landing page; results page can be reached via redirect after email capture (with or without dynamic results via query params/API).
