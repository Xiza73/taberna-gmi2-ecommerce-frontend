/**
 * Date helpers for ISO date strings (YYYY-MM-DD), timezone-agnostic.
 */

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

/** Returns today as ISO date string (YYYY-MM-DD) in local time. */
export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Returns the date `days` days before today as ISO date string (YYYY-MM-DD). */
export function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Formats an ISO date string (YYYY-MM-DD) for short display, e.g. "24 abr".
 * Avoids `new Date('YYYY-MM-DD')` which interprets it as UTC midnight and can
 * shift the day depending on timezone — we parse the components manually.
 */
export function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  const d = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
  }).format(d);
}

/** True iff `from <= to` and both are valid YYYY-MM-DD strings. */
export function isValidIsoRange(from: string, to: string): boolean {
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if (!re.test(from) || !re.test(to)) return false;
  return from <= to;
}
