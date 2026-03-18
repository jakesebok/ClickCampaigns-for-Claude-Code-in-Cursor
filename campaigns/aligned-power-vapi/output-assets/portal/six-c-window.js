/**
 * 6C Scorecard availability window: Friday 12:00pm – Sunday 6:00pm (America/New_York).
 * Use getScorecardWindow() for status, messages, and countdown.
 */
(function() {
  var TZ = 'America/New_York';

  function toEastern(date) {
    var fmt = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false });
    var parts = fmt.formatToParts(date);
    var o = {};
    parts.forEach(function(p) { o[p.type] = p.value; });
    var dayNames = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
    o.dayOfWeek = dayNames[o.weekday] !== undefined ? dayNames[o.weekday] : 0;
    o.hour = parseInt(o.hour, 10) || 0;
    o.minute = parseInt(o.minute, 10) || 0;
    o.day = parseInt(o.day, 10) || 1;
    o.month = parseInt(o.month, 10) || 1;
    o.year = parseInt(o.year, 10) || 2025;
    return o;
  }

  function getEasternOffsetMinutes(date) {
    var fmt = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'shortOffset' });
    var parts = fmt.formatToParts(date);
    var tzName = '';
    parts.forEach(function(p) { if (p.type === 'timeZoneName') tzName = p.value; });
    var match = tzName && tzName.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
    if (!match) return 0;
    var sign = match[1] === '-' ? -1 : 1;
    var hours = parseInt(match[2] || '0', 10) || 0;
    var minutes = parseInt(match[3] || '0', 10) || 0;
    return sign * ((hours * 60) + minutes);
  }

  function easternLocalToUtc(year, month, day, hour, minute) {
    var utcMs = Date.UTC(year, month - 1, day, hour, minute || 0, 0, 0);
    for (var i = 0; i < 2; i += 1) {
      var offsetMinutes = getEasternOffsetMinutes(new Date(utcMs));
      utcMs = Date.UTC(year, month - 1, day, hour, minute || 0, 0, 0) - (offsetMinutes * 60 * 1000);
    }
    return new Date(utcMs);
  }

  function shiftEasternDate(easternNow, days, hour, minute) {
    var normalized = new Date(Date.UTC(easternNow.year, easternNow.month - 1, easternNow.day + days, hour, minute || 0, 0, 0));
    return easternLocalToUtc(
      normalized.getUTCFullYear(),
      normalized.getUTCMonth() + 1,
      normalized.getUTCDate(),
      normalized.getUTCHours(),
      normalized.getUTCMinutes()
    );
  }

  function getScorecardWindow() {
    var now = new Date();
    var e = toEastern(now);
    var inWindow = (e.dayOfWeek === 5 && e.hour >= 12) || (e.dayOfWeek === 6) || (e.dayOfWeek === 0 && e.hour < 18);
    var isClosedAfterWindow = e.dayOfWeek === 0 && e.hour >= 18;
    var daysToFriday = (5 - e.dayOfWeek + 7) % 7;
    if (e.dayOfWeek === 5 && e.hour >= 12) daysToFriday += 7;
    var fridayNoon = shiftEasternDate(e, daysToFriday, 12, 0);
    var opensAt = inWindow
      ? shiftEasternDate(e, e.dayOfWeek === 5 ? 0 : e.dayOfWeek === 6 ? -1 : -2, 12, 0)
      : fridayNoon;
    var closesAt = inWindow
      ? shiftEasternDate(e, e.dayOfWeek === 5 ? 2 : e.dayOfWeek === 6 ? 1 : 0, 18, 0)
      : shiftEasternDate(e, daysToFriday + 2, 18, 0);
    var status = inWindow ? 'open' : (isClosedAfterWindow ? 'closed' : (now < fridayNoon ? 'before' : 'closed'));
    var nextOpen = fridayNoon;

    var message = '';
    var countdownMessage = '';
    var daysUntil = 0;
    var hoursLeft = 0;
    var minutesLeft = 0;

    if (status === 'before') {
      var ms = fridayNoon - now;
      daysUntil = Math.floor(ms / (24 * 60 * 60 * 1000));
      if (daysUntil > 1) message = 'Your next scorecard opens in ' + daysUntil + ' days (Friday 12pm).';
      else if (daysUntil === 1) message = 'Your next scorecard opens in about 24 hours (Friday 12pm).';
      else message = 'Your next scorecard opens in less than 24 hours (Friday 12pm).';
    } else if (status === 'open') {
      message = 'Your scorecard is available now. Fill it out before Sunday 6pm.';
      var msLeft = closesAt - now;
      if (msLeft <= 0) countdownMessage = 'Time\'s up for this week.';
      else {
        hoursLeft = Math.floor(msLeft / (60 * 60 * 1000));
        minutesLeft = Math.floor((msLeft % (60 * 60 * 1000)) / (60 * 1000));
        if (hoursLeft > 0) countdownMessage = 'You have ' + hoursLeft + 'h ' + minutesLeft + 'm left to fill out your scorecard for the week.';
        else countdownMessage = 'You have ' + minutesLeft + ' minutes left.';
      }
    } else {
      message = 'Your scorecard window has closed. Your next scorecard will be available Friday at 12pm.';
    }

    return {
      status: status,
      canSubmit: status === 'open',
      message: message,
      countdownMessage: countdownMessage,
      opensAt: opensAt,
      closesAt: closesAt,
      nextOpen: nextOpen,
      daysUntil: daysUntil,
      hoursLeft: hoursLeft,
      minutesLeft: minutesLeft,
      nextOpenLabel: 'Friday at 12pm',
      closesAtLabel: 'Sunday at 6pm'
    };
  }

  function getMostRecentScorecardWindow(win) {
    var current = win || getScorecardWindow();
    if (current.status === 'open') {
      return { opensAt: current.opensAt, closesAt: current.closesAt };
    }
    var weekMs = 7 * 24 * 60 * 60 * 1000;
    return {
      opensAt: new Date(current.opensAt.getTime() - weekMs),
      closesAt: new Date(current.closesAt.getTime() - weekMs)
    };
  }

  function isDateInScorecardWindow(date, bounds) {
    var ts = new Date(date).getTime();
    return ts >= bounds.opensAt.getTime() && ts <= bounds.closesAt.getTime();
  }

  function getEasternWeekKey(date) {
    var eastern = toEastern(new Date(date));
    var normalized = new Date(Date.UTC(eastern.year, eastern.month - 1, eastern.day, 12, 0, 0, 0));
    var mondayOffset = eastern.dayOfWeek === 0 ? -6 : 1 - eastern.dayOfWeek;
    normalized.setUTCDate(normalized.getUTCDate() + mondayOffset);
    var month = String(normalized.getUTCMonth() + 1).padStart(2, '0');
    var day = String(normalized.getUTCDate()).padStart(2, '0');
    return normalized.getUTCFullYear() + '-' + month + '-' + day;
  }

  function isSameEasternCalendarWeek(left, right) {
    return getEasternWeekKey(left) === getEasternWeekKey(right || new Date());
  }

  function formatCountdown(win) {
    if (win.status !== 'open' || !win.closesAt) return '';
    var now = new Date();
    var ms = win.closesAt - now;
    if (ms <= 0) return '0h 0m';
    var h = Math.floor(ms / (60 * 60 * 1000));
    var m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return h + 'h ' + m + 'm';
  }

  window.getScorecardWindow = getScorecardWindow;
  window.getMostRecentScorecardWindow = getMostRecentScorecardWindow;
  window.isDateInScorecardWindow = isDateInScorecardWindow;
  window.isSameEasternCalendarWeek = isSameEasternCalendarWeek;
  window.formatScorecardCountdown = formatCountdown;
})();
