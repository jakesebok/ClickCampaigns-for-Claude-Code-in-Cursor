/**
 * 6C Scorecard availability window: Friday 12:00pm – Sunday 6:00pm (America/New_York).
 * Use getScorecardWindow() for status, messages, and countdown.
 */
(function() {
  var TZ = 'America/New_York';

  function getEasternOffsetHours(year, month, day) {
    var m = month;
    if (m >= 4 && m <= 10) return 4;
    return 5;
  }

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

  function easternToUTC(year, month, day, hour, minute) {
    var offset = getEasternOffsetHours(year, month, day);
    return Date.UTC(year, month - 1, day, hour + offset, minute || 0);
  }

  function getThisWeekFridayNoon(easternNow) {
    var y = easternNow.year, m = easternNow.month, d = easternNow.day, dow = easternNow.dayOfWeek;
    var daysToFriday = (5 - dow + 7) % 7;
    if (dow === 5 && easternNow.hour >= 12) daysToFriday += 7;
    if (dow === 6) daysToFriday += 7;
    if (dow === 0 && easternNow.hour >= 18) daysToFriday += 7;
    var fd = d + daysToFriday;
    return new Date(easternToUTC(y, m, fd, 12, 0));
  }

  function getThisWeekSunday6pm(easternNow) {
    var y = easternNow.year, m = easternNow.month, d = easternNow.day, dow = easternNow.dayOfWeek;
    var daysToSunday = (0 - dow + 7) % 7;
    if (dow === 0 && easternNow.hour < 18) daysToSunday = 0;
    if (dow === 5 && easternNow.hour >= 12) daysToSunday = 2;
    if (dow === 6) daysToSunday = 1;
    var sd = d + daysToSunday;
    return new Date(easternToUTC(y, m, sd, 18, 0));
  }

  function getScorecardWindow() {
    var now = new Date();
    var e = toEastern(now);
    var fridayNoon = getThisWeekFridayNoon(e);
    var sunday6pm = getThisWeekSunday6pm(e);
    var inWindow = (e.dayOfWeek === 5 && e.hour >= 12) || (e.dayOfWeek === 6) || (e.dayOfWeek === 0 && e.hour < 18);
    var status = inWindow ? 'open' : (now < fridayNoon ? 'before' : 'closed');
    var nextOpen = fridayNoon;
    var closesAt = sunday6pm;
    if (e.dayOfWeek === 0 && e.hour >= 18) closesAt = new Date(sunday6pm.getTime() + 7 * 24 * 60 * 60 * 1000);

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

    // opensAt = the Friday noon that started (or will start) the current/upcoming window
    var opensAt = inWindow ? new Date(fridayNoon.getTime() - 7 * 24 * 60 * 60 * 1000) : fridayNoon;

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
  window.formatScorecardCountdown = formatCountdown;
})();
