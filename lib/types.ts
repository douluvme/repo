export type RangeKey = "1D" | "1M" | "6M" | "1Y" | "5Y";

export interface KospiQuotePoint {
  time: number; // unix seconds
  close: number | null;
}

export interface KospiMeta {
  symbol: string;
  currency: string;
  regularMarketPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  regularMarketTime: number; // unix seconds
  exchangeTimezoneName: string;
}

export interface KospiResponse {
  meta: KospiMeta;
  quotes: KospiQuotePoint[];
}
