"use client";

import { useEffect, useState } from "react";
import { DOMAINS } from "@/lib/vapi/quiz-data";

const ORDER = ["PH", "IA", "ME", "AF", "RS", "FA", "CO", "WI", "VS", "EX", "OH", "EC"] as const;
const DOMAIN_LABELS: Record<string, string[]> = {
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

const ARENA_DARK: Record<string, string> = {
  personal: "#9e4a5e",
  relationships: "#5b7c9a",
  business: "#38a169",
};

const ARENA_LIGHT: Record<string, string> = {
  personal: "#f0d8dc",
  relationships: "#dce6ed",
  business: "#d4f0e0",
};

type MetricKey = "overall" | `arena:${string}` | `domain:${string}`;

type BaseProps = {
  metricKey?: MetricKey;
  onMetricSelect?: (metricKey: MetricKey) => void;
};

type OverviewProps = {
  domainScores: Record<string, number>;
};

type BreakdownProps = OverviewProps & BaseProps;

type ComparativeProps = BaseProps & {
  previousDomainScores: Record<string, number>;
  currentDomainScores: Record<string, number>;
};

function normalizeArenaKey(value: string | undefined) {
  const arena = String(value || "personal").toLowerCase();
  if (arena === "self") return "personal";
  if (arena === "relationships") return "relationships";
  if (arena === "business") return "business";
  return "personal";
}

function clampScore(score: number | undefined) {
  return Math.max(0, Math.min(10, typeof score === "number" ? score : 0));
}

function roundedRings(score: number | undefined) {
  return Math.max(0, Math.min(10, Math.round(clampScore(score))));
}

function getWheelTransform(metricKey: MetricKey, scale: number) {
  if (metricKey === "overall") return { scale, rotate: 0 };
  if (metricKey.startsWith("domain:")) {
    const code = metricKey.slice(7);
    const index = ORDER.indexOf(code as (typeof ORDER)[number]);
    if (index < 0) return { scale, rotate: 0 };
    const segmentCenterAngle = -75 + 30 * index;
    return { scale, rotate: -90 - segmentCenterAngle };
  }
  if (metricKey.startsWith("arena:")) {
    const arena = metricKey.slice(6);
    const centerAngles: Record<string, number> = {
      personal: -30,
      relationships: 90,
      business: 210,
    };
    return {
      scale,
      rotate: centerAngles[arena] != null ? -90 - centerAngles[arena] : 0,
    };
  }
  return { scale, rotate: 0 };
}

function getSegmentOpacity(metricKey: MetricKey, code: string) {
  if (metricKey === "overall") return 1;
  if (metricKey.startsWith("domain:")) {
    return metricKey.slice(7) === code ? 1 : 0.1;
  }
  if (metricKey.startsWith("arena:")) {
    const arena = metricKey.slice(6);
    const domain = DOMAINS.find((entry) => entry.code === code);
    return normalizeArenaKey(domain?.arena) === arena ? 1 : 0.1;
  }
  return 1;
}

function cellPath(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0Rad: number,
  a1Rad: number
) {
  const x1 = cx + r1 * Math.cos(a0Rad);
  const y1 = cy + r1 * Math.sin(a0Rad);
  const x2 = cx + r1 * Math.cos(a1Rad);
  const y2 = cy + r1 * Math.sin(a1Rad);
  const x3 = cx + r0 * Math.cos(a1Rad);
  const y3 = cy + r0 * Math.sin(a1Rad);
  const x4 = cx + r0 * Math.cos(a0Rad);
  const y4 = cy + r0 * Math.sin(a0Rad);
  return `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r1},${r1} 0 0 1 ${x2.toFixed(2)},${y2.toFixed(2)} L${x3.toFixed(2)},${y3.toFixed(2)} A${r0},${r0} 0 0 0 ${x4.toFixed(2)},${y4.toFixed(2)} Z`;
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = (startDeg * Math.PI) / 180;
  const end = (endDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  return `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 0 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
}

function WheelSvg({
  domainScores,
  metricKey,
  onMetricSelect,
  interactive,
}: {
  domainScores: Record<string, number>;
  metricKey: MetricKey;
  onMetricSelect?: (metricKey: MetricKey) => void;
  interactive: boolean;
}) {
  const cx = 160;
  const cy = 160;
  const r = 120;
  const labelRadius = r + 14;
  const rInner = r * 0.42;
  const segmentAngle = 360 / 12;
  const isDomainFocus = metricKey.startsWith("domain:");
  const domainLabelOpacity = metricKey === "overall" ? 1 : 0;

  return (
    <svg
      viewBox="0 0 320 320"
      className="w-full h-full overflow-visible"
      style={{ maxWidth: 280 }}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      role="img"
      aria-label="Alignment wheel"
    >
      <defs>
        <path id="wheelArcPersonal" d={arcPath(cx, cy, rInner, -90, 30)} />
        <path id="wheelArcRelationships" d={arcPath(cx, cy, rInner, 30, 150)} />
        <path id="wheelArcBusiness" d={arcPath(cx, cy, rInner, 150, 270)} />
        <filter id="wheelArenaLabelShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.4" floodColor="rgba(0,0,0,0.5)" floodOpacity="1" />
        </filter>
        <filter id="wheelArenaLabelHalo" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="rgba(255,255,255,0.95)" floodOpacity="1" />
        </filter>
      </defs>

      {ORDER.map((code, index) => {
        const domain = DOMAINS.find((entry) => entry.code === code);
        const arena = normalizeArenaKey(domain?.arena);
        const dark = ARENA_DARK[arena];
        const light = ARENA_LIGHT[arena];
        const score = roundedRings(domainScores[code]);
        const a0Rad = ((index * segmentAngle - 90) * Math.PI) / 180;
        const a1Rad = (((index + 1) * segmentAngle - 90) * Math.PI) / 180;
        const opacity = interactive ? getSegmentOpacity(metricKey, code) : 1;

        return (
          <g key={code} style={{ opacity, transition: "opacity 350ms ease-out" }}>
            {Array.from({ length: 10 }, (_, ringIndex) => {
              const ring = ringIndex + 1;
              const r0 = r * (ringIndex / 10);
              const r1 = r * (ring / 10);
              return (
                <path
                  key={ring}
                  className={interactive ? "wheel-segment" : undefined}
                  d={cellPath(cx, cy, r0, r1, a0Rad, a1Rad)}
                  fill={ring <= score ? dark : light}
                  fillOpacity="0.78"
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth="0.3"
                  onClick={
                    interactive && onMetricSelect
                      ? () => onMetricSelect(`domain:${code}`)
                      : undefined
                  }
                  style={interactive && onMetricSelect ? { cursor: "pointer" } : undefined}
                />
              );
            })}
          </g>
        );
      })}

      {Array.from({ length: 10 }, (_, index) => (
        <circle
          key={`ring-${index}`}
          cx={cx}
          cy={cy}
          r={r * ((index + 1) / 10)}
          fill="none"
          stroke="#d1d5db"
          strokeWidth="0.5"
        />
      ))}

      {ORDER.map((_, index) => {
        const a0 = ((index * segmentAngle - 90) * Math.PI) / 180;
        return (
          <line
            key={`divider-${index}`}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(a0)}
            y2={cy + r * Math.sin(a0)}
            stroke="#d1d5db"
            strokeWidth="0.5"
          />
        );
      })}

      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#374151" strokeWidth="0.25" />

      {ORDER.map((code, index) => {
        const midDeg = index * segmentAngle - 90 + segmentAngle / 2;
        const midRad = (midDeg * Math.PI) / 180;
        const tx = cx + labelRadius * Math.cos(midRad);
        const ty = cy + labelRadius * Math.sin(midRad);
        const lines = DOMAIN_LABELS[code] || [code];
        const lineHeight = 10;
        const firstDy = lines.length > 1 ? -0.5 * (lines.length - 1) * lineHeight : 0;
        let anchor: "start" | "middle" | "end" = "end";
        if (midDeg >= -90 && midDeg < 90) anchor = "start";
        if (Math.abs(midDeg) < 10 || Math.abs(midDeg - 180) < 10) anchor = "middle";

        return (
          <text
            key={`label-${code}`}
            className="wheel-domain-label"
            x={tx.toFixed(2)}
            y={ty.toFixed(2)}
            fontSize="10"
            fill="hsl(var(--accent))"
            fontFamily="Cormorant Garamond,serif"
            fontWeight="800"
            textAnchor={anchor}
            dominantBaseline="middle"
            style={{
              opacity: domainLabelOpacity,
              transition: "opacity 400ms ease-out",
              cursor: interactive && onMetricSelect ? "pointer" : "default",
            }}
            onClick={
              interactive && onMetricSelect ? () => onMetricSelect(`domain:${code}`) : undefined
            }
          >
            {lines.map((line, lineIndex) => (
              <tspan
                key={`${code}-${lineIndex}`}
                x={tx.toFixed(2)}
                dy={lineIndex === 0 ? `${firstDy}px` : `${lineHeight}px`}
              >
                {line}
              </tspan>
            ))}
          </text>
        );
      })}

      {[
        ["personal", "#wheelArcPersonal", "Personal"],
        ["relationships", "#wheelArcRelationships", "Relationships"],
        ["business", "#wheelArcBusiness", "Business"],
      ].map(([arena, href, label]) => (
        <text
          key={arena}
          className="wheel-arena-label"
          fontSize="11"
          fill={isDomainFocus ? "#111827" : "#f7f2e8"}
          fontFamily="Cormorant Garamond,serif"
          fontWeight="700"
          filter={isDomainFocus ? "url(#wheelArenaLabelHalo)" : "url(#wheelArenaLabelShadow)"}
          style={{
            cursor: interactive && onMetricSelect ? "pointer" : "default",
            transition: "fill 200ms ease-out",
          }}
          onClick={
            interactive && onMetricSelect ? () => onMetricSelect(`arena:${arena}`) : undefined
          }
        >
          <textPath xlinkHref={href} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
      ))}

      {interactive &&
        ORDER.map((code, index) => {
          const a0Rad = ((index * segmentAngle - 90) * Math.PI) / 180;
          const a1Rad = (((index + 1) * segmentAngle - 90) * Math.PI) / 180;
          return (
            <path
              key={`hit-${code}`}
              d={cellPath(cx, cy, 0, r, a0Rad, a1Rad)}
              fill="transparent"
              stroke="none"
              pointerEvents="all"
              style={{ cursor: onMetricSelect ? "pointer" : "default" }}
              onClick={onMetricSelect ? () => onMetricSelect(`domain:${code}`) : undefined}
            />
          );
        })}
    </svg>
  );
}

function OverlayLabels({ rotate }: { rotate: number }) {
  const cx = 165;
  const cy = 165;
  const wheelR = 140;
  const anchorR = wheelR + 9;
  const lineHeight = 10;
  const halfFont = 5;

  return (
    <svg viewBox="0 0 330 330" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
      {ORDER.map((code, index) => {
        const angle = ((-75 + 30 * index + rotate) % 360 + 360) % 360;
        const rad = (angle * Math.PI) / 180;
        const ax = cx + anchorR * Math.cos(rad);
        const ay = cy + anchorR * Math.sin(rad);
        const lines = DOMAIN_LABELS[code] || [code];
        const blockHeight = (lines.length - 1) * lineHeight;
        let anchor: "start" | "middle" | "end" = "middle";
        if (angle > 315 || angle <= 45) anchor = "start";
        else if (angle > 135 && angle <= 225) anchor = "end";
        let firstLineY = ay - blockHeight / 2;
        if (angle > 45 && angle <= 135) firstLineY = ay + halfFont;
        else if (angle > 225 && angle <= 315) firstLineY = ay - blockHeight - halfFont;

        return (
          <text
            key={`overlay-${code}`}
            x={ax.toFixed(2)}
            y={firstLineY.toFixed(2)}
            fontSize="10"
            fill="hsl(var(--accent))"
            fontFamily="Cormorant Garamond,serif"
            fontWeight="800"
            textAnchor={anchor}
            dominantBaseline="middle"
          >
            {lines.map((line, lineIndex) => (
              <tspan
                key={`${code}-overlay-${lineIndex}`}
                x={ax.toFixed(2)}
                dy={lineIndex === 0 ? "0" : `${lineHeight}px`}
              >
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}

export function VapiOverviewWheel({ domainScores }: OverviewProps) {
  return (
    <div className="flex items-center justify-center w-full min-w-[200px] max-w-[320px] mx-auto overflow-visible">
      <WheelSvg domainScores={domainScores} metricKey="overall" interactive={false} />
    </div>
  );
}

export function VapiBreakdownWheel({
  domainScores,
  metricKey = "overall",
  onMetricSelect,
}: BreakdownProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const transform = getWheelTransform(metricKey, isMobile ? 1.18 : 1.22);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 640);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (metricKey === "overall") {
      setShowOverlay(false);
      return;
    }
    setShowOverlay(false);
    const timeout = window.setTimeout(() => setShowOverlay(true), 660);
    return () => window.clearTimeout(timeout);
  }, [metricKey]);

  return (
    <div className="relative w-full max-w-[330px] mx-auto overflow-visible" style={{ aspectRatio: "1 / 1" }}>
      <div className="absolute inset-[25px] flex items-center justify-center overflow-visible rounded-full">
        <div
          className="w-full h-full flex items-center justify-center transition-transform ease-out"
          style={{ transform: `scale(${transform.scale}) rotate(${transform.rotate}deg)`, transitionDuration: "650ms" }}
        >
          <WheelSvg
            domainScores={domainScores}
            metricKey={metricKey}
            onMetricSelect={onMetricSelect}
            interactive
          />
        </div>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 z-10"
        aria-hidden={metricKey === "overall" || !showOverlay}
        style={{ opacity: metricKey !== "overall" && showOverlay ? 1 : 0 }}
      >
        <OverlayLabels rotate={transform.rotate} />
      </div>
    </div>
  );
}

function ComparativeSvg({
  previousDomainScores,
  currentDomainScores,
  metricKey,
  onMetricSelect,
}: {
  previousDomainScores: Record<string, number>;
  currentDomainScores: Record<string, number>;
  metricKey: MetricKey;
  onMetricSelect?: (metricKey: MetricKey) => void;
}) {
  const cx = 160;
  const cy = 160;
  const r = 120;
  const labelRadius = r + 14;
  const rInner = r * 0.42;
  const segmentAngle = 360 / 12;
  const changeThreshold = 0.5;
  const transformOpacityFor = (code: string) => getSegmentOpacity(metricKey, code);
  const isDomainFocus = metricKey.startsWith("domain:");

  return (
    <svg
      viewBox="0 0 320 320"
      className="w-full h-full overflow-visible"
      style={{ maxWidth: 280 }}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      role="img"
      aria-label="Comparative alignment wheel"
    >
      <defs>
        <path id="progressArcPersonal" d={arcPath(cx, cy, rInner, -90, 30)} />
        <path id="progressArcRelationships" d={arcPath(cx, cy, rInner, 30, 150)} />
        <path id="progressArcBusiness" d={arcPath(cx, cy, rInner, 150, 270)} />
        <filter id="progressArenaLabelShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.4" floodColor="rgba(0,0,0,0.5)" floodOpacity="1" />
        </filter>
        {ORDER.map((code, index) => {
          const midDeg = -75 + 30 * index;
          const midRad = (midDeg * Math.PI) / 180;
          const gx2 = cx + r * Math.cos(midRad);
          const gy2 = cy + r * Math.sin(midRad);
          return (
            <g key={code}>
              <linearGradient id={`progImp-${code}`} x1={cx} y1={cy} x2={gx2} y2={gy2} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#86efac" />
                <stop offset="1" stopColor="#15803d" />
              </linearGradient>
              <linearGradient id={`progDec-${code}`} x1={cx} y1={cy} x2={gx2} y2={gy2} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#b91c1c" />
                <stop offset="1" stopColor="#fca5a5" />
              </linearGradient>
            </g>
          );
        })}
      </defs>

      {ORDER.map((code, index) => {
        const prevRings = roundedRings(previousDomainScores[code]);
        const a0Rad = ((index * segmentAngle - 90) * Math.PI) / 180;
        const a1Rad = (((index + 1) * segmentAngle - 90) * Math.PI) / 180;
        const opacity = transformOpacityFor(code);
        return (
          <g key={`prev-${code}`} style={{ opacity, transition: "opacity 350ms ease-out" }}>
            {Array.from({ length: prevRings }, (_, ringIndex) => {
              const ring = ringIndex + 1;
              const r0 = r * (ringIndex / 10);
              const r1 = r * (ring / 10);
              return (
                <path
                  key={ring}
                  d={cellPath(cx, cy, r0, r1, a0Rad, a1Rad)}
                  fill="#9ca3af"
                  fillOpacity="0.35"
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth="0.3"
                />
              );
            })}
          </g>
        );
      })}

      {ORDER.map((code, index) => {
        const prevScore = clampScore(previousDomainScores[code]);
        const currScore = clampScore(currentDomainScores[code]);
        const prevRings = roundedRings(previousDomainScores[code]);
        const currRings = roundedRings(currentDomainScores[code]);
        const diff = currScore - prevScore;
        const a0Rad = ((index * segmentAngle - 90) * Math.PI) / 180;
        const a1Rad = (((index + 1) * segmentAngle - 90) * Math.PI) / 180;
        const opacity = transformOpacityFor(code);

        return (
          <g key={`curr-${code}`} style={{ opacity, transition: "opacity 350ms ease-out" }}>
            {Array.from({ length: 10 }, (_, ringIndex) => {
              const ring = ringIndex + 1;
              const r0 = r * (ringIndex / 10);
              const r1 = r * (ring / 10);
              let fill = "#ffffff";
              if (diff >= changeThreshold) {
                fill = ring <= currRings ? `url(#progImp-${code})` : "#ffffff";
              } else if (diff <= -changeThreshold) {
                fill = ring <= prevRings ? `url(#progDec-${code})` : "#ffffff";
              } else {
                fill = ring <= currRings ? "#9ca3af" : "#ffffff";
              }

              return (
                <path
                  key={ring}
                  className="progress-wheel-segment"
                  d={cellPath(cx, cy, r0, r1, a0Rad, a1Rad)}
                  fill={fill}
                  fillOpacity="0.9"
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth="0.3"
                  onClick={onMetricSelect ? () => onMetricSelect(`domain:${code}`) : undefined}
                  style={onMetricSelect ? { cursor: "pointer" } : undefined}
                />
              );
            })}
          </g>
        );
      })}

      {Array.from({ length: 10 }, (_, index) => (
        <circle
          key={`progress-ring-${index}`}
          cx={cx}
          cy={cy}
          r={r * ((index + 1) / 10)}
          fill="none"
          stroke="#d1d5db"
          strokeWidth="0.5"
        />
      ))}

      {ORDER.map((_, index) => {
        const a0 = ((index * segmentAngle - 90) * Math.PI) / 180;
        return (
          <line
            key={`progress-divider-${index}`}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(a0)}
            y2={cy + r * Math.sin(a0)}
            stroke="#d1d5db"
            strokeWidth="0.5"
          />
        );
      })}

      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#374151" strokeWidth="0.25" />

      {ORDER.map((code, index) => {
        const midDeg = index * segmentAngle - 90 + segmentAngle / 2;
        const midRad = (midDeg * Math.PI) / 180;
        const tx = cx + labelRadius * Math.cos(midRad);
        const ty = cy + labelRadius * Math.sin(midRad);
        const lines = DOMAIN_LABELS[code] || [code];
        const lineHeight = 10;
        const firstDy = lines.length > 1 ? -0.5 * (lines.length - 1) * lineHeight : 0;
        let anchor: "start" | "middle" | "end" = "end";
        if (midDeg >= -90 && midDeg < 90) anchor = "start";
        if (Math.abs(midDeg) < 10 || Math.abs(midDeg - 180) < 10) anchor = "middle";

        return (
          <text
            key={`progress-label-${code}`}
            className="wheel-domain-label"
            x={tx.toFixed(2)}
            y={ty.toFixed(2)}
            fontSize="10"
            fill="hsl(var(--accent))"
            fontFamily="Cormorant Garamond,serif"
            fontWeight="800"
            textAnchor={anchor}
            dominantBaseline="middle"
            style={{
              opacity: metricKey === "overall" ? 1 : 0,
              transition: "opacity 400ms ease-out",
            }}
          >
            {lines.map((line, lineIndex) => (
              <tspan
                key={`${code}-progress-line-${lineIndex}`}
                x={tx.toFixed(2)}
                dy={lineIndex === 0 ? `${firstDy}px` : `${lineHeight}px`}
              >
                {line}
              </tspan>
            ))}
          </text>
        );
      })}

      {[
        ["personal", "#progressArcPersonal", "Personal"],
        ["relationships", "#progressArcRelationships", "Relationships"],
        ["business", "#progressArcBusiness", "Business"],
      ].map(([arena, href, label]) => (
        <text
          key={arena}
          className="wheel-arena-label"
          fontSize="11"
          fill={isDomainFocus ? "#111827" : "#f7f2e8"}
          fontFamily="Cormorant Garamond,serif"
          fontWeight="700"
          filter="url(#progressArenaLabelShadow)"
          onClick={onMetricSelect ? () => onMetricSelect(`arena:${arena}`) : undefined}
          style={onMetricSelect ? { cursor: "pointer" } : undefined}
        >
          <textPath xlinkHref={href} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
      ))}

      {ORDER.map((code, index) => {
        const a0Rad = ((index * segmentAngle - 90) * Math.PI) / 180;
        const a1Rad = (((index + 1) * segmentAngle - 90) * Math.PI) / 180;
        return (
          <path
            key={`progress-hit-${code}`}
            d={cellPath(cx, cy, 0, r, a0Rad, a1Rad)}
            fill="transparent"
            stroke="none"
            pointerEvents="all"
            style={{ cursor: onMetricSelect ? "pointer" : "default" }}
            onClick={onMetricSelect ? () => onMetricSelect(`domain:${code}`) : undefined}
          />
        );
      })}
    </svg>
  );
}

