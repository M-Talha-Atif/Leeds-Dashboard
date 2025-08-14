import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

const proxyMetrics = [
  { category: "Water Efficiency", metric: "Hard Cost", range: "0.07% – 0.7%", basis: "World Bank, MENA Pilots" },
  { category: "Water Efficiency", metric: "OpEx Savings", range: "–0.25% – 0%", basis: "IFC, LEED, GCC Benchmarks" },
  { category: "Energy & GHG", metric: "Hard Cost", range: "–0.1% – 1.0%", basis: "IEA, CBRE, Connective Cities" },
  { category: "Energy & GHG", metric: "10-Yr NPV", range: "–1% – –13%", basis: "IFC, World Bank, EU Case Studies" },
  { category: "Materials/Resources", metric: "Asset Premium", range: "0% – 1.5%", basis: "RICS, CBRE, ESG Pricing Studies" },
  { category: "Quality of Life", metric: "Soft Cost", range: "0.07% – 0.15%", basis: "World Bank, IFC, LEED ND/Star" },
  { category: "Innovation", metric: "Position (%)", range: "–2.0% – 0.2%", basis: "Passivhaus, CBRE/RICS, LEED v4/5" },
  { category: "NPV Calculation", metric: "Discount Rate", range: "6% (Factor 7.34)", basis: "Market Finance Accepted Standard" },
];

export default function MethodologyModal({ open, onClose }) {
  // Calculate a fake "Sustainability Score" for visual
  const score = useMemo(() => {
    // just a fun calculation: higher positive ranges = better score
    const positiveCount = proxyMetrics.filter(m => !m.range.includes("–")).length;
    return Math.min(100, Math.round((positiveCount / proxyMetrics.length) * 100));
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-xl max-w-5xl w-full relative h-[70vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>

            <h2 className="text-lg sm:text-xl font-bold mb-4">
              ESG/LEED Proxy Metric Ranges — Benchmark Summary
            </h2>

            {/* Table */}
            <motion.div
              className="overflow-auto border rounded-lg flex-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <table className="min-w-[600px] text-sm text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 border-b font-semibold text-gray-700">Category</th>
                    <th className="px-4 py-2 border-b font-semibold text-gray-700">Metric</th>
                    <th className="px-4 py-2 border-b font-semibold text-gray-700">Typical Range</th>
                    <th className="px-4 py-2 border-b font-semibold text-gray-700">Science / Reference Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {proxyMetrics.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-2 border-b text-gray-800 font-medium">{row.category}</td>
                      <td className="px-4 py-2 border-b text-gray-700">{row.metric}</td>
                      <td className="px-4 py-2 border-b text-gray-900 font-semibold">{row.range}</td>
                      <td className="px-4 py-2 border-b text-gray-600">{row.basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Footer with Gauge */}
            <motion.div
              className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span>Data sources: IFC, LEED, World Bank, CBRE</span>
              <div className="flex flex-col items-center">
                <div className="relative w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <motion.div
                    className="absolute bottom-0 left-0 w-full bg-green-400"
                    style={{ height: `${score}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${score}%` }}
                    transition={{ duration: 1 }}
                  />
                  <span className="text-[10px] font-bold text-gray-700 z-10">{score}%</span>
                </div>
                <span className="text-[10px] mt-1">Sustainability Score</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
