# VAPI Assessment: 54 Questions by Domain (Typeform Build Spec)

**Use this document to build the quiz in Typeform (or similar).**  
One question per screen. One response scale for all questions.

---

## Response scale (use for every question)

- Strongly agree  
- Agree  
- Somewhat agree  
- Neither agree nor disagree  
- Somewhat disagree  
- Disagree  
- Strongly disagree  

**Scoring:** Assign 7 (Strongly agree) down to 1 (Strongly disagree). For each domain, average the 6 question scores, then scale to 0–100 for display if desired: `(average - 1) / 6 * 100`.

---

## Domain 1: Values Clarity (Personal) — 6 questions

1. I have a clear set of values that guide my major decisions.  
2. I can explain what matters most to me in life and business in one or two sentences.  
3. When I’m under pressure, I usually stay true to what I value.  
4. I’ve made important decisions that I later regretted because they didn’t align with my values.  
5. My daily actions reflect my deepest priorities.  
6. I regularly check in with myself to see if I’m still aligned with what I care about.  

---

## Domain 2: Strategic Vision (Business) — 6 questions

7. I have a clear long-term vision for my business.  
8. I know my top 1–3 priorities and focus on them most of the time.  
9. My goals are connected to a bigger picture that motivates me.  
10. I often feel pulled in too many directions.  
11. I have a simple way to decide what to do first when everything feels urgent.  
12. I can describe where I want my business to be in 2–3 years.  

---

## Domain 3: Internal Alignment (Personal) — 6 questions

13. I trust my intuition when making business decisions.  
14. I notice when fear or self-doubt is affecting my choices.  
15. I am willing to let go of old ways of thinking that no longer serve me.  
16. I often second-guess myself after making a decision.  
17. I feel that my mindset supports my goals rather than blocks them.  
18. I have tools or practices that help me when I feel stuck or resistant.  

---

## Domain 4: Aligned Action (Business) — 6 questions

19. I follow through on the plans I set for myself.  
20. I spend most of my time on activities that move my business forward.  
21. I finish important tasks even when they’re uncomfortable.  
22. I often get distracted by urgent but low-value tasks.  
23. I take action on my priorities consistently, not only when motivated.  
24. I have a clear link between my daily actions and my goals.  

---

## Domain 5: Embodied Execution (Business) — 6 questions

25. I have systems in place so my business doesn’t depend only on me.  
26. I work at a pace I can sustain without burning out.  
27. My habits support my long-term success.  
28. I often work long hours and still feel behind.  
29. I have clear boundaries between work and the rest of my life.  
30. I regularly review and improve how I run my business.  

---

## Domain 6: Relationship & Presence (Relationship) — 6 questions

31. My important relationships are healthy and supportive.  
32. I am fully present with people when I’m with them.  
33. My business demands don’t regularly harm my personal relationships.  
34. I find it hard to switch off from work when I’m at home.  
35. I invest time in the people who matter most to me.  
36. I communicate clearly and honestly with key people in my life.  

---

## Domain 7: Learning & Growth (Learning) — 6 questions

37. I actively seek feedback and use it to improve.  
38. I’m willing to try new approaches even when they might fail.  
39. I learn from setbacks instead of letting them define me.  
40. I sometimes avoid learning new skills because they feel uncomfortable.  
41. I have a growth mindset about my abilities and my business.  
42. I make time for learning and development.  

---

## Domain 8: Energy & Well-being (Personal) — 6 questions

43. I protect my energy and say no when I need to.  
44. I have daily habits that support my physical and mental health.  
45. I notice when I’m depleted and take steps to recover.  
46. I often sacrifice sleep or rest to get more done.  
47. I have boundaries that protect my well-being.  
48. I feel that my lifestyle is sustainable for the long term.  

---

## Domain 9: Impact & Leadership (Relationship / Learning) — 6 questions

49. I see myself as a leader in my field or community.  
50. I help others succeed, not only myself.  
51. I am comfortable being visible and sharing my expertise.  
52. I sometimes hold back from leading because of fear of judgment.  
53. My work has a positive impact on the people I serve.  
54. I am building something that will outlast my daily effort.  

---

## After question 54: Email capture screen

**Copy suggestion:**

“Your results are ready. Enter your details below and we’ll show you your VAPI scores across all 9 domains, plus what they mean and suggested next steps.”

- First name (required)  
- Email (required)  

Button: “Get my results”

**On submit:** Redirect to results page. Pass a result identifier in the URL if your setup supports dynamic results (e.g. `?id=xxx`); otherwise use a generic results page and optionally send results by email.

---

## Reverse-scored items (optional)

For questions where “Strongly disagree” is the *better* answer (e.g. 4, 10, 16, 22, 28, 34, 40, 46, 52), reverse the scale when calculating: 8 − raw score, so that higher still means more aligned.
