"use client";

import { DOMAINS } from "@/lib/vapi/quiz-data";

const ORDER = ["PH", "IA", "ME", "AF", "RS", "FA", "CO", "WI", "VS", "EX", "OH", "EC"];

// Short labels for wheel segments (matches portal dashboard)
const WHEEL_LABELS: Record<string, string[]> = {
  PH: ["Physical", "Health"],
  IA: ["Inner", "Alignment"],
  ME: ["Mental /", "Emotional"],
  AF: ["Attention", "& Focus"],
  RS: ["Relationship", "to Self"],
  FA: ["Family"],
  CO: ["Community"],
  WI: ["World /", "Impact"],
  VS: ["Vision /", "Strategy"],
  EX: ["Execution"],
  OH: ["Operational", "Health"],
  EC: ["Ecology"],
};
const ARENA_COLORS: Record<string, string> = {
  personal: "#9e4a5e",
  relationships: "#5b7c9a",
  business: "#38a169",
};

type Props = {
  domainScores: Record<string, number>;
  metricKey?: string;
  onMetricSelect?: (metricKey: string) => void;
};

function getWheelTransform(metricKey: string) {
  const focusScale = 1.28;
  if (metricKey === "overall") return { scale: focusScale, rotate: 0 };
  if (metricKey.startsWith("domain:")) {
    const code = metricKey.slice(7);
    const i = ORDER.indexOf(code);
    if (i < 0) return { scale: focusScale, rotate: 0 };
    const segmentCenterAngle = -75 + 30 * i;
    return { scale: focusScale, rotate: -90 - segmentCenterAngle };
  }
  if (metricKey.startsWith("arena:")) {
    const arena = metricKey.slice(6);
    const centerAngles: Record<string, number> = {
      personal: -30,
      relationships: 90,
      business: 210,
    };
    return {
      scale: focusScale,
      rotate: centerAngles[arena] != null ? -90 - centerAngles[arena] : 0,
    };
  }
  return { scale: focusScale, rotate: 0 };
}

function getOpacity(metricKey: string, code: string) {
  if (metricKey === "overall") return 1;
  if (metricKey.startsWith("domain:")) {
    return metricKey.slice(7) === code ? 1 : 0.14;
  }
  if (metricKey.startsWith("arena:")) {
    const arena = metricKey.slice(6);
    const domain = DOMAINS.find((d) => d.code === code);
    return domain?.arena === arena ? 1 : 0.14;
  }
  return 1;
}

export function VapiWheel({
  domainScores,
  metricKey = "overall",
  onMetricSelect,
}: Props) {
  const cx = 140;
  const cy = 140;
  const r = 85;
  const rInner = r * 0.42;
  const segmentAngle = 360 / 12;
  const labelRadius = r + 12;
  const transform = getWheelTransform(metricKey);

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

  function arcPath(startDeg: number, endDeg: number) {
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;
    const x1 = cx + rInner * Math.cos(startRad);
    const y1 = cy + rInner * Math.sin(startRad);
    const x2 = cx + rInner * Math.cos(endRad);
    const y2 = cy + rInner * Math.sin(endRad);
    return `M ${x1} ${y1} A ${rInner} ${rInner} 0 0 1 ${x2} ${y2}`;
  }

  return (
    <div className="flex items-center justify-center w-full min-w-[200px] max-w-[320px] mx-auto overflow-visible">
      <svg
        viewBox="0 0 280 280"
        className="w-full h-auto overflow-visible"
        style={{ minWidth: 200 }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        role="img"
        aria-label="Alignment wheel"
      >
        <defs>
          <filter id="wheelShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="1" floodOpacity="0.2" />
          </filter>
        </defs>
        {/* Arena arc paths for textPath */}
        <path id="wheel-arena-personal" d={arcPath(-90, 30)} fill="none" />
        <path id="wheel-arena-relationships" d={arcPath(30, 150)} fill="none" />
        <path id="wheel-arena-business" d={arcPath(150, 270)} fill="none" />
        <g
          transform={`translate(${cx} ${cy}) scale(${transform.scale}) rotate(${transform.rotate}) translate(${-cx} ${-cy})`}
          style={{ transition: "transform 650ms ease-out" }}
        >
          {ORDER.map((code, i) => {
            const domain = DOMAINS.find((d) => d.code === code);
            const score = Math.max(0, Math.min(10, domainScores[code] ?? 0));
            const arena = domain?.arena ?? "personal";
            const arenaBase = ARENA_COLORS[arena] ?? ARENA_COLORS.personal;
            const opacity = getOpacity(metricKey, code);

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

            return (
              <g
                key={code}
                style={{ opacity, transition: "opacity 300ms ease-out" }}
                className={onMetricSelect ? "cursor-pointer" : undefined}
                onClick={() => onMetricSelect?.(`domain:${code}`)}
              >
                {segments}
              </g>
            );
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
          {/* Arena labels */}
          {[
            ["personal", "#wheel-arena-personal", "Personal"],
            ["relationships", "#wheel-arena-relationships", "Relationships"],
            ["business", "#wheel-arena-business", "Business"],
          ].map(([arena, href, label]) => (
            <text
              key={arena}
              fontSize="13"
              fontFamily='"Cormorant Garamond", serif'
              fontWeight="800"
              fill="hsl(var(--accent))"
              className={onMetricSelect ? "select-none cursor-pointer" : "select-none"}
              style={{
                opacity:
                  metricKey === "overall" || metricKey === `arena:${arena}` ? 1 : 0.3,
                transition: "opacity 300ms ease-out",
              }}
              onClick={() => onMetricSelect?.(`arena:${arena}`)}
            >
              <textPath xlinkHref={href} startOffset="50%" textAnchor="middle">
                {label}
              </textPath>
            </text>
          ))}
          {/* Domain labels */}
          {ORDER.map((code, i) => {
            const midDeg = i * segmentAngle - 90 + segmentAngle / 2;
            const midRad = (midDeg * Math.PI) / 180;
            const tx = cx + labelRadius * Math.cos(midRad);
            const ty = cy + labelRadius * Math.sin(midRad);
            const anchor =
              midDeg >= -90 && midDeg < 90
                ? "start"
                : Math.abs(midDeg) < 10 || Math.abs(midDeg - 180) < 10
                  ? "middle"
                  : "end";
            const lines = WHEEL_LABELS[code] || [code];
            const lineHeight = 9;
            const firstDy = lines.length > 1 ? -0.5 * (lines.length - 1) * lineHeight : 0;
            return (
              <text
                key={`label-${code}`}
                x={tx}
                y={ty}
                fontSize="10"
                fill="hsl(var(--accent))"
                fontFamily='"Cormorant Garamond", serif'
                fontWeight="800"
                textAnchor={anchor}
                dominantBaseline="middle"
                className={onMetricSelect ? "select-none cursor-pointer" : "select-none"}
                style={{ opacity: getOpacity(metricKey, code), transition: "opacity 300ms ease-out" }}
                onClick={() => onMetricSelect?.(`domain:${code}`)}
              >
                {lines.map((line, L) => (
                  <tspan
                    key={L}
                    x={tx}
                    dy={L === 0 ? (firstDy ? `${firstDy}px` : 0) : `${lineHeight}px`}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
}
