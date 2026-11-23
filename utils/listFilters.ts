/**
 * Client-side helpers for searching and filtering dashboard lists.
 * Lists here are already loaded in full, so filtering happens in the browser.
 */

const normalize = (value: unknown): string =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

/**
 * True when every word of `query` appears somewhere in `values`.
 * "ada lag" matches a patient named "Adaeze" in "Lagos Ward".
 */
export function matchesQuery(query: string, ...values: unknown[]): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = values.map(normalize).join(" ");
  return terms.every((term) => haystack.includes(term));
}

/** Case-insensitive equality; an empty filter value means "all". */
export function matchesOption(filterValue: string, value: unknown): boolean {
  if (!filterValue) return true;
  return normalize(value) === normalize(filterValue);
}

export type DateRange = "" | "today" | "7d" | "30d" | "90d";

export const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const RANGE_DAYS: Record<Exclude<DateRange, "" | "today">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

/** True when `value` falls inside `range`. An empty range matches everything. */
export function isWithinDateRange(value: string | Date | null | undefined, range: DateRange): boolean {
  if (!range) return true;
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "today") return date >= startOfToday;

  const start = new Date(startOfToday);
  start.setDate(start.getDate() - (RANGE_DAYS[range] - 1));
  return date >= start;
}

/** Distinct, non-empty values sorted alphabetically, ready for a filter dropdown. */
export function optionsFrom(values: unknown[]): { value: string; label: string }[] {
  const seen = new Map<string, string>();
  for (const raw of values) {
    const label = String(raw ?? "").trim();
    if (!label || label === "-" || label === "N/A") continue;
    const key = normalize(label);
    if (!seen.has(key)) seen.set(key, label);
  }
  return [...seen.values()]
    .sort((a, b) => a.localeCompare(b))
    .map((label) => ({ value: label, label }));
}

const timeOf = (value: string | Date | null | undefined): number => {
  if (!value) return Number.NEGATIVE_INFINITY;
  const time = (value instanceof Date ? value : new Date(value)).getTime();
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
};

/** Returns a copy sorted newest first; items without a usable date go last. */
export function newestFirst<T>(items: T[], getDate: (item: T) => string | Date | null | undefined): T[] {
  return [...items].sort((a, b) => timeOf(getDate(b)) - timeOf(getDate(a)));
}

/** The most meaningful date on a clinical record, for sorting lists of mixed API records. */
export function recordDate(item: unknown): string | null | undefined {
  const record = (item ?? {}) as Record<string, unknown>;
  const value = record.recorded_at ?? record.ordered_at ?? record.created_at ?? record.updated_at;
  return typeof value === "string" ? value : null;
}
