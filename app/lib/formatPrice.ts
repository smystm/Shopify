/**
 * Money is stored and charged in Toman - there is no currency conversion
 * anywhere in this codebase, and none is wanted here. These helpers only change
 * how a Toman amount is *written*, never what it is.
 */

/**
 * Formats a Toman amount for display: `95068000` -> `95,068,000`.
 *
 * Prices are persisted in a TEXT column, so they arrive as strings. Anything
 * that is not a finite number yields an empty string rather than `NaN` or
 * `Infinity` leaking into the UI.
 */
export function formatToman(value: string | number | null | undefined): string {
   if (value === null || value === undefined) return ""

   const numeric = typeof value === "number" ? value : Number(String(value).trim())
   if (!Number.isFinite(numeric)) return ""

   return numeric.toLocaleString("en-US")
}

/**
 * The same amount with the unit appended, for the one surface that has no
 * adjacent label to carry it. Elsewhere the unit lives in the label so it is
 * not repeated on every row.
 */
export function formatTomanWithUnit(value: string | number | null | undefined, unit: string): string {
   const formatted = formatToman(value)
   return formatted ? `${formatted} ${unit}` : ""
}
