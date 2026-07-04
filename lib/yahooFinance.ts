import type { KospiMeta, KospiResponse, RangeKey } from "./types";

const SYMBOL = "^KS11"; // KOSPI Composite Index
const CHART_URL = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
  SYMBOL
)}`;

const RANGE_PARAMS: Record<RangeKey, { range: string; interval: string }> = {
  "1D": { range: "1d", interval: "5m" },
  "1M": { range: "1mo", interval: "1d" },
  "6M": { range: "6mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1wk" },
  "5Y": { range: "5y", interval: "1mo" },
};

interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: {
        currency: string;
        symbol: string;
        exchangeTimezoneName: string;
        regularMarketPrice: number;
        previousClose?: number;
        chartPreviousClose?: number;
        regularMarketDayHigh?: number;
        regularMarketDayLow?: number;
        regularMarketVolume?: number;
        fiftyTwoWeekHigh?: number;
        fiftyTwoWeekLow?: number;
        regularMarketTime?: number;
      };
      timestamp?: number[];
      indicators: {
        quote: Array<{
          close?: (number | null)[];
        }>;
      };
    }>;
    error: { code: string; description: string } | null;
  };
}

export async function getKospiData(rangeKey: RangeKey): Promise<KospiResponse> {
  const { range, interval } = RANGE_PARAMS[rangeKey];
  const url = `${CHART_URL}?range=${range}&interval=${interval}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Yahoo Finance request failed: ${res.status}`);
  }

  const data: YahooChartResponse = await res.json();

  if (data.chart.error) {
    throw new Error(data.chart.error.description);
  }

  const result = data.chart.result?.[0];
  if (!result) {
    throw new Error("No chart data returned for KOSPI");
  }

  const { meta } = result;
  const previousClose = meta.previousClose ?? meta.chartPreviousClose ?? meta.regularMarketPrice;
  const change = meta.regularMarketPrice - previousClose;
  const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

  const parsedMeta: KospiMeta = {
    symbol: meta.symbol,
    currency: meta.currency,
    regularMarketPrice: meta.regularMarketPrice,
    previousClose,
    change,
    changePercent,
    regularMarketDayHigh: meta.regularMarketDayHigh ?? meta.regularMarketPrice,
    regularMarketDayLow: meta.regularMarketDayLow ?? meta.regularMarketPrice,
    regularMarketVolume: meta.regularMarketVolume ?? 0,
    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? meta.regularMarketPrice,
    fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? meta.regularMarketPrice,
    regularMarketTime: meta.regularMarketTime ?? Math.floor(Date.now() / 1000),
    exchangeTimezoneName: meta.exchangeTimezoneName ?? "Asia/Seoul",
  };

  const timestamps = result.timestamp ?? [];
  const closes = result.indicators.quote?.[0]?.close ?? [];

  const quotes = timestamps.map((time, i) => ({
    time,
    close: closes[i] ?? null,
  }));

  return { meta: parsedMeta, quotes };
}
