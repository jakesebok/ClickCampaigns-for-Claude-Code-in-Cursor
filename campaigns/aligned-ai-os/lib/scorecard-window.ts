/**
 * 6Cs Scorecard availability window: Friday 12:00pm – Sunday 6:00pm (America/New_York).
 * Ported from portal six-c-window.js for app parity.
 */

const TZ = "America/New_York";

type EasternParts = {
  dayOfWeek: number;
  hour: number;
  minute: number;
  day: number;
  month: number;
  year: number;
};

function toEastern(date: Date): EasternParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const o: Record<string, string> = {};
  parts.forEach((p) => {
    o[p.type] = p.value;
  });
  const dayNames: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };
  return {
    dayOfWeek: dayNames[o.weekday] ?? 0,
    hour: parseInt(o.hour ?? "0", 10) || 0,
    minute: parseInt(o.minute ?? "0", 10) || 0,
    day: parseInt(o.day ?? "1", 10) || 1,
    month: parseInt(o.month ?? "1", 10) || 1,
    year: parseInt(o.year ?? "2025", 10) || 2025,
  };
}

function getEasternOffsetMinutes(date: Date): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    timeZoneName: "shortOffset",
  });
  const tzName = fmt
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = tzName?.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  const hours = parseInt(match[2] ?? "0", 10) || 0;
  const minutes = parseInt(match[3] ?? "0", 10) || 0;
  return sign * (hours * 60 + minutes);
}

function easternLocalToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  let utcMs = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  for (let i = 0; i < 2; i += 1) {
    const offsetMinutes = getEasternOffsetMinutes(new Date(utcMs));
    utcMs = Date.UTC(year, month - 1, day, hour, minute, 0, 0) - offsetMinutes * 60 * 1000;
  }
  return new Date(utcMs);
}

function shiftEasternDate(
  e: EasternParts,
  days: number,
  hour: number,
  minute: number
): Date {
  const normalized = new Date(
    Date.UTC(e.year, e.month - 1, e.day + days, hour, minute, 0, 0)
  );
  return easternLocalToUtc(
    normalized.getUTCFullYear(),
    normalized.getUTCMonth() + 1,
    normalized.getUTCDate(),
    normalized.getUTCHours(),
    normalized.getUTCMinutes()
  );
}

export type ScorecardWindowStatus = "before" | "open" | "closed";

export type ScorecardWindow = {
  status: ScorecardWindowStatus;
  canSubmit: boolean;
  message: string;
  countdownMessage: string;
  opensAt: Date;
  closesAt: Date;
  nextOpen: Date;
  daysUntil: number;
  hoursLeft: number;
  minutesLeft: number;
  nextOpenLabel: string;
  closesAtLabel: string;
};

export type ScorecardWindowBounds = {
  opensAt: Date;
  closesAt: Date;
};

