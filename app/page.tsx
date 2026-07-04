"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import RangeSelector from "@/components/RangeSelector";
import StatTile from "@/components/StatTile";
import PriceChart from "@/components/PriceChart";
import type { KospiResponse, RangeKey } from "@/lib/types";
import {
  formatCompact,
  formatIndex,
  formatSigned,
  formatSignedPercent,
  formatUpdatedAt,
} from "@/lib/format";

const REFRESH_INTERVAL_MS = 30_000;

export default function Page() {
  const [range, setRange] = useState<RangeKey>("1M");
  const [data, setData] = useState<KospiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const rangeRef = useRef(range);
  rangeRef.current = range;

  const fetchData = useCallback(async (r: RangeKey) => {
    try {
      const res = await fetch(`/api/kospi?range=${r}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load data");
      if (rangeRef.current === r) {
        setData(json);
        setError(null);
      }
    } catch (e) {
      if (rangeRef.current === r) {
        setError(e instanceof Error ? e.message : "Failed to load data");
      }
    } finally {
      if (rangeRef.current === r) setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData(range);
    const id = setInterval(() => fetchData(rangeRef.current), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [range, fetchData]);

  const meta = data?.meta;
  const isUp = meta ? meta.change >= 0 : true;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-semibold">KOSPI</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Korea Composite Stock Price Index (^KS11)
          </p>
        </div>
        {meta && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Updated {formatUpdatedAt(meta.regularMarketTime)}
          </p>
        )}
      </header>

      {error && !data && (
        <div
          className="mb-6 rounded-lg p-4 text-sm"
          style={{ background: "var(--surface-1)", border: "1px solid var(--critical)", color: "var(--critical)" }}
        >
          {error}
        </div>
      )}

      {meta && (
        <>
          <section
            className="mb-6 rounded-xl p-6"
            style={{ background: "var(--surface-1)", border: "1px solid var(--border)", opacity: loading ? 0.7 : 1 }}
          >
            <div
              className="text-[48px] font-semibold leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              {formatIndex(meta.regularMarketPrice)}
            </div>
            <div
              className="mt-2 text-base font-medium"
              style={{ color: isUp ? "var(--good)" : "var(--critical)" }}
            >
              {formatSigned(meta.change)} ({formatSignedPercent(meta.changePercent)})
              <span className="ml-2 font-normal" style={{ color: "var(--text-muted)" }}>
                vs prev close {formatIndex(meta.previousClose)}
              </span>
            </div>
          </section>

          <div
            className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          >
            <StatTile label="Day high" value={formatIndex(meta.regularMarketDayHigh)} />
            <StatTile label="Day low" value={formatIndex(meta.regularMarketDayLow)} />
            <StatTile label="52-week high" value={formatIndex(meta.fiftyTwoWeekHigh)} />
            <StatTile label="52-week low" value={formatIndex(meta.fiftyTwoWeekLow)} />
            <StatTile label="Volume" value={formatCompact(meta.regularMarketVolume)} />
          </div>

          <section
            className="rounded-xl p-6"
            style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                Price history
              </h2>
              <RangeSelector value={range} onChange={setRange} />
            </div>
            <div style={{ opacity: loading ? 0.6 : 1, transition: "opacity 150ms" }}>
              <PriceChart quotes={data!.quotes} range={range} />
            </div>
          </section>
        </>
      )}
    </main>
  );
}
