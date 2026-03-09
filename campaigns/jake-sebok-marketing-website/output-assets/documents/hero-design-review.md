# Hero Section — Cassidy's Design Review

**Designer:** Cassidy (Website Designer)

---

## The Problem

The quote + thumbnail block feels like it's in a "slightly strange position." Here's why:

### Current Layout
- **Grid:** 2 columns, `items-center` (vertically centered)
- **Right column:** Quote block (max-w-[280px]) with `justify-end` + `lg:-translate-y-4 lg:-translate-x-6`
- **Result:** The block floats in the middle of the right column, then gets pulled up 1rem and left 1.5rem by the translate

### Why It Feels Off

1. **No clear anchor** — `items-center` centers both columns. The left column has real weight (headline, body, CTAs). The right column is lighter (quote + small thumbnail). Centering a small block in a tall column makes it feel adrift—neither aligned with the headline nor with the CTAs.

2. **Arbitrary translate** — `-translate-y-4 -translate-x-6` moves the block without a grid-based reason. It's not aligning to anything—just "pushing it somewhere." That creates visual unease.

3. **Awkward zone** — The translate pulls the block left, potentially into the boundary between the two columns or into a transitional part of the orange diagonal. It ends up in a "no man's land" rather than clearly in the content column or clearly on the orange.

---

## Recommended Fix

**Anchor the block to a clear position.** Two options:

### Option A: Top-align (recommended)
- Change grid to `items-start` instead of `items-center`
- Remove the translate (`-translate-y-4 -translate-x-6`)
- **Result:** Quote block sits at the top-right of its column, aligning with the headline. Clear horizontal relationship. No floating.

### Option B: Bottom-align
- Change grid to `items-end`
- Remove the translate
- **Result:** Quote block sits at the bottom-right, aligning with the CTAs. Creates a "base" for the right column.

---

## Alternative: Reposition the Thumbnail

If the block position still feels off after anchoring, consider:

- **Thumbnail above quote** — Circular image as visual anchor, quote flows below. Stronger hierarchy.
- **Inline thumbnail** — Thumbnail left of quote (already done), but could increase thumbnail size slightly for more presence.
- **Move to left column** — Quote below body copy, above CTAs. Single-column hero. Removes the "floating on orange" entirely—cleaner but less dynamic.

---

*Implementing Option A.*
