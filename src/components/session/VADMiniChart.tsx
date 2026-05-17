import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface VADDataPoint {
  turn: number;
  valence: number;
  arousal: number;
  dominance: number;
}

interface VADMiniChartProps {
  data: VADDataPoint[];
  width?: number;
  height?: number;
  showTooltip?: boolean;
  showAxes?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-[11px]"
      style={{
        background: "var(--saathi-bg-card)",
        border: "1px solid var(--saathi-border)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        fontFamily: "var(--font-app)",
      }}
    >
      <p className="font-medium mb-1" style={{ color: "var(--saathi-text-dark)" }}>
        Turn {label}
      </p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.stroke }}>
          {p.name}: {p.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
};

export const VADMiniChart = ({
  data,
  width,
  height = 100,
  showTooltip = true,
  showAxes = false,
}: VADMiniChartProps) => {
  return (
    <ResponsiveContainer width={width || "100%"} height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        {showAxes && (
          <>
            <XAxis
              dataKey="turn"
              tick={{ fontSize: 10, fill: "var(--saathi-text-soft)" }}
              axisLine={{ stroke: "var(--saathi-border)" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fontSize: 10, fill: "var(--saathi-text-soft)" }}
              axisLine={{ stroke: "var(--saathi-border)" }}
              tickLine={false}
              width={24}
            />
          </>
        )}
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        <Line
          type="monotone"
          dataKey="valence"
          name="Mood"
          stroke="var(--saathi-coral)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: "var(--saathi-coral)" }}
        />
        <Line
          type="monotone"
          dataKey="arousal"
          name="Energy"
          stroke="var(--saathi-moderate)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: "var(--saathi-moderate)" }}
          strokeDasharray="4 2"
        />
        <Line
          type="monotone"
          dataKey="dominance"
          name="Control"
          stroke="var(--saathi-calm)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: "var(--saathi-calm)" }}
          strokeDasharray="2 2"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
