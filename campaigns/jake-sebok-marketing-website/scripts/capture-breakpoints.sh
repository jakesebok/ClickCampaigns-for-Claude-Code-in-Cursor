#!/usr/bin/env bash
# capture-breakpoints.sh — capture every page of a deployed LocalCraft
# customer site at three real breakpoints. Used by polish-wave-runner
# (BUILD-STANDARDS §15) to produce per-wave evidence that the polish
# pass actually LOOKED at the site instead of guessing from CSS.
#
# Three breakpoints captured per path:
#   - Desktop : 1440×900   @ 2× DPI, default UA
#   - Tablet  : 820×1180   @ 2× DPI, default UA
#   - Mobile  : 430×932    @ 3× DPI, iPhone 17 UA
#
# Each capture uses Chrome headless with --virtual-time-budget=15000
# so animations + fonts + lazy images settle before the shot is taken.
# This is the same technique used to re-capture Madison County Roofing
# on 2026-05-19 — the resulting mobile screenshot was visually
# indistinguishable from a real iPhone screenshot of the same page.
#
# Usage:
#   capture-breakpoints.sh \
#     --site-url   https://highland-pool-spa-website.vercel.app \
#     --paths      "/,/about/,/services/,/contact/" \
#     --out-dir    /Users/jakesebok/Repos/clients/highland-pool-spa/output-assets/polish-shots/wave-3
#
# Exit 0 on success (all captures written). Exit 1 on any error.
# Output file naming: {path-slug}-{breakpoint}.png
#   - "/"           → "home-desktop.png", "home-tablet.png", "home-mobile.png"
#   - "/about/"     → "about-desktop.png", ...
#   - "/services/" → "services-desktop.png", ...

set -uo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
MOBILE_UA='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
VTB=15000  # virtual-time-budget in ms — wait for animations / fonts / lazy images

# ─── arg parsing ──────────────────────────────────────────────────
SITE_URL=""
PATHS=""
OUT_DIR=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --site-url)  SITE_URL="$2"; shift 2 ;;
    --paths)     PATHS="$2";    shift 2 ;;
    --out-dir)   OUT_DIR="$2";  shift 2 ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$SITE_URL" || -z "$PATHS" || -z "$OUT_DIR" ]]; then
  echo "usage: capture-breakpoints.sh --site-url URL --paths CSV --out-dir DIR" >&2
  exit 1
fi
if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found at $CHROME" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

# Strip trailing slash from site URL so we can concatenate cleanly.
SITE_URL="${SITE_URL%/}"

# ─── helpers ──────────────────────────────────────────────────────
path_to_slug() {
  local p="$1"
  # "/" → "home"; "/about/" → "about"; "/services/x/" → "services-x"
  p="${p#/}"
  p="${p%/}"
  if [[ -z "$p" ]]; then
    echo "home"
  else
    echo "${p//\//-}"
  fi
}

capture() {
  local url="$1"
  local out="$2"
  local size="$3"
  local dpr="$4"
  local ua="$5"

  # Build the argv as an array so we can conditionally include the UA flag
  # without leaving a stray empty argument behind. Chrome treats an empty
  # positional arg as a second URL and refuses with "Multiple targets are
  # not supported in headless mode."
  local -a args=(
    --headless=new
    --disable-gpu
    --hide-scrollbars
    --no-sandbox
    "--virtual-time-budget=$VTB"
    --run-all-compositor-stages-before-draw
    "--force-device-scale-factor=$dpr"
    "--window-size=$size"
  )
  if [[ -n "$ua" ]]; then
    args+=( "--user-agent=$ua" )
  fi
  args+=( "--screenshot=$out" "$url" )

  "$CHROME" "${args[@]}" >/dev/null 2>&1

  if [[ ! -s "$out" ]]; then
    echo "FAIL: $out was not written or is empty (url=$url)" >&2
    return 1
  fi
}

# ─── per-path capture loop ────────────────────────────────────────
IFS=',' read -r -a PATH_LIST <<< "$PATHS"
FAILS=0
TOTAL=0

for raw in "${PATH_LIST[@]}"; do
  # Trim surrounding whitespace
  p="${raw#"${raw%%[![:space:]]*}"}"
  p="${p%"${p##*[![:space:]]}"}"
  [[ -z "$p" ]] && continue

  slug="$(path_to_slug "$p")"
  url="${SITE_URL}${p}"

  # Desktop: 1440×900 @ 2x DPI
  TOTAL=$((TOTAL + 1))
  if ! capture "$url" "$OUT_DIR/${slug}-desktop.png" "1440,900"  2 ""; then
    FAILS=$((FAILS + 1))
  fi

  # Tablet: 820×1180 @ 2x DPI
  TOTAL=$((TOTAL + 1))
  if ! capture "$url" "$OUT_DIR/${slug}-tablet.png"  "820,1180"  2 ""; then
    FAILS=$((FAILS + 1))
  fi

  # Mobile: 430×932 @ 3x DPI + iPhone UA
  TOTAL=$((TOTAL + 1))
  if ! capture "$url" "$OUT_DIR/${slug}-mobile.png"  "430,932"   3 "$MOBILE_UA"; then
    FAILS=$((FAILS + 1))
  fi

  echo "✓ ${slug} (3 breakpoints)"
done

echo ""
echo "Captured $((TOTAL - FAILS))/$TOTAL screenshots to $OUT_DIR"

if [[ $FAILS -gt 0 ]]; then
  echo "WARN: $FAILS captures failed — wave-runner should retry or surface to operator" >&2
  exit 1
fi
