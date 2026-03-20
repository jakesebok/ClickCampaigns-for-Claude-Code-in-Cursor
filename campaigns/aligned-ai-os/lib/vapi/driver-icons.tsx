import type { SVGProps } from "react";
import {
  ALIGNED_MOMENTUM_NAME,
  type VapiAssignedDriverName,
} from "./drivers";

export const DRIVER_ACCENT_COLORS: Record<VapiAssignedDriverName, string> = {
  [ALIGNED_MOMENTUM_NAME]: "#B8960C",
  "The Achiever's Trap": "#C07B28",
  "The Protector": "#4A6FA5",
  "The Pleaser's Bind": "#C27083",
  "The Escape Artist": "#2E8B7A",
  "The Perfectionist's Prison": "#6B7B8D",
  "The Imposter Loop": "#8B6BAE",
  "The Martyr Complex": "#A0522D",
  "The Fog": "#9B9586",
  "The Builder's Gap": "#B87333",
};

function getDriverIconPaths(driver: VapiAssignedDriverName) {
  switch (driver) {
    case ALIGNED_MOMENTUM_NAME:
      return (
        <>
          <circle cx="32" cy="32" r="8" />
          <circle cx="32" cy="32" r="16" />
          <circle cx="32" cy="32" r="24" />
          <path d="M32 50V15" />
          <path d="M26 21l6-7l6 7" />
        </>
      );
    case "The Achiever's Trap":
      return (
        <>
          <path d="M22 14h20v8c0 9.5-6.1 15.1-10 17.1c-3.9-2-10-7.6-10-17.1z" />
          <path d="M22 18h-4c-3.3 0-6 2.7-6 6s2.7 6 6 6h4" />
          <path d="M42 18h4c3.3 0 6 2.7 6 6s-2.7 6-6 6h-4" />
          <path d="M32 31v9" />
          <path d="M24 50h16" />
          <path d="M28 44h8v6h-8z" />
          <path d="M33 15l2 8l-4 5l5 7l-4 7" />
        </>
      );
    case "The Protector":
      return (
        <>
          <path d="M32 10c8.2 0 14.7 2.3 18 3.9v13.6c0 11.7-7 21.5-18 26.5c-11-5-18-14.8-18-26.5V13.9C17.3 12.3 23.8 10 32 10z" />
          <circle cx="32" cy="27" r="4.5" />
          <path d="M32 31.5v9" />
        </>
      );
    case "The Pleaser's Bind":
      return (
        <>
          <path d="M23 39c2.7 2 5.8 3 9 3" />
          <path d="M41 39c-2.7 2-5.8 3-9 3" />
          <path d="M20 24v16c0 2.8 2.2 5 5 5h2V31" />
          <path d="M27 31V19" />
          <path d="M31 30V17" />
          <path d="M36 31V19" />
          <path d="M40 31v14h2c2.8 0 5-2.2 5-5V24" />
          <path d="M18 10l2 10" />
          <path d="M25 9l1 10" />
          <path d="M46 10l-2 10" />
          <path d="M39 9l-1 10" />
        </>
      );
    case "The Escape Artist":
      return (
        <>
          <path d="M16 14h24v36H16z" />
          <path d="M40 16l8 6v20l-8 6z" />
          <circle cx="31" cy="25" r="3" />
          <path d="M31 28l-3 7l7 5" />
          <path d="M28 35l-6 4" />
          <path d="M30 35l3 9" />
          <path d="M35 33l6 4" />
        </>
      );
    case "The Perfectionist's Prison":
      return (
        <>
          <path d="M20 18h24" />
          <path d="M22 18c0-5.5 4.5-10 10-10s10 4.5 10 10" />
          <path d="M20 18v26" />
          <path d="M28 18v26" />
          <path d="M36 18v26" />
          <path d="M44 18v26" />
          <path d="M20 44h24" />
          <path d="M44 27h8v12" />
          <path d="M52 39l-8-4" />
          <path d="M28 37c2-3 6-3 8 0c1.5 2.2 4 2.7 6 1" />
          <path d="M31 33h4" />
        </>
      );
    case "The Imposter Loop":
      return (
        <>
          <path d="M18 14c4-4 24-4 28 0c3 3 3 23 0 26c-4 4-24 4-28 0c-3-3-3-23 0-26z" />
          <path d="M28 42v8" />
          <path d="M36 42v8" />
          <path d="M24 50h16" />
          <path d="M27 23c1.8-2 7.2-2 9 0" />
          <path d="M29 29c1 1.5 5 1.5 6 0" />
          <path d="M25 34c2.5 3 11.5 2 14-2" />
          <path d="M38 24c-1.5 1.2-1.7 8.5 1 11.5" />
        </>
      );
    case "The Martyr Complex":
      return (
        <>
          <path d="M14 28h36" />
          <path d="M18 24h28c2.2 0 4 1.8 4 4s-1.8 4-4 4H18c-2.2 0-4-1.8-4-4s1.8-4 4-4z" />
          <path d="M26 24c-1.6 2.2-1.6 5.8 0 8" />
          <path d="M38 24c-1.6 2.2-1.6 5.8 0 8" />
          <path d="M11 20c2.6 1.4 3.6 4.5 2.7 7.2c2.4-.8 5.1.3 6.2 2.6" />
          <path d="M53 20c-2.6 1.4-3.6 4.5-2.7 7.2c-2.4-.8-5.1.3-6.2 2.6" />
        </>
      );
    case "The Fog":
      return (
        <>
          <circle cx="32" cy="32" r="18" />
          <path d="M32 8l4 10l-4 4l-4-4z" />
          <path d="M32 56l4-10l-4-4l-4 4z" />
          <path d="M56 32l-10 4l-4-4l4-4z" />
          <path d="M8 32l10 4l4-4l-4-4z" />
          <path d="M44.7 19.3l2.3 5.7" />
          <path d="M19.3 19.3l-2.3 5.7" />
          <path d="M44.7 44.7l2.3-5.7" />
          <path d="M19.3 44.7l-2.3-5.7" />
        </>
      );
    case "The Builder's Gap":
      return (
        <>
          <path d="M12 44h40" />
          <path d="M18 44V28" />
          <path d="M30 44V22" />
          <path d="M42 44V31" />
          <path d="M30 22V14" strokeDasharray="3 4" />
        </>
      );
  }
}

type DriverIconProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  driver: VapiAssignedDriverName;
  size?: number;
};

export function DriverIcon({
  driver,
  size = 64,
  style,
  ...props
}: DriverIconProps) {
  const color = DRIVER_ACCENT_COLORS[driver];

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={`${driver} icon`}
      style={{ color, ...style }}
      {...props}
    >
      <title>{driver}</title>
      {getDriverIconPaths(driver)}
    </svg>
  );
}
