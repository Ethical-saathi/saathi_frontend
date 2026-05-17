import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export interface VADTrendPoint {
  session: string;
  valence: number;
  arousal: number;
  dominance: number;
}

interface VADTrendGraphProps {
  data: VADTrendPoint[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-[12px]"
      style={{
        background: "var(--saathi-bg-card)",
        border: "1px solid var(--saathi-border)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        fontFamily: "var(--font-app)",
      }}
    >
      <p
        className="font-medium mb-1.5"
        style={{ color: "var(--saathi-text-dark)" }}
      >
        {label}
      </p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.stroke }}
          />
          <span style={{ color: "var(--saathi-text-mid)" }}>
            {p.name}: <strong>{p.value.toFixed(2)}</strong>
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = ({ payload }: any) => {
  if (!payload?.length) return null;
  return (
    <div className="flex items-center justify-center gap-5 mt-3">
      {payload.map((entry: any) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <div
            className="w-3 h-[2px] rounded-full"
            style={{ background: entry.color }}
          />
          <span
            className="text-[11px] font-medium"
            style={{ color: "var(--saathi-text-soft)" }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const VADTrendGraph = ({ data, height = 280 }: VADTrendGraphProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--saathi-border)"
          vertical={false}
        />
        <XAxis
          dataKey="session"
          tick={{ fontSize: 11, fill: "var(--saathi-text-soft)" }}
          axisLine={{ stroke: "var(--saathi-border)" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 1]}
          tick={{ fontSize: 10, fill: "var(--saathi-text-soft)" }}
          axisLine={{ stroke: "var(--saathi-border)" }}
          tickLine={false}
          width={30}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />

        <Line
          type="monotone"
          dataKey="valence"
          name="Mood"
          stroke="var(--saathi-coral)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--saathi-coral)", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "var(--saathi-coral)" }}
        />
        <Line
          type="monotone"
          dataKey="arousal"
          name="Energy"
          stroke="var(--saathi-moderate)"
          strokeWidth={2}
          dot={{ r: 2.5, fill: "var(--saathi-moderate)", strokeWidth: 0 }}
          activeDot={{ r: 4, fill: "var(--saathi-moderate)" }}
        />
        <Line
          type="monotone"
          dataKey="dominance"
          name="Control"
          stroke="var(--saathi-calm)"
          strokeWidth={2}
          dot={{ r: 2.5, fill: "var(--saathi-calm)", strokeWidth: 0 }}
          activeDot={{ r: 4, fill: "var(--saathi-calm)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
