import type { RangeKey } from "./types";

export function formatIndex(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatSigned(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatSignedPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatAxisTime(unixSeconds: number, range: RangeKey): string {
  const date = new Date(unixSeconds * 1000);
  const opts: Intl.DateTimeFormatOptions =
    range === "1D"
      ? { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Seoul" }
      : range === "1M" || range === "6M"
      ? { month: "short", day: "numeric", timeZone: "Asia/Seoul" }
      : { year: "numeric", month: "short", timeZone: "Asia/Seoul" };
  return new Intl.DateTimeFormat("en-US", opts).format(date);
}

export function formatTooltipTime(unixSeconds: number, range: RangeKey): string {
  const date = new Date(unixSeconds * 1000);
  const opts: Intl.DateTimeFormatOptions =
    range === "1D"
      ? {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Seoul",
          month: "short",
          day: "numeric",
        }
      : { year: "numeric", month: "short", day: "numeric", timeZone: "Asia/Seoul" };
  return new Intl.DateTimeFormat("en-US", opts).format(date);
}

export function formatUpdatedAt(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
    timeZoneName: "short",
  }).format(date);
}
