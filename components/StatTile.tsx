interface Props {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "critical";
}

export default function StatTile({ label, value, tone = "neutral" }: Props) {
  const color =
    tone === "good"
      ? "var(--good)"
      : tone === "critical"
      ? "var(--critical)"
      : "var(--text-primary)";

  return (
    <div
      className="rounded-lg p-4"
      style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
    >
      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <div
        className="mt-1 text-lg font-semibold"
        style={{ color, fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </div>
    </div>
  );
}
