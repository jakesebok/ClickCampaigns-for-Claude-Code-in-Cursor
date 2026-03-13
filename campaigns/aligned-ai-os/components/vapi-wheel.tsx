"use client";

import { DOMAINS } from "@/lib/vapi/quiz-data";
import { getTierColor } from "@/lib/vapi/scoring";

const ORDER = ["PH", "IA", "ME", "AF", "RS", "FA", "CO", "WI", "VS", "EX", "OH", "EC"];
const ARENA_COLORS: Record<string, string> = {
  personal: "#9e4a5e",
  relationships: "#5b7c9a",
  business: "#38a169",
};

type Props = {
  domainScores: Record<string, number>;
};

export function VapiWheel({ domainScores }: Props) {
  const cx = 100;
  const cy = 100;
  const r = 85;
  const rInner = r * 0.4;
  const segmentAngle = 360 / 12;

  function cellPath(r0: number, r1: number, a0Rad: number, a1Rad: number) {
    const x1 = cx + r1 * Math.cos(a0Rad);
    const y1 = cy + r1 * Math.sin(a0Rad);
    const x2 = cx + r1 * Math.cos(a1Rad);
    const y2 = cy + r1 * Math.sin(a1Rad);
    const x3 = cx + r0 * Math.cos(a1Rad);
    const y3 = cy + r0 * Math.sin(a1Rad);
    const x4 = cx + r0 * Math.cos(a0Rad);
    const y4 = cy + r0 * Math.sin(a0Rad);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r1} ${r1} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r0} ${r0} 0 0 0 ${x4} ${y4} Z`;
  }

  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full max-w-[240px] mx-auto"
      role="img"
      aria-label="Alignment wheel"
    >
      <defs>
        <filter id="wheelShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="1" floodOpacity="0.2" />
        </filter>
      </defs>
      {ORDER.map((code, i) => {
        const domain = DOMAINS.find((d) => d.code === code);
        const score = Math.max(0, Math.min(10, domainScores[code] ?? 0));
        const arena = domain?.arena ?? "personal";
        const fillColor = getTierColor(
          score >= 8 ? "Dialed" : score >= 6 ? "Functional" : score >= 4 ? "Below the Line" : "In the Red"
        );
        const arenaBase = ARENA_COLORS[arena] ?? ARENA_COLORS.personal;

        const a0Rad = ((i * segmentAngle - 90) * Math.PI) / 180;
        const a1Rad = (((i + 1) * segmentAngle - 90) * Math.PI) / 180;

        const segments = [];
        for (let k = 1; k <= 10; k++) {
          const r0 = r * ((k - 1) / 10);
          const r1 = r * (k / 10);
          const filled = k <= Math.round(score);
          segments.push(
            <path
              key={k}
              d={cellPath(r0, r1, a0Rad, a1Rad)}
              fill={filled ? arenaBase : `${arenaBase}20`}
              fillOpacity={filled ? 0.85 : 0.3}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="0.5"
            />
          );
        }

        return <g key={code}>{segments}</g>;
      })}
      {Array.from({ length: 10 }, (_, ring) => (
        <circle
          key={ring}
          cx={cx}
          cy={cy}
          r={r * ((ring + 1) / 10)}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
        />
      ))}
      {ORDER.map((_, i) => {
        const a0 = ((i * segmentAngle - 90) * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(a0)}
            y2={cy + r * Math.sin(a0)}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
    </svg>
  );
}
