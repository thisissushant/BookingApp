const fmt = (iso: string, timeZone: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone, ...opts })
    .format(new Date(iso))
    .replace(/\u202f/g, " "); // newer ICU uses a narrow no-break space before AM/PM

export const formatDate = (iso: string, tz: string) =>
  fmt(iso, tz, { year: "numeric", month: "long", day: "numeric" });

export const formatTime = (iso: string, tz: string) =>
  fmt(iso, tz, { hour: "numeric", minute: "2-digit" });
