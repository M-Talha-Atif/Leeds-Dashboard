import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import { Switch } from "@headlessui/react";
import { motion } from "framer-motion";

export default function Card({ item, showCommercialData, isActive, onToggle, costView }) {
  const verdictColor = item.elevx.includes("Required") || item.elevx.includes("Net Positive") ||
    item.elevx.includes("Positive Outcome") || item.elevx.includes("Favourable")
    ? "bg-green-100 text-green-800"
    : item.elevx.includes("Minor Net Gain") || item.elevx.includes("Proceed if Strategically Aligned")
      ? "bg-yellow-100 text-yellow-800"
      : item.elevx.includes("High Cost") || item.elevx.includes("Strong Strategic Rationale Needed")
        ? "bg-red-100 text-red-800"
        : "bg-slate-100 text-slate-800";

  const iconBg = verdictColor.includes("green")
    ? "bg-green-500"
    : verdictColor.includes("yellow")
      ? "bg-yellow-500"
      : verdictColor.includes("red")
        ? "bg-red-500"
        : "bg-slate-500";

  const verdictIcon = verdictColor.includes("green")
    ? <FaCheckCircle className="text-white text-3xl" />
    : verdictColor.includes("yellow")
      ? <FaExclamationTriangle className="text-white text-3xl" />
      : <FaTimesCircle className="text-white text-3xl" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 12px 32px rgba(0,0,0,0.08)",
      }}
      transition={{ duration: 0.25 }}
      className={`relative backdrop-blur-lg p-6 rounded-2xl 
        shadow-lg border transition-all duration-300 ease-out
        ${isActive
          ? "border-transparent bg-gradient-to-br from-white/80 to-white/60 ring-2 ring-offset-2 ring-green-300 shadow-green-100"
          : "border-gray-200 opacity-70 grayscale-[25%]"}`}
    >
      {/* Active Glow Pulse */}
      {isActive && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse shadow-[0_0_30px_rgba(34,197,94,0.4)]" />
      )}

      {/* Header */}
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            {item.creditName}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Tier Badge */}
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-medium
        ${item.tier === "Tier 1" ? "bg-red-100 text-red-800" :
                  item.tier === "Tier 2" ? "bg-yellow-100 text-yellow-800" :
                    "bg-blue-100 text-blue-800"}`}
            >
              {item.tier}
            </span>

            {/* LEED/Baseline Badge */}
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-medium ${verdictColor}`}
            >
              {item.leedOrBau}
            </span>
          </div>
        </div>

        {/* Toggle */}
        <Switch
          checked={isActive}
          onChange={onToggle}
          className={`${isActive ? "bg-blue-600" : "bg-gray-300"}
      relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300`}
        >
          <span className="sr-only">Toggle credit</span>
          <motion.span
            layout
            className={`${isActive ? "translate-x-6" : "translate-x-1"}
        inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform`}
          />
        </Switch>
      </div>


      {/* Metrics */}
      <div className="grid grid-cols-2 gap-y-3 text-sm mb-5">
        {[
          ["Hard Cost", costView === "absolute" ? item.hardAbs : item.hard],
          ["Soft Cost", costView === "absolute" ? item.softAbs : item.soft],
          ["OpEx Impact", costView === "absolute" ? item.opexAbs : item.opexCosts],
          ["Budget Impact", costView === "absolute" ? item.budgetYearAbs : item.budgetYearImpact],
          ["10-Year Impact", costView === "absolute" ? item.budget10Abs : item.budget10YrImpact],
          ["Position", item.position], // stays same
        ].map(([label, value], i) => (
          <div key={i} className="flex flex-col">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-gray-800">
              {costView === "absolute"
                ?  value.toFixed(2)
                : `${value.toFixed(2)}%`}
            </span>
          </div>
        ))}
      </div>



      {/* Commercial Label */}
      {showCommercialData && item.commercialLabel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`px-3 py-1 rounded-full text-sm font-medium inline-block mb-5 shadow-sm ${item.commercialLabel.includes("✅")
            ? "bg-green-100 text-green-800"
            : item.commercialLabel.includes("⚠️")
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {item.commercialLabel}
        </motion.div>
      )}

      {/* Verdict */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center gap-3 p-4 rounded-lg bg-gray-50/70 border border-gray-200 shadow-sm"
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg} relative`}>
          {isActive && <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-20"></div>}
          {verdictIcon}
        </div>
        <p className="text-sm font-bold text-gray-800">
          {item.elevx.replace(/^[✅⚠️❌]\s*/, '')}
        </p>
      </motion.div>
      {/* Inactive Overlay */}
      {!isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none z-10"
        >
          <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-medium shadow">
            INACTIVE
          </span>
        </motion.div>
      )}


    </motion.div>
  );
}
