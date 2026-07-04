"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import type { KospiQuotePoint, RangeKey } from "@/lib/types";
import { formatAxisTime, formatIndex, formatTooltipTime } from "@/lib/format";

interface Props {
  quotes: KospiQuotePoint[];
  range: RangeKey;
}

function ChartTooltip({
  active,
  payload,
  range,
}: TooltipProps<ValueType, NameType> & { range: RangeKey }) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0] as { value?: number; payload: { time: number; close: number | null } };
  if (typeof point.value !== "number") return null;

  return (
    <div
      className="rounded-md px-3 py-2 text-sm shadow-sm"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ color: "var(--text-secondary)" }}>
        {formatTooltipTime(point.payload.time, range)}
      </div>
      <div className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--text-primary)" }}>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 10,
            height: 2,
            background: "var(--series-1)",
          }}
        />
        {formatIndex(point.value)}
      </div>
    </div>
  );
}

export default function PriceChart({ quotes, range }: Props) {
  const data = quotes.filter((q) => q.close !== null);
  const values = data.map((d) => d.close as number);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 0;
  const pad = (max - min) * 0.08 || 1;

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="kospiFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--series-1)" stopOpacity={0.1} />
              <stop offset="100%" stopColor="var(--series-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="var(--gridline)"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="time"
            tickFormatter={(t: number) => formatAxisTime(t, range)}
            stroke="var(--baseline)"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--baseline)" }}
            minTickGap={40}
          />
          <YAxis
            domain={[min - pad, max + pad]}
            tickFormatter={(v: number) => formatIndex(v)}
            stroke="var(--baseline)"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={72}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} range={range} />}
            cursor={{ stroke: "var(--baseline)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="var(--series-1)"
            strokeWidth={2}
            fill="url(#kospiFill)"
            dot={false}
            activeDot={{ r: 4, fill: "var(--series-1)", stroke: "var(--surface-1)", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
