import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

export default function WaterfallChart({ totals }) {
  // Color scheme
  const colors = {
    hard: "#4f46e5",       // Indigo-600
    soft: "#059669",       // Emerald-600
    budgetYear: "#4338ca", // Indigo-700
    impact: "#7c3aed",     // Violet-600
    positive: "#10b981",   // Emerald-500
    negative: "#ef4444",   // Red-500
  };

  // Prepare data
  const data = [
    {
      name: "Hard Cost",
      value: totals.hard,
      fill: colors.hard,
      description: "Initial construction costs",
    },
    {
      name: "Soft Cost",
      value: totals.soft,
      fill: colors.soft,
      description: "Design and certification costs",
    },
    {
      name: "1-Year Impact",
      value: totals.budget1,
      fill: colors.budgetYear,
      description: "First year operational impact",
    },
    {
      name: "10-Year Impact",
      value: totals.budget10,
      fill: colors.impact,
      description: "Projected operational savings",
    },
    {
      name: "LEED Position",
      value: totals.position,
      fill: totals.position >= 0 ? colors.positive : colors.negative,
      description:
        totals.position >= 0 ? "Net positive ROI" : "Net cost position",
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">
        LEED Cost-Benefit Waterfall
        <span className="ml-2 text-sm font-normal text-gray-500">
          (10-year projection)
        </span>
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          barSize={50}
          margin={{ top: 20, right: 30, bottom: 20, left: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal stroke="#f3f4f6" />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <XAxis
            type="number"
            domain={["dataMin - 10", "dataMax + 10"]}
            tickFormatter={(value) => `${value.toFixed(2)}%`}  // << FIXED
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value, name, props) => {
              const item = props.payload;
              const sign = value >= 0 ? "+" : "-";
              return [`${sign}${Math.abs(value).toFixed(2)}%`, item.name]; // << FIXED
            }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                  <p className="font-semibold">{data.name}</p>
                  <p className="text-sm text-gray-600">{data.description}</p>
                  <p
                    className={`mt-1 font-bold ${data.value >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {data.value >= 0 ? "+" : "-"}
                    {Math.abs(data.value).toFixed(2)}%
                  </p>
                </div>
              );
            }}
          />

          <Bar
            dataKey="value"
            radius={[0, 4, 4, 0]}
            label={{
              position: "right",
              formatter: (val) =>
                `${val >= 0 ? "+" : "-"}${Math.abs(val).toFixed(2)}%`, // << FIXED
              fill: "#374151",
              fontSize: 12,
            }}
            shape={(props) => {
              const { x, y, width, height, payload } = props;
              return (
                <rect
                  x={width < 0 ? x + width : x}
                  y={y}
                  width={Math.abs(width)}
                  height={height}
                  rx={4}
                  ry={4}
                  fill={payload.fill}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {["hard", "soft", "budgetYear", "impact", "positive", "negative"].map(
          (type) => (
            <div key={type} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[type] }}
              />
              <span className="text-xs text-gray-600 capitalize">
                {type === "hard" && "Hard Costs"}
                {type === "soft" && "Soft Costs"}
                {type === "budgetYear" && "1-Year Impact"}
                {type === "impact" && "10-Year Impact"}
                {type === "positive" && "Positive Position"}
                {type === "negative" && "Negative Position"}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
