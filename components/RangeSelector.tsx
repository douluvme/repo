"use client";

import type { RangeKey } from "@/lib/types";

const RANGES: RangeKey[] = ["1D", "1M", "6M", "1Y", "5Y"];

interface Props {
  value: RangeKey;
  onChange: (range: RangeKey) => void;
}

export default function RangeSelector({ value, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Chart time range"
      className="inline-flex items-center gap-1 rounded-lg p-1"
      style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
    >
      {RANGES.map((r) => {
        const active = r === value;
        return (
          <button
            key={r}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(r)}
            className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            style={{
              background: active ? "var(--series-1)" : "transparent",
              color: active ? "#ffffff" : "var(--text-secondary)",
            }}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}
