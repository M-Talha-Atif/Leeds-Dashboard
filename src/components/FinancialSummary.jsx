import FinancialCard from "./FinancialCard";
import { motion } from "framer-motion";

export default function FinancialSummary({ totals }) {
    const cards = [
        { label: "Total Credits", value: totals.totalCredits, bgColor: "from-gray-50 to-white", textColor: "text-gray-600" },
        { label: "Hard Cost", value: totals.hard, subValue: totals.hardPct, bgColor: "from-blue-50 to-white", textColor: "text-blue-600", isPercentage: true },
        { label: "Soft Cost", value: totals.soft, subValue: totals.softPct, bgColor: "from-green-50 to-white", textColor: "text-green-600", isPercentage: true },
        { label: "OpEx Impact", value: totals.opex, bgColor: "from-purple-50 to-white", textColor: "text-purple-600", isPercentage: true },
        { label: "Budget 1 Year", value: totals.budget1, bgColor: "from-orange-50 to-white", textColor: "text-orange-600", isPercentage: true },
        { label: "Budget 10 Year", value: totals.totalOpexImpact, bgColor: "from-yellow-50 to-white", textColor: "text-yellow-600" },
        { label: "ELEV-X", value: totals.position, subValue: totals.positionPct, bgColor: "from-indigo-50 to-white", textColor: totals.position >= 0 ? "text-green-600" : "text-red-600", tooltip: "10-Year Impact minus Total Costs", isPercentage: true },
        { label: "Total Asset Value", value: totals.totalAssetValue, bgColor: "from-pink-50 to-white", textColor: "text-pink-600" }
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
                    <FinancialCard {...card} />
                </motion.div>
            ))}
        </div>
    );
}
