import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Leaf, PercentCircle, TrendingUp } from "lucide-react";

export default function PerformanceInsights({
  positiveImpactCredits,
  totalRows,
  totalCredits,
  totalHard,
  totalSoft,
  total10YearBudget,
  total1YearBudget,
  positiveImpactPercentage,
  totalOpexImpact,
  totalAssetValue,
  totalCapex
}) {
  // Plain number formatter (no $ sign)
  const formatNumber = (value) =>
    value?.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="border border-gray-200 shadow-xl bg-gradient-to-br from-white to-slate-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-slate-50">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" /> Performance Insights
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Key financial metrics & projected ROI timeline
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Positive Credits */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="space-y-3 p-4 rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-600" /> Positive Impact Credits
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {positiveImpactCredits}/{totalRows}
                </span>
              </div>
              <Progress
                value={ (positiveImpactCredits / totalRows) * 100 }
                className="h-3 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #22c55e, #16a34a)"
                }}
              />
              <p className="text-xs text-muted-foreground">
                { ( (positiveImpactCredits / totalRows) * 100 ) .toFixed(1)}% of credits reduce long-term costs
              </p>
            </motion.div>

            {/* Net Position */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="space-y-3 p-4 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition"
            >
              <span className="text-sm font-medium flex items-center gap-2">
                <PercentCircle className="h-4 w-4 text-blue-600" /> Net Strategic Position (ELEV-X)
              </span>
              <div
                className={`text-3xl font-bold ${(total10YearBudget - (totalAssetValue * 0.5)) <= 0
                    ? "text-green-600"
                    : "text-amber-600"
                  } animate-pulse`}
              >
                {formatNumber((total10YearBudget - (totalAssetValue * 0.5)))}
              </div>
              <p className="text-xs text-muted-foreground">
                10-year projected impact incl. asset appreciation
              </p>
            </motion.div>

            {/* ROI Timeline */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="space-y-3 p-4 rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white shadow-sm hover:shadow-md transition"
            >
              <span className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-600" /> ROI Timeline
              </span>
              <div className="text-3xl font-bold text-slate-800 animate-pulse">
                { console.log(totalOpexImpact, totalHard, totalSoft) }
                {totalOpexImpact < 0
                  ? `${Math.abs((totalHard + totalSoft) / (Math.abs(totalOpexImpact) * 0.4)).toFixed(2)}y`
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                Estimated payback period for investments
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
