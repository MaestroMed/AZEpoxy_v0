/**
 * Tiny French-locale formatters used across the backoffice.
 */

const RTF = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

/**
 * Returns a short relative-time label in French, e.g. "il y a 3 h", "hier",
 * "il y a 5 j". Falls back to a date string for older entries.
 */
export function formatRelativeFr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = d.getTime() - Date.now();
  const seconds = Math.round(diffMs / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (Math.abs(seconds) < 60) return RTF.format(seconds, "second");
  if (Math.abs(minutes) < 60) return RTF.format(minutes, "minute");
  if (Math.abs(hours) < 24) return RTF.format(hours, "hour");
  if (Math.abs(days) < 7) return RTF.format(days, "day");

  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: d.getFullYear() === new Date().getFullYear() ? undefined : "2-digit",
  });
}

/** "10 juin 2026 — 14:32" — used on the detail page. */
export function formatDateTimeFr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(d)
    .replace(",", " —");
}
