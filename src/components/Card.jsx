import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import { Switch } from "@headlessui/react";

export default function Card({ item, showCommercialData, isActive, onToggle }) {
  // Determine styling based on credit evaluation
  const verdictColor = item.elevx.includes("Required") || 
                      item.elevx.includes("Net Positive") || 
                      item.elevx.includes("Positive Outcome") || 
                      item.elevx.includes("Favourable")
    ? "bg-green-100 text-green-800"
    : item.elevx.includes("Minor Net Gain") || 
      item.elevx.includes("Proceed if Strategically Aligned")
    ? "bg-yellow-100 text-yellow-800"
    : item.elevx.includes("High Cost") || 
      item.elevx.includes("Strong Strategic Rationale Needed")
    ? "bg-red-100 text-red-800"
    : "bg-slate-100 text-slate-800";

  const borderGlow = item.elevx.includes("Required") || 
                    item.elevx.includes("Net Positive") || 
                    item.elevx.includes("Positive Outcome") || 
                    item.elevx.includes("Favourable")
    ? "from-green-300 to-green-500"
    : item.elevx.includes("Minor Net Gain") || 
      item.elevx.includes("Proceed if Strategically Aligned")
    ? "from-yellow-300 to-yellow-500"
    : item.elevx.includes("High Cost") || 
      item.elevx.includes("Strong Strategic Rationale Needed")
    ? "from-red-300 to-red-500"
    : "from-slate-300 to-slate-500";

  const iconBg = item.elevx.includes("Required") || 
                item.elevx.includes("Net Positive") || 
                item.elevx.includes("Positive Outcome") || 
                item.elevx.includes("Favourable")
    ? "bg-green-500"
    : item.elevx.includes("Minor Net Gain") || 
      item.elevx.includes("Proceed if Strategically Aligned")
    ? "bg-yellow-500"
    : item.elevx.includes("High Cost") || 
      item.elevx.includes("Strong Strategic Rationale Needed")
    ? "bg-red-500"
    : "bg-slate-500";

  const verdictIcon = item.elevx.includes("Required") || 
                     item.elevx.includes("Net Positive") || 
                     item.elevx.includes("Positive Outcome") || 
                     item.elevx.includes("Favourable")
    ? <FaCheckCircle className="text-white text-3xl" />
    : item.elevx.includes("Minor Net Gain") || 
      item.elevx.includes("Proceed if Strategically Aligned")
    ? <FaExclamationTriangle className="text-white text-3xl" />
    : <FaTimesCircle className="text-white text-3xl" />;

  return (
    <div className={`
      relative bg-white/70 backdrop-blur-md p-6 rounded-2xl 
      shadow-lg hover:shadow-2xl transform transition-all 
      duration-300 ease-out border border-gray-200
      ${!isActive ? 'opacity-70 grayscale-[30%]' : ''}
    `}>
      {/* Header with toggle switch */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <h2 className="text-lg font-bold text-gray-800 flex-1">
          {item.creditName}
        </h2>
        
        {/* Toggle Switch - moved to header row */}
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${verdictColor}`}>
            {item.leedOrBau}
          </span>
          <Switch
            checked={isActive}
            onChange={onToggle}
            className={`${
              isActive ? 'bg-blue-600' : 'bg-gray-300'
            } relative inline-flex h-5 w-9 items-center rounded-full`}
          >
            <span className="sr-only">Toggle credit</span>
            <span
              className={`${
                isActive ? 'translate-x-4' : 'translate-x-1'
              } inline-block h-3 w-3 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-200 my-3"></div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
        <p><strong>Hard Cost:</strong> {item.hard.toFixed(2)}%</p>
        <p><strong>Soft Cost:</strong> {item.soft.toFixed(2)}%</p>
        <p><strong>OpEx Impact:</strong> {item.opexCosts.toFixed(2)}%</p>
        <p><strong>Budget Impact:</strong> {item.budgetYearImpact.toFixed(2)}%</p>
        <p><strong>10-Year Impact:</strong> {item.budget10YrImpact.toFixed(2)}%</p>
        <p><strong>Position:</strong> {item.position.toFixed(2)}%</p>
        {showCommercialData && (
          <p><strong>Credits:</strong> {item.credits}</p>
        )}
      </div>

      {/* Commercial Label */}
      {showCommercialData && item.commercialLabel && (
        <div className="mt-2 text-sm font-medium">
          <span className={`px-2 py-1 rounded ${
            item.commercialLabel.includes("✅")
              ? "bg-green-100 text-green-800"
              : item.commercialLabel.includes("⚠️")
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
            {item.commercialLabel}
          </span>
        </div>
      )}

      {/* Verdict Section */}
      <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} relative`}>
          {isActive && (
            <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-20"></div>
          )}
          {verdictIcon}
        </div>
        <p className="text-sm font-bold text-gray-800">
          {item.elevx.replace(/^[✅⚠️❌]\s*/, '')}
        </p>
      </div>

      {/* Disabled indicator */}
      {!isActive && (
        <div className="absolute inset-0 bg-white/40 rounded-2xl flex items-center justify-center pointer-events-none">
          <span className="bg-gray-700 text-white px-2 py-0.5 rounded-full text-xs font-medium">
            INACTIVE
          </span>
        </div>
      )}
    </div>
  );
}