export function getScorecardWindow(): ScorecardWindow {
  const now = new Date();
  const e = toEastern(now);
  const inWindow =
    (e.dayOfWeek === 5 && e.hour >= 12) ||
    e.dayOfWeek === 6 ||
    (e.dayOfWeek === 0 && e.hour < 18);
  const isClosedAfterWindow = e.dayOfWeek === 0 && e.hour >= 18;
  let daysToFriday = (5 - e.dayOfWeek + 7) % 7;
  if (e.dayOfWeek === 5 && e.hour >= 12) daysToFriday += 7;
  const fridayNoon = shiftEasternDate(e, daysToFriday, 12, 0);
  const opensAt = inWindow
    ? shiftEasternDate(e, e.dayOfWeek === 5 ? 0 : e.dayOfWeek === 6 ? -1 : -2, 12, 0)
    : fridayNoon;
  const closesAt = inWindow
    ? shiftEasternDate(e, e.dayOfWeek === 5 ? 2 : e.dayOfWeek === 6 ? 1 : 0, 18, 0)
    : shiftEasternDate(e, daysToFriday + 2, 18, 0);
  const status: ScorecardWindowStatus = inWindow
    ? "open"
    : isClosedAfterWindow
      ? "closed"
      : now < fridayNoon
      ? "before"
      : "closed";

  let message = "";
  let countdownMessage = "";
  let daysUntil = 0;
  let hoursLeft = 0;
  let minutesLeft = 0;

  if (status === "before") {
    const ms = fridayNoon.getTime() - now.getTime();
    daysUntil = Math.floor(ms / (24 * 60 * 60 * 1000));
    if (daysUntil > 1)
      message = `Your next scorecard opens in ${daysUntil} days (Friday 12pm).`;
    else if (daysUntil === 1)
      message =
        "Your next scorecard opens in about 24 hours (Friday 12pm).";
    else
      message =
        "Your next scorecard opens in less than 24 hours (Friday 12pm).";
  } else if (status === "open") {
    message =
      "Your scorecard is available now. Fill it out before Sunday 6pm.";
    const msLeft = closesAt.getTime() - now.getTime();
    if (msLeft <= 0) {
      countdownMessage = "Time's up for this week.";
    } else {
      hoursLeft = Math.floor(msLeft / (60 * 60 * 1000));
      minutesLeft = Math.floor(
        (msLeft % (60 * 60 * 1000)) / (60 * 1000)
      );
      if (hoursLeft > 0)
        countdownMessage = `You have ${hoursLeft}h ${minutesLeft}m left to fill out your scorecard for the week.`;
      else countdownMessage = `You have ${minutesLeft} minutes left.`;
    }
  } else {
    message =
      "Your scorecard window has closed. Your next scorecard will be available Friday at 12pm.";
  }

  return {
    status,
    canSubmit: status === "open",
    message,
    countdownMessage,
    opensAt,
    closesAt,
    nextOpen: fridayNoon,
    daysUntil,
    hoursLeft,
    minutesLeft,
    nextOpenLabel: "Friday at 12pm",
    closesAtLabel: "Sunday at 6pm",
  };
}

export function getMostRecentScorecardWindow(
  win: ScorecardWindow = getScorecardWindow()
): ScorecardWindowBounds {
  if (win.status === "open") {
    return { opensAt: win.opensAt, closesAt: win.closesAt };
  }
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  return {
    opensAt: new Date(win.opensAt.getTime() - weekMs),
    closesAt: new Date(win.closesAt.getTime() - weekMs),
  };
}

export function isDateInScorecardWindow(
  date: Date | string,
  bounds: ScorecardWindowBounds
): boolean {
  const ts = new Date(date).getTime();
  return ts >= bounds.opensAt.getTime() && ts <= bounds.closesAt.getTime();
}

export function getEasternWeekKey(date: Date | string): string {
  const eastern = toEastern(new Date(date));
  const normalized = new Date(
    Date.UTC(eastern.year, eastern.month - 1, eastern.day, 12, 0, 0, 0)
  );
  const mondayOffset = eastern.dayOfWeek === 0 ? -6 : 1 - eastern.dayOfWeek;
  normalized.setUTCDate(normalized.getUTCDate() + mondayOffset);
  return `${normalized.getUTCFullYear()}-${String(
    normalized.getUTCMonth() + 1
  ).padStart(2, "0")}-${String(normalized.getUTCDate()).padStart(2, "0")}`;
}

export function isSameEasternCalendarWeek(
  left: Date | string,
  right: Date | string = new Date()
): boolean {
  return getEasternWeekKey(left) === getEasternWeekKey(right);
}

export function formatScorecardCountdown(win: ScorecardWindow): string {
  if (win.status !== "open" || !win.closesAt) return "";
  const now = new Date();
  const ms = win.closesAt.getTime() - now.getTime();
  if (ms <= 0) return "0h 0m";
  const h = Math.floor(ms / (60 * 60 * 1000));
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${h}h ${m}m`;
}
