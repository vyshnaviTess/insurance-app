// Utility helpers for working with ISO date strings
export function formatDate(date: string | Date, locale = "en-GB"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric",  hour: "2-digit",
    minute: "2-digit", hour12: true});
}

export function daysUntil(date: string | Date): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = d.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function addDays(date: string | Date, days: number): string {
  const d = typeof date === "string" ? new Date(date) : new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
//TODO: not used yet, can be used in future for date manipulations