import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoryChart({ data, height = 400 }) {
  const chartData = (data || []).map(item => {
    const hard = item?.hard ?? 0;
    const soft = item?.soft ?? 0;
    const opex = item?.budgetYearImpact ?? 0;

    return {
      name: item.creditName?.length > 20 ? item.creditName.slice(0, 20) + "..." : item.creditName || "N/A",
      fullName: item.creditName || "Unnamed Credit",
      CapEx: parseFloat((hard + soft).toFixed(2)),
      OpEx: parseFloat(opex.toFixed(2)),
    };
  });


  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.fullName}</p>
          <p className="text-indigo-600">CapEx: {payload[0].value}%</p>
          <p className="text-emerald-600">OpEx: {payload[1].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg rounded-xl bg-white w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-gray-800">Project Cost Analysis</CardTitle>
      </CardHeader>
      {/* Remove default padding, make chart full width */}
      <div className="w-full h-full px-4">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 13 }} />
            <defs>
              <linearGradient id="capexGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="opexGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
            </defs>
            <Bar dataKey="CapEx" fill="url(#capexGradient)" radius={[10, 10, 0, 0]} />
            <Bar dataKey="OpEx" fill="url(#opexGradient)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
