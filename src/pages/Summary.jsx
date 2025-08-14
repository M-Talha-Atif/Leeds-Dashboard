"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { leedData } from "../data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Leaf, Building, Zap, PercentCircle } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

function AnimatedNumber({ value, duration = 1 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration * 60);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        clearInterval(interval);
        start = value;
      }
      setDisplay(start);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [value, duration]);
  return <>{display.toFixed(2)}</>;
}

export default function Summary() {
  // const totalCredits = leedData.length;
  const totalCredits = leedData.reduce((sum, d) => sum + (d.credits || 0), 0);

  const totalCapex = leedData.reduce(
    (sum, d) => sum + (d?.hard ?? 0) + (d?.soft ?? 0),
    0
  );

  const totalOpexImpact = leedData.reduce(
    (sum, d) => sum + (d.budget10YrImpact || 0),
    0
  );
  console.log("Total Opex Impact:", totalOpexImpact);

  const totalAssetValue = leedData.reduce(
    (sum, d) => sum + (d?.valuePremium ?? 0),
    0
  );

  const categoryStats = leedData.reduce((acc, item) => {
    const category = item?.category || "Uncategorized";
    if (!acc[category])
      acc[category] = { count: 0, capex: 0, opex: 0 };

    acc[category].count += 1;
    acc[category].capex += (item?.hard ?? 0) + (item?.soft ?? 0);
    acc[category].opex += item?.budget10YrImpact ?? 0;

    return acc;
  }, {});

  const verdictStats = leedData.reduce((acc, item) => {
    const verdict = item?.commercialLabel || "Unknown";
    acc[verdict] = (acc[verdict] || 0) + 1;
    return acc;
  }, {});

  const positiveImpactCredits = leedData.filter(
    (d) => d?.budget10YrImpact < 0
  ).length;

  const positiveImpactPercentage =
    (positiveImpactCredits / totalCredits) * 100;

  const formatCurrency = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const verdictData = Object.entries(verdictStats).map(
    ([verdict, count]) => ({
      name: verdict,
      value: count
    })
  );

  const categoryData = Object.entries(categoryStats).map(
    ([category, stats]) => ({
      name: category,
      value: stats.count
    })
  );

  const COLORS = [
    "#16a34a",
    "#2563eb",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#6b7280"
  ];

  return (
    <div className="container mx-auto p-6 space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl font-bold tracking-tight">LEED Project Overview</h1>
        <p className="text-muted-foreground text-lg mt-2">
          A comprehensive financial & performance summary of {totalCredits} credits across multiple categories.
        </p>
      </motion.div>



      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Chart */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Category Distribution</CardTitle>
            <CardDescription>Visual breakdown of credits by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Verdicts Donut Chart */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Investment Verdicts</CardTitle>
            <CardDescription>Distribution of credit recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={verdictData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) / 1.8
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    )
                  }}
                >
                  {verdictData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend under the chart */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {verdictData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
      {/* Key Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" /> Key Insights
          </h2>
          <ul className="space-y-4 text-sm">
            {[
              {
                text: "Prioritise Energy Credits: Energy-related LEED credits deliver the highest operational savings",
                icon: <Leaf className="h-5 w-5 text-green-600" />
              },
              {
                text: "Sitewide Infrastructure Credits Drive Value Premiums",
                icon: <TrendingUp className="h-5 w-5 text-amber-600" />
              },
              {
                text: "Water Efficiency & Resource Management Add Resilience",
                icon: <Building className="h-5 w-5 text-blue-600" />
              }
            ].map((insight, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <div className="mt-1">{insight.icon}</div>
                <p className="text-slate-700 font-medium">{insight.text}</p>
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>

    </div>
  )
}
