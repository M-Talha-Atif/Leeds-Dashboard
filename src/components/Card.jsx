import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

export default function Card({ item }) {
  const verdictColor = item.verdict.includes("Required") || item.verdict.includes("Net Positive")
    ? "bg-green-100 text-green-800"
    : item.verdict.includes("Minor Net Gain")
    ? "bg-yellow-100 text-yellow-800"
    : item.verdict.includes("High Cost")
    ? "bg-red-100 text-red-800"
    : "bg-slate-100 text-slate-800";

  const borderGlow = item.verdict.includes("Required") || item.verdict.includes("Net Positive")
    ? "from-green-300 to-green-500"
    : item.verdict.includes("Minor Net Gain")
    ? "from-yellow-300 to-yellow-500"
    : item.verdict.includes("High Cost")
    ? "from-red-300 to-red-500"
    : "from-slate-300 to-slate-500";

  const iconBg = item.verdict.includes("Required") || item.verdict.includes("Net Positive")
    ? "bg-green-500"
    : item.verdict.includes("Minor Net Gain")
    ? "bg-yellow-500"
    : item.verdict.includes("High Cost")
    ? "bg-red-500"
    : "bg-slate-500";

  const verdictIcon = item.verdict.includes("Required") || item.verdict.includes("Net Positive") 
    ? <FaCheckCircle className="text-white text-3xl" /> 
    : item.verdict.includes("Minor Net Gain") 
    ? <FaExclamationTriangle className="text-white text-3xl" /> 
    : <FaTimesCircle className="text-white text-3xl" />;

  return (
    <div className={`relative bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transform transition-all duration-300 ease-out`}>
      {/* Animated gradient border */}
      <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br ${borderGlow} opacity-20 animate-pulse pointer-events-none`}></div>

      {/* Header */}
      <div className="flex justify-between items-center relative z-10">
        <h2 className="text-lg font-bold text-gray-800">{item.creditName}</h2>
        <span className={`text-xs px-3 py-1 rounded-full font-medium shadow-md ${verdictColor}`}>
          {item.leed}
        </span>
      </div>

      {/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-full my-4"></div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700 relative z-10">
        <p><strong>CapEx:</strong> {(item.capex.hard + item.capex.soft).toFixed(2)}%</p>
        <p><strong>OpEx:</strong> {item.opex.yearImpact.toFixed(2)}%</p>
        <p><strong>Asset:</strong> {item.asset.toFixed(2)}%</p>
        <p><strong>Position:</strong> {item.position.toFixed(2)}%</p>
      </div>

      {/* Verdict Section */}
      <div className="mt-6 flex items-center gap-4 p-5 rounded-xl bg-gray-50/80 border border-gray-200 shadow-inner">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${iconBg} relative`}>
          <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-20"></div>
          {verdictIcon}
        </div>
        <p className="text-lg font-bold text-gray-800">{item.verdict}</p>
      </div>
    </div>
  );
}
