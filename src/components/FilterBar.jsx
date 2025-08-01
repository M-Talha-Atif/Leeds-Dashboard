import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FilterBar({ categories, onCategoryChange, onScenarioChange }) {
  const scenarios = ["All", "Baseline Best Practice", "LEED-Induced"];
  const [selectedScenario, setSelectedScenario] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    onCategoryChange(e.target.value);
  };

  const handleScenarioChange = (e) => {
    setSelectedScenario(e.target.value);
    onScenarioChange(e.target.value);
  };

  return (
    <div className="flex flex-wrap gap-6 bg-white/80 backdrop-blur-md shadow-lg p-5 rounded-xl border border-gray-200 mb-6">
      {/* Category Dropdown */}
      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-64 p-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none transition"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Scenario Dropdown */}
      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Scenario</label>
        <div className="relative">
          <select
            value={selectedScenario}
            onChange={handleScenarioChange}
            className="w-64 p-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 appearance-none transition"
          >
            {scenarios.map((sc, idx) => (
              <option key={idx} value={sc}>{sc}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
        </div>
      </div>
    </div>
  );
}