export function VapiComparativeWheel({
  previousDomainScores,
  currentDomainScores,
  metricKey = "overall",
  onMetricSelect,
}: ComparativeProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const transform = getWheelTransform(metricKey, isMobile ? 1.18 : 1.22);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 640);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (metricKey === "overall") {
      setShowOverlay(false);
      return;
    }
    setShowOverlay(false);
    const timeout = window.setTimeout(() => setShowOverlay(true), 660);
    return () => window.clearTimeout(timeout);
  }, [metricKey]);

  return (
    <div className="relative w-full max-w-[330px] mx-auto overflow-visible" style={{ aspectRatio: "1 / 1" }}>
      <div className="absolute inset-[25px] flex items-center justify-center overflow-visible rounded-full">
        <div
          className="w-full h-full flex items-center justify-center transition-transform ease-out"
          style={{ transform: `scale(${transform.scale}) rotate(${transform.rotate}deg)`, transitionDuration: "650ms" }}
        >
          <ComparativeSvg
            previousDomainScores={previousDomainScores}
            currentDomainScores={currentDomainScores}
            metricKey={metricKey}
            onMetricSelect={onMetricSelect}
          />
        </div>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 z-10"
        aria-hidden={metricKey === "overall" || !showOverlay}
        style={{ opacity: metricKey !== "overall" && showOverlay ? 1 : 0 }}
      >
        <OverlayLabels rotate={transform.rotate} />
      </div>
    </div>
  );
}
