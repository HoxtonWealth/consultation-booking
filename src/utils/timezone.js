export const UAE_TZ = "Asia/Dubai";

/** UAE business hours: 9:00–16:30 in 30-minute intervals */
export const UAE_SLOT_HOURS = (() => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push({ hour, minute: 0 });
    slots.push({ hour, minute: 30 });
  }
  return slots;
})();

/** Build a UTC Date for a given date + hour/minute in UAE timezone (UTC+4) */
export const uaeDateToUTC = (year, month, day, hour, minute) => {
  return new Date(Date.UTC(year, month, day, hour - 4, minute));
};

/** Format a Date to HH:MM in a given timezone */
export const formatTime = (date, timezone) => {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });
};

/** Format a Date to YYYY-MM-DD in a given timezone */
export const formatDateISO = (date, timezone) => {
  return date.toLocaleDateString("en-CA", { timeZone: timezone });
};

/** Get short timezone label like "GMT+4" or "GST" */
export const getTimezoneLabel = (timezone) => {
  try {
    const now = new Date();
    const short = now.toLocaleTimeString("en-US", { timeZone: timezone, timeZoneName: "short" });
    const match = short.match(/[A-Z]{2,5}[+-]?\d*|UTC|GMT[+-]?\d*/);
    if (match) return match[0];
    const longName = now.toLocaleTimeString("en-US", { timeZone: timezone, timeZoneName: "longOffset" });
    const offsetMatch = longName.match(/GMT[+-]\d{1,2}(:\d{2})?/);
    return offsetMatch ? offsetMatch[0] : timezone.split("/").pop().replace(/_/g, " ");
  } catch {
    return timezone;
  }
};

/** Friendly timezone name: "Europe/London" -> "London" */
export const friendlyTimezone = (timezone) => {
  try {
    return timezone.split("/").pop().replace(/_/g, " ");
  } catch {
    return timezone;
  }
};
