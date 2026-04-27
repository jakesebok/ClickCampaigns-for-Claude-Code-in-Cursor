# VAPI™ Post-Results Email Nurture Sequence

**Purpose:** After someone receives their VAPI™ results (and the transactional “results ready” email from `app/api/vapi-assessment-complete/route.js`), this sequence deepens meaning, personalizes using their data, and maps clear next steps into Jake’s ecosystem.

**Voice:** Warm, invitational, no hustle—see `Resources/Jake's Voice/JAKE-SEBOK-WRITING-STYLE.md`.

**Implementation notes**

- **Avoid duplicate Day 0:** The API already sends results + portal link. Schedule **Email 1** for **24 hours after completion** (or the next business morning), unless you replace the transactional with a thinner version and move detail here.
- **Personalization:** Use your ESP’s merge fields. Below, `{{field}}` placeholders match the assessment payload shape where applicable. Compute **Founder Archetype** and **primary dysfunction driver** the same way as the portal/API (`enrichResultsWithDriver`, archetype rules in `route.js`).
- **URLs (canonical):**
  - Portal: `https://portal.alignedpower.coach`
  - VAPI (retake / share): `https://jakesebok.com/assessment`
  - ALFRED: `https://alfredai.coach`
  - Work With Me hub: `https://jakesebok.com/work-with-me`
  - Freedom Builders (free course + community): `https://jakesebok.com/work-with-me/freedom-builders`
  - Freedom Workshop: `https://jakesebok.com/work-with-me/freedom-workshop`
  - Aligned Leaders (paid community): `https://jakesebok.com/work-with-me/aligned-leaders`
  - Strategic Intensives: `https://jakesebok.com/work-with-me/strategic-intensives`
  - Accelerator apply: `https://jakesebok.com/work-with-me/apply`

---

## Merge field reference (for builders)

| Merge tag | Source |
|-----------|--------|
| `{{firstName}}` | `firstName` |
| `{{overall}}` | composite score e.g. `6.2` |
| `{{overallTier}}` | e.g. `Functional` |
| `{{arenaPersonal}}`, `{{arenaRelationships}}`, `{{arenaBusiness}}` | arena scores |
| `{{tierPersonal}}`, `{{tierRelationships}}`, `{{tierBusiness}}` | arena tiers |
| `{{archetype}}` | e.g. `The Journeyman` |
| `{{archetypeTagline}}` | from `ARCHETYPE_TAGLINES` in API |
| `{{driver}}` | primary dysfunction pattern name |
| `{{driverCoreBelief}}` | from `DRIVER_CORE_BELIEFS` |
| `{{lowestArenaName}}` | label for arena with lowest score |
| `{{highestArenaName}}` | label for arena with highest score |
| `{{criticalDomains}}` | comma list from `priorityMatrix.criticalPriority` (human labels) |
| `{{assessmentOrdinal}}` | e.g. `3rd` if `assessmentNumber` |

Optional: loop `domains` for top 3 lowest / highest by score.

---

## Email 1 — Day 1 after results  
**Subject:** Your {{overall}} isn’t a grade—it’s a mirror  
**Preview:** What your composite actually measures (and what to do with it).

Hi {{firstName}},

You’ve got your numbers now—composite **{{overall}}** ({{overallTier}}). Here’s the part people miss: **that score isn’t a verdict on you.** It’s a snapshot of how aligned your *life and business* are with what you said matters when you rated importance.

So if something stings? Good. **Pain is a compass**—not punishment.

**Your three arenas at a glance**

- **Personal:** {{arenaPersonal}} ({{tierPersonal}})  
- **Relationships:** {{arenaRelationships}} ({{tierRelationships}})  
- **Business:** {{arenaBusiness}} ({{tierBusiness}})

The goal isn’t to “fix” everything at once. It’s to see **where one honest upgrade would relieve pressure everywhere else.**

