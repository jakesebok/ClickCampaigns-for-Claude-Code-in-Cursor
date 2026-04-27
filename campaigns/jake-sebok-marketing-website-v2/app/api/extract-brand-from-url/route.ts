import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizeHex(hex: string): string | null {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return (
      "#" +
      h
        .split("")
        .map((c) => c + c)
        .join("")
        .toUpperCase()
    );
  }
  if (h.length === 6) return "#" + h.toUpperCase();
  return null;
}

function extractColors(html: string): string[] {
  const counts = new Map<string, number>();
  const hexRe = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
  let m: RegExpExecArray | null;
  while ((m = hexRe.exec(html)) !== null) {
    const raw = m[0];
    const n = normalizeHex(raw);
    if (!n) continue;
    if (/^(#FFFFFF|#000000|#FFF|#000|#F5F5F5|#F8F8F8|#EEEEEE)$/i.test(n)) continue;
    counts.set(n, (counts.get(n) || 0) + 1);
  }
  const meta = html.match(
    /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i
  );
  if (meta?.[1] && meta[1].startsWith("#")) {
    const n = normalizeHex(meta[1]);
    if (n) counts.set(n, (counts.get(n) || 0) + 5);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([c]) => c)
    .slice(0, 12);
}

function extractGoogleFonts(html: string): string[] {
  const out: string[] = [];
  const linkRe =
    /fonts\.googleapis\.com\/css2?\?[^"']*family=([^&"']+)/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(html)) !== null) {
    const name = decodeURIComponent(m[1].replace(/\+/g, " "))
      .split(":")[0]
      .trim();
    if (name && !out.includes(name)) out.push(name);
  }
  return out.slice(0, 4);
}

function extractBodyFontFamily(html: string): string | null {
  const body = html.match(/body\s*\{[\s\S]{0,800}?\}/i);
  if (!body) return null;
  const fm = body[0].match(/font-family:\s*([^;{}]+)/i);
  if (!fm) return null;
  return fm[1]
    .replace(/['"]/g, "")
    .split(",")[0]
    .trim();
}

export async function POST(request: Request) {
  let urlStr = "";
  try {
    const body = await request.json();
    urlStr = String(body?.url || "").trim();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!/^https:\/\//i.test(urlStr)) {
    return NextResponse.json(
      { error: "https_only", message: "Use a full https:// URL." },
      { status: 400 }
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return NextResponse.json({ error: "bad_url" }, { status: 400 });
  }

  if (!parsed.hostname || parsed.hostname === "localhost") {
    return NextResponse.json({ error: "invalid_host" }, { status: 400 });
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 12000);

  try {
    const res = await fetch(parsed.toString(), {
      signal: ac.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "AlignedPowerBrandPreview/1.0 (+https://jakesebok.com)",
      },
      redirect: "follow",
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: "fetch_status", status: res.status },
        { status: 422 }
      );
    }

    const slice = text.slice(0, 600_000);
    const colors = extractColors(slice);
    const googleFonts = extractGoogleFonts(slice);
    const bodyFont = extractBodyFontFamily(slice);

    return NextResponse.json({
      colors,
      googleFonts,
      bodyFontGuess: bodyFont,
      note:
        colors.length === 0
          ? "No hex colors detected in the first pass. Paste primaries manually or share a Drive link to your brand PDF."
          : null,
    });
  } catch {
    return NextResponse.json(
      {
        error: "fetch_failed",
        message:
          "Could not read that URL (blocked, timeout, or not HTML). Paste hex codes instead.",
      },
      { status: 422 }
    );
  } finally {
    clearTimeout(timer);
  }
}
