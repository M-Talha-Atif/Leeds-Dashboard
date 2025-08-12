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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Credits", value: totalCredits, icon: <Building />, color: "text-slate-700", subtitle: "Across multiple categories" },
          { title: "Total CapEx", value: totalCapex, icon: <PercentCircle />, color: "text-amber-600", subtitle: "Initial impact (%)" },
          { title: "Budget 10 yr impact", value: totalOpexImpact, icon: totalOpexImpact < 0 ? <TrendingDown /> : <TrendingUp />, color: totalOpexImpact < 0 ? "text-green-600" : "text-red-600", subtitle: totalOpexImpact < 0 ? "Savings %" : "Extra cost %" },
          { title: "Asset Value Impact", value: totalAssetValue, icon: <TrendingUp />, color: "text-blue-600", subtitle: "Estimated value %" }

        ].map((card, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <div className={`h-4 w-4 ${card.color}`}>{card.icon}</div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${card.color}`}>
                  <AnimatedNumber value={typeof card.value === "number" ? card.value : parseFloat(card.value)} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Overview */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" /> Performance Insights
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Key financial metrics & projected ROI timeline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Positive Credits */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" /> Positive Impact Credits
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {positiveImpactCredits}/{totalCredits}
                  </span>
                </div>
                <Progress
                  value={positiveImpactPercentage}
                  className="h-3 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #22c55e, #16a34a)"
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  {positiveImpactPercentage.toFixed(1)}% of credits reduce long-term costs
                </p>
              </div>

              {/* Net Position */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 hover:shadow-md transition">
                <span className="text-sm font-medium flex items-center gap-2">
                  <PercentCircle className="h-4 w-4 text-blue-600" /> Net Strategic Position (ELEV-X)
                </span>
                <div
                  className={`text-3xl font-bold ${(totalOpexImpact + totalAssetValue - totalCapex) < 0 ? "text-green-600" : "text-red-600"} animate-pulse`}
                >
                  {formatCurrency(totalOpexImpact + totalAssetValue - totalCapex)}
                </div>
                <p className="text-xs text-muted-foreground">
                  10-year projected impact incl. asset appreciation
                </p>
              </div>

              {/* ROI Timeline */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 hover:shadow-md transition">
                <span className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-600" /> ROI Timeline
                </span>
                <div className="text-3xl font-bold text-slate-800 animate-pulse">
                  {totalOpexImpact < 0
                    ? `${Math.abs(totalCapex / (Math.abs(totalOpexImpact) / 10)).toFixed(1)}y`
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Estimated payback period for investments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
              { text: "Energy-related credits contribute to 40% of cost savings.", icon: <Leaf className="h-5 w-5 text-green-600" /> },
              { text: "Payback period under 5 years for 60% of investments.", icon: <TrendingUp className="h-5 w-5 text-amber-600" /> },
              { text: "Highest OpEx reduction observed in Transport-related credits.", icon: <Building className="h-5 w-5 text-blue-600" /> }
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
