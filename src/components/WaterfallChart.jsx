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

export default function WaterfallChart({ totals, costView }) {
  // Updated color scheme to match financial waterfall
  const colors = {
    positive: "#f59e0b", // Amber-500 for > 0
    negative: "#16a34a", // Green-600 for <= 0
    cumulative: "#3b82f6" // Blue-500 for cumulative line
  };

  const colorByValue = (value) =>
    value > 0 ? colors.positive : colors.negative;

  const isEmpty =
    !totals ||
    ["hard", "soft", "opex", "budget1", "budget10", "position"].every(
      key => !totals[key] || totals[key] === 0
    );

  // Prepare data in cumulative waterfall format
  const data = [
    {
      name: "Initial Position",
      value: 0,
      fill: colors.initial,
      isCumulative: false
    },
    {
      name: "Hard",
      value: totals.hard,
      fill: totals.hard >= 0 ? colors.positive : colors.negative,
      isCumulative: false
    },
    {
      name: "Soft",
      value: totals.soft,
      fill: totals.soft >= 0 ? colors.positive : colors.negative,
      isCumulative: false
    },
    {
      name: "Opex Costs",
      value: totals.opex,
      fill: totals.opex >= 0 ? colors.positive : colors.negative,
      isCumulative: false
    },
    {
      name: "Budget 1-Year",
      value: totals.budget1,
      fill: totals.budget1 >= 0 ? colors.positive : colors.negative,
      isCumulative: false
    },
    {
      name: "Budget 10-Year",
      value: totals.budget10,
      fill: totals.budget10 >= 0 ? colors.positive : colors.negative,
      isCumulative: false
    },
    {
      name: "Final Position",
      value: (totals.budget10 - (totals.totalAssetValue * 0.5)),
      fill: (totals.budget10 - (totals.totalAssetValue * 0.5)) >= 0 ? colors.positive : colors.negative,
      isCumulative: false
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

  if (isEmpty) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center text-gray-600">
        <p className="text-lg font-semibold">No data to display</p>
        <p className="mt-2 text-sm">
          Please select a <span className="font-medium">Category</span>,{" "}
          <span className="font-medium">Scenario</span>, and at least one{" "}
          <span className="font-medium">Card</span> to view the chart.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            onClick={() => alert("Open category selector")}
          >
            Select Category
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
            onClick={() => alert("Open scenario selector")}
          >
            Select Scenario
          </button>
        </div>
      </div>
    );
  }

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
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barGap={4}
          barCategoryGap={40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="name"
            interval={0} //  forces all labels to show
            tick={({ x, y, payload }) => {
              const words = payload.value.split(" ");
              return (
                <text
                  x={x}
                  y={y + 40} // push text a bit down
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize={12}

                >
                  {words.map((word, index) => (
                    <tspan key={index} x={x} dy={index === 0 ? 0 : 12}>
                      {word}
                    </tspan>
                  ))}
                </text>
              );
            }}
            height={60} // give extra height for rotated labels
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(value) =>
              costView === "absolute"
                ? value
                : `${value.toFixed(2)}%`
            }
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
                  <p className={`mt-1 font-bold ${data.value >= 0 ? "text-amber-500" : "text-green-600"}`}>
                    {costView === "absolute"
                      ? data.value
                      : `${data.value >= 0 ? "+" : ""}${data.value.toFixed(2)}%`}
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
              formatter={(value) =>
                costView === "absolute"
                  ? value.toFixed(2)
                  : `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
              }
              fill="#374151"
              fontSize={12}
            />
            {/* <LabelList
              dataKey="cumulative"
              position="bottom"
              formatter={(value) => `${value.toFixed(2)}%`}
              fill={colors.cumulative}
              fontSize={12}
            /> */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>


      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {Object.entries({
          positive: "Positive (> 0)",
          negative: "Negative (≤ 0)",
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