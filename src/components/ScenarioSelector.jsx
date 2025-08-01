import { useState } from "react";

export default function ScenarioSelector({ onSelect }) {
  const scenarios = ["All", "Baseline Best Practice", "LEED-Induced"];
  const [active, setActive] = useState("All");

  return (
    <div className="flex items-center justify-center gap-3 my-6">
      {scenarios.map((scenario) => (
        <button
          key={scenario}
          onClick={() => { setActive(scenario); onSelect(scenario); }}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 
            ${active === scenario 
              ? "bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-lg" 
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
        >
          {scenario}
        </button>
      ))}
    </div>
  );
}
