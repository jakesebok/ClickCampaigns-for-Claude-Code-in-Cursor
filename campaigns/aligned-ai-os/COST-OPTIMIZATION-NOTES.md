# Aligned Freedom Coach Cost Optimization Notes

**Last updated:** March 2025

This document summarizes cost-saving measures from Anthropic's recommendations and what we've implemented.

---

## What We Implemented

### 1. Prompt Caching (✅ Implemented)

**What it does:** Caches the system prompt + user context + conversation history so repeat requests don't reprocess the same tokens. Cache reads cost ~10% of normal input price.

**Where we use it:** Chat (`streamCoachingResponse` in `lib/ai/coaching.ts`)

**Why it helps:** Every chat turn sends:
- COACHING_SYSTEM_PROMPT (~2,000 tokens)
- User's Master Context (3,000–10,000+ tokens)
- Conversation history

Turn 1: Full processing (cache write, ~25% more than base).
Turn 2+: Most tokens read from cache (~90% savings on cached portion).

**Note (2025):** Chat/voice now append richer VAPI + 6Cs blocks (Focus Here First, driver pattern, archetype essence, score deltas, `weekly_review` JSON). First-turn token count may be slightly higher; caching still applies on follow-up turns.

**SDK change:** Upgraded `@anthropic-ai/sdk` from 0.39.0 to 0.78.0 for native `cache_control` support.

---

## What We Did NOT Implement (And Why)

### 2. Batch Processing

**What it does:** Submit many requests asynchronously for 50% discount. Good for bulk operations (evaluations, content moderation, bulk generation).

**Why we skipped:** Our API calls are all user-initiated and real-time:
- **Chat:** User expects immediate streaming response. Can't batch.
- **Context generation (onboarding):** User uploads worksheets and waits for result. One-off.
- **Context patch:** User updates their blueprint and waits. One-off.

Batch is for "I have 1,000 documents to process and I'll check back in an hour." We don't have that pattern.

### 3. Model Downgrade (Haiku for Simple Tasks)

**Recommendation:** Use Haiku 4.5 for high-volume/simple tasks, Sonnet for complex agents.

**Our usage:** All Anthropic calls use **Claude Sonnet 4** for:
- **Chat:** Complex coaching agent (NLP, strategy, inner work). Needs Sonnet.
- **Context generation:** Structured output, template filling, conflict resolution. Needs Sonnet.
- **Context patch:** Same complexity.

We don't have any "simple" Anthropic tasks. Voice uses OpenAI Realtime (separate cost). Morning prompts may use Twilio or push/in-app paths depending on configuration (no AI in the nudge itself).

**Verdict:** Sonnet is the right model. No downgrade recommended.

---

## Monitoring Cache Effectiveness

**In-app:** Settings → "Chat Usage & Cache Savings" shows your token usage and cache hit rate for the last 30 days.

**API:** `GET /api/usage?days=30` returns aggregated stats (request count, input/output tokens, cache read/creation tokens, cache hit rate). Requires authentication.

**Database:** Each chat request logs to `api_usage_logs` with:
- `input_tokens`, `output_tokens`
- `cache_read_input_tokens` (tokens read from cache — this is your savings)
- `cache_creation_input_tokens` (tokens written to cache on first use)

If `cache_read_input_tokens` is > 0 on follow-up chat turns, caching is active.

---

## References

- [Prompt Caching Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Batch Processing Docs](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
- [Anthropic Pricing](https://www.anthropic.com/pricing)