→ **Re-open your full report anytime:** [Your portal](https://portal.alignedpower.coach)

If you haven’t saved the PDF, grab it from there—you’ll want it for what’s coming next.

— Jake

---

## Email 2 — Day 3  
**Subject:** The arena that’s asking for your attention first  
**Preview:** {{lowestArenaName}} isn’t “failing.” It’s the lever.

Hi {{firstName}},

Three days ago you looked at the whole picture. Today, zoom in.

Your **lowest arena right now is {{lowestArenaName}}**. That doesn’t mean you’re bad at life. It usually means **this arena is absorbing hidden cost**—time, energy, money, or emotional bandwidth—that the other two arenas end up paying for.

Your **strongest arena is {{highestArenaName}}**—that’s leverage. You already know how to show up there. The question is whether you’re **borrowing** from that strength to avoid the conversation {{lowestArenaName}} is trying to have with you.

No shame. Just data.

**If you want support turning this into a plan (not just insight):**

- **Daily execution + coaching** that remembers your VAPI, archetype, and weekly commitments: [ALFRED — Aligned Freedom Coach](https://alfredai.coach)  
- **Free rhythm:** [Freedom Builders Community + Aligned Freedom Course](https://jakesebok.com/work-with-me/freedom-builders)

— Jake

---

## Email 3 — Day 5  
**Subject:** The domains behind the score (your real to-do list)  
**Preview:** {{criticalDomains}} — and why “busy” isn’t the same as aligned.

Hi {{firstName}},

Underneath your arena scores are **twelve domains**—the actual dials you’re turning whether you mean to or not.

Your report flagged these as **critical priority** right now: **{{criticalDomains}}**.

That’s not a shame list. It’s **where misalignment costs you the most** relative to what you said you care about.

Two moves that actually help:

1. **Pick one domain** from that critical list—not five—and name *one* behavior you’d be proud of this week.  
2. **Protect what’s already working.** “Sustain” matters as much as “fix.”

Your portal breaks this down with more nuance than I can fit in an email—**open your matrix** and read it like a strategist, not a critic.

→ [View your VAPI report](https://portal.alignedpower.coach)

— Jake

---

## Email 4 — Day 7  
**Subject:** You’re {{archetype}}. Here’s what that’s trying to tell you.  
**Preview:** Archetype + pattern—not astrology. Structure.

Hi {{firstName}},

Your **Founder Archetype** is **{{archetype}}**.

*{{archetypeTagline}}*

That label isn’t who you *are* forever. It’s **a structural read** on how your three arenas are interacting *right now*. Same data, different founders, different archetypes—because **alignment isn’t one-size-fits-all.**

There’s another layer: your **primary dysfunction pattern** shows up as **{{driver}}**.

Under stress, the story sounds like: *“{{driverCoreBelief}}”*

You’re not broken for having a pattern. **You’re human for having a default.** The work is noticing it early enough to choose differently.

**Where this gets easier (not just smarter):**

- **ALFRED** keeps this context in the room—VAPI, archetype, pattern, weekly **6Cs** check-in, and your **Vital Action**—so you’re not re-explaining yourself to a blank chat every Tuesday night: [alfredai.coach](https://alfredai.coach)

— Jake

---

## Email 5 — Day 10  
**Subject:** Free doesn’t mean “light”—it means “start here”  
**Preview:** Course, community, workshop—pick your door.

Hi {{firstName}},

If you’re not ready for an app subscription or a cohort yet, **you still belong in the ecosystem.**

**Free entries (choose what fits your nervous system):**

1. **Freedom Builders Community + Aligned Freedom Course** — pace-yourself foundations, peers who get the “beautiful prison” thing, and a path through avatar/offer/ads/networking/course creation when you’re ready:  
   [Freedom Builders](https://jakesebok.com/work-with-me/freedom-builders)  
   *(Aligned Business Foundations bundle / individual courses live inside this world—start free, add depth when it’s honest.)*

2. **Aligned Freedom Workshop** (monthly, 90 min) — surface what's holding you back and get coached live in the room. Clarity, community, no fluff:  
   [Next workshop](https://jakesebok.com/work-with-me/freedom-workshop)

3. **VAPI™ again later** — especially after a real season of change. Your {{assessmentOrdinal}} snapshot is a dot, not your identity:  
   [Retake when you’re ready](https://jakesebok.com/assessment)

**When you want the methodology without waiting for “someday”:**

- **Strategic Alignment Intensive** — quarterly half-day, Strategic Clarity + your **Aligned AIOS** master context:  
  [Intensives](https://jakesebok.com/work-with-me/strategic-intensives)

— Jake

---

## Email 6 — Day 14  
**Subject:** The paid layer (only if you want rhythm, not more content)  
**Preview:** Community + ALFRED + deeper programs—what each is for.

Hi {{firstName}},

Quick map so you don’t buy the wrong thing:

| If you need… | Consider… |
|--------------|-----------|
| **Peers + calls + ongoing accountability** | [Aligned Leaders Community](https://jakesebok.com/work-with-me/aligned-leaders) |
| **Daily AI coaching that knows your scores & commitments** | [ALFRED](https://alfredai.coach) |
| **A concentrated strategic reset + Aligned AIOS** | [Strategic Alignment Intensive](https://jakesebok.com/work-with-me/strategic-intensives) |
| **12 months, full Aligned Power™ path, application-only** | [Aligned Power Accelerator](https://jakesebok.com/work-with-me/apply) |

**Growth Alliance Network** — if you’re in that tier already, you know who you are; otherwise start with Aligned Leaders or ask on your consult which fit is real.

No pressure to stack everything. **Alignment is subtractive before it’s additive.**

— Jake

---

## Email 7 — Day 21  
**Subject:** For the founder who’s done collecting frameworks  
**Preview:** Accelerator applications—when the work is embodiment, not information.

Hi {{firstName}},

Some people need another PDF. Some people need **a container**—where the same truth shows up on Monday, Wednesday, and the Friday you want to quit.

That’s what the **Aligned Power Accelerator** is for: **twelve months** moving through Awareness → Strategic Clarity → Internal Alignment → Aligned Action → Embodied Execution—with me and a cohort who aren’t impressed by hustle for hustle’s sake.

It’s **application-only** because I’m protective of the room.

→ [Apply — Aligned Power Accelerator](https://jakesebok.com/work-with-me/apply)

If you’re not there yet, that’s not a moral failure. **Keep your Vital Action small, your self-talk honest, and your portal bookmarked.**

— Jake

---

## Email 8 — Day 30 (optional re-engagement)  
**Subject:** Still thinking about {{lowestArenaName}}?  
**Preview:** One tiny next step—no new philosophy required.

Hi {{firstName}},

It’s been a month since your VAPI™. If life got loud and this sat in your inbox, **you’re normal.**

One question: *What would “5% more aligned” look like in **{{lowestArenaName}}** this week?*

Not a revolution. A **5%** shift you’d actually do.

If you want help holding that without adding more noise:

- [Open ALFRED](https://alfredai.coach)  
- [Freedom Builders](https://jakesebok.com/work-with-me/freedom-builders)  
- [Your portal report](https://portal.alignedpower.coach)

Rooting for you.

— Jake

---

## QA checklist before send

- [ ] Archetype + driver match portal logic for each test profile  
- [ ] Arena keys normalized (`Personal` vs legacy `Self` if any)  
- [ ] `criticalDomains` renders readable labels (not raw codes only)  
- [ ] Links UTM-tagged if you track campaigns  
- [ ] Unsubscribe + physical address per CAN-SPAM  

---

*Sequence version: 2026-03-21 — aligns with Brand KB naming (ALFRED, Aligned AIOS, VAPI™ arenas/domains).*
