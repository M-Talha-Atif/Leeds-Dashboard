import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ReferenceLine,
  Cell
} from "recharts";

export default function WaterfallChart({ totals }) {
  // Updated color scheme to match financial waterfall
  const colors = {
    initial: "#4f46e5",       // Indigo-600 (initial investment)
    cost: "#ef4444",          // Red-600 (costs)
    benefit: "#10b981",       // Green-600 (benefits)
    cumulative: "#3b82f6",    // Blue-500 (cumulative line)
  };

  // Prepare data in cumulative waterfall format
  const data = [
    { 
      name: "Initial Position", 
      value: 0,
      fill: colors.initial,
      isCumulative: true
    },
    { 
      name: "Hard Cost", 
      value: totals.hard,
      fill: colors.cost,
      isCumulative: false
    },
    { 
      name: "Soft Cost", 
      value: totals.soft,
      fill: colors.cost,
      isCumulative: false
    },
    { 
      name: "1-Year Impact", 
      value: totals.budget1,
      fill: totals.budget1 >= 0 ? colors.benefit : colors.cost,
      isCumulative: false
    },
    { 
      name: "10-Year Impact", 
      value: totals.budget10,
      fill: totals.budget10 >= 0 ? colors.benefit : colors.cost,
      isCumulative: false
    },
    { 
      name: "Final Position", 
      value: totals.position,
      fill: totals.position >= 0 ? colors.benefit : colors.cost,
      isCumulative: true
    }
  ];

  // Calculate cumulative values
  let cumulativeValue = 0;
  const processedData = data.map((item) => {
    if (!item.isCumulative) {
      cumulativeValue += item.value;
    } else {
      cumulativeValue = item.value;
    }
    return {
      ...item,
      cumulative: cumulativeValue
    };
  });

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">
        Financial Waterfall (Cumulative Cash Flow)
        <span className="ml-2 text-sm font-normal text-gray-500">
          Visualizing project returns over time
        </span>
      </h3>

  

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          barGap={0}
          barCategoryGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `${value.toFixed(2)}%`}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          
          <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1} />
          
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                  <p className="font-semibold">{data.name}</p>
                  <p className={`mt-1 font-bold ${
                    data.value >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {data.value >= 0 ? "+" : ""}{data.value.toFixed(2)}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Cumulative: {data.cumulative.toFixed(2)}%
                  </p>
                </div>
              );
            }}
          />

          <Bar dataKey="value">
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill}
                stroke={entry.isCumulative ? colors.cumulative : undefined}
                strokeWidth={entry.isCumulative ? 2 : 0}
              />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`}
              fill="#374151"
              fontSize={12}
            />
            <LabelList
              dataKey="cumulative"
              position="bottom"
              formatter={(value) => `${value.toFixed(2)}%`}
              fill={colors.cumulative}
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>


      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {Object.entries({
          initial: "Initial Investment",
          cost: "Costs",
          benefit: "Benefits",
          cumulative: "Cumulative Flow"
        }).map(([key, label]) => (
          <div key={key} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: colors[key] }}
            />
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}