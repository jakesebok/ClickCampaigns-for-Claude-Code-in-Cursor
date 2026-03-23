/** Normalize sprint task strings for duplicate detection. */
export function normalizeSprintTaskText(s: string | undefined): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export type SprintTaskDisplayMode = "title" | "body" | "both";

/**
 * When description repeats or extends the title, show a single block so flex rows do not clip a "headline" line.
 */
export function getSprintTaskDisplay(t: {
  title: string;
  description?: string;
}): { mode: SprintTaskDisplayMode; title: string; body: string } {
  const title = normalizeSprintTaskText(t.title);
  const desc = normalizeSprintTaskText(t.description);
  const tl = title.toLowerCase();
  const dl = desc.toLowerCase();

  if (!desc) return { mode: "title", title, body: "" };
  if (!title) return { mode: "body", title: "", body: desc };
  if (dl === tl) return { mode: "body", title: "", body: desc };
  if (dl.startsWith(tl)) {
    const rest = desc.slice(title.length).replace(/^[\s:.;,\-–—]+/g, "").trim();
    if (!rest) return { mode: "title", title, body: "" };
    return { mode: "body", title: "", body: desc };
  }
  return { mode: "both", title, body: desc };
}
