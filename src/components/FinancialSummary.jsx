import FinancialCard from "./FinancialCard";
import { motion } from "framer-motion";

export default function FinancialSummary({ totals, costView }) {
    const colorByValue = (value) =>
        value <= 0 ? "text-green-600" : "text-amber-500";

    const cards = [
        { label: "Total Credits", value: totals.totalCredits, bgColor: "from-gray-50 to-white", textColor: "text-gray-600" },
        { label: "Hard Cost", value: totals.hard, subValue: totals.hardPct, bgColor: "from-blue-50 to-white", textColor: colorByValue(totals.hard), isPercentage: true },
        { label: "Soft Cost", value: totals.soft, subValue: totals.softPct, bgColor: "from-green-50 to-white", textColor: colorByValue(totals.soft), isPercentage: true },
        { label: "OpEx Impact", value: totals.opex, bgColor: "from-purple-50 to-white", textColor: colorByValue(totals.opex), isPercentage: true },
        { label: "Budget 1 Year", value: totals.budget1, bgColor: "from-orange-50 to-white", textColor: colorByValue(totals.budget1), isPercentage: true },
        { label: "Budget 10 Year", value: totals.totalOpexImpact, bgColor: "from-yellow-50 to-white", textColor: colorByValue(totals.totalOpexImpact), isPercentage: true },
        { label: "Total Asset Value", value: totals.totalAssetValue, bgColor: "from-pink-50 to-white", textColor: colorByValue(totals.totalAssetValue), isPercentage: true }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {cards.map((card, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                    <FinancialCard {...card} costView={costView} />
                </motion.div>
            ))}
        </div>
    );
}
