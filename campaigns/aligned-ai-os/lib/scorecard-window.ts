/**
 * 6Cs Scorecard availability window: Friday 12:00pm – Sunday 6:00pm (America/New_York).
 * Ported from portal six-c-window.js for app parity.
 */

const TZ = "America/New_York";

function getEasternOffsetHours(month: number): number {
  return month >= 4 && month <= 10 ? 4 : 5;
}

function toEastern(date: Date): {
  dayOfWeek: number;
  hour: number;
  minute: number;
  day: number;
  month: number;
  year: number;
} {
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

function easternToUTC(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): number {
  const offset = getEasternOffsetHours(month);
  return Date.UTC(year, month - 1, day, hour + offset, minute || 0);
}

function getThisWeekFridayNoon(e: ReturnType<typeof toEastern>): Date {
  let daysToFriday = (5 - e.dayOfWeek + 7) % 7;
  if (e.dayOfWeek === 5 && e.hour >= 12) daysToFriday += 7;
  if (e.dayOfWeek === 6) daysToFriday += 7;
  if (e.dayOfWeek === 0 && e.hour >= 18) daysToFriday += 7;
  const fd = e.day + daysToFriday;
  return new Date(easternToUTC(e.year, e.month, fd, 12, 0));
}

function getThisWeekSunday6pm(e: ReturnType<typeof toEastern>): Date {
  let daysToSunday = (0 - e.dayOfWeek + 7) % 7;
  if (e.dayOfWeek === 0 && e.hour < 18) daysToSunday = 0;
  if (e.dayOfWeek === 5 && e.hour >= 12) daysToSunday = 2;
  if (e.dayOfWeek === 6) daysToSunday = 1;
  const sd = e.day + daysToSunday;
  return new Date(easternToUTC(e.year, e.month, sd, 18, 0));
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

export function getScorecardWindow(): ScorecardWindow {
  const now = new Date();
  const e = toEastern(now);
  const fridayNoon = getThisWeekFridayNoon(e);
  const sunday6pm = getThisWeekSunday6pm(e);
  const inWindow =
    (e.dayOfWeek === 5 && e.hour >= 12) ||
    e.dayOfWeek === 6 ||
    (e.dayOfWeek === 0 && e.hour < 18);
  const status: ScorecardWindowStatus = inWindow
    ? "open"
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
    const msLeft = sunday6pm.getTime() - now.getTime();
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

  let closesAt = sunday6pm;
  if (e.dayOfWeek === 0 && e.hour >= 18) {
    closesAt = new Date(sunday6pm.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  const opensAt = inWindow
    ? new Date(fridayNoon.getTime() - 7 * 24 * 60 * 60 * 1000)
    : fridayNoon;

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

export function formatScorecardCountdown(win: ScorecardWindow): string {
  if (win.status !== "open" || !win.closesAt) return "";
  const now = new Date();
  const ms = win.closesAt.getTime() - now.getTime();
  if (ms <= 0) return "0h 0m";
  const h = Math.floor(ms / (60 * 60 * 1000));
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${h}h ${m}m`;
}
