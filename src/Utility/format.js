// Money formatting matching NevTan Workspace: whole amounts without decimals, en-IN grouping for
// rupees. Cached per currency, since building an Intl.NumberFormat is not cheap.
const formatters = new Map();

const localeFor = (currency) => (currency === "INR" ? "en-IN" : "en-US");

function moneyFormatter(currency, fractionDigits) {
  const key = `${currency}:${fractionDigits}`;
  if (!formatters.has(key)) {
    let formatter;
    try {
      formatter = new Intl.NumberFormat(localeFor(currency), {
        style: "currency",
        currency,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      });
    } catch {
      formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      });
    }
    formatters.set(key, formatter);
  }
  return formatters.get(key);
}

export function formatMoney(amount, currency) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return "";
  const code = String(currency || "USD").toUpperCase();
  const value = Number(amount);
  const whole = Math.abs(value - Math.round(value)) < 0.005;
  return moneyFormatter(code, whole ? 0 : 2).format(value);
}

export function formatStorage(gb) {
  const value = Number(gb) || 0;
  if (value <= 0) return "Custom storage";
  if (value >= 1024 && value % 1024 === 0) return `${value / 1024} TB`;
  return `${value} GB`;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

/** "2026-10-05T10:12:00" → "5 Oct 2026". Empty for a missing or unreadable date. */
export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

/** "2026-10" → "October 2026". */
export function formatMonth(value) {
  const match = /^(\d{4})-(\d{2})$/.exec(String(value || ""));
  if (!match) return String(value || "");
  return monthFormatter.format(new Date(Number(match[1]), Number(match[2]) - 1, 1));
}

/** "PAST_DUE" → "Past due". */
export function humanize(value) {
  const text = String(value || "").replace(/_/g, " ").toLowerCase();
  return text ? text[0].toUpperCase() + text.slice(1) : "";
}
