import { useState } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import CategoryChart from "../components/CategoryChart";
import Card from "../components/Card";
import { leedData } from "../data";
import ScenarioComparison from "../components/ScenarioComparison";
import MethodologyModal from "../components/MethodologyModal";

export default function Dashboard() {
  const categories = [...new Set(leedData.map((d) => d.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [scenarioFilter, setScenarioFilter] = useState("All");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const filteredData = leedData.filter(
    (d) =>
      d.category === selectedCategory &&
      (scenarioFilter === "All" || d.leed === scenarioFilter)
  );

  // const baselineData = leedData.filter((d) => d.leed === "Baseline");
  // const optimizedData = leedData.filter((d) => d.leed === "Optimized");
const baselineData = leedData.filter((d) => d.leed === "Baseline Best Practice");
const optimizedData = leedData.filter((d) => d.leed === "LEED-Induced");

  return (
    <div>
      <div className="container mx-auto p-6">

        {/* Filters */}
        <FilterBar
          categories={categories}
          onCategoryChange={setSelectedCategory}
          onScenarioChange={setScenarioFilter}
        />

        {/* Header with actions */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{selectedCategory}</h1>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => setComparisonOpen(true)}
            >
              Compare Scenarios
            </button>
            <button
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              onClick={() => setMethodologyOpen(true)}
            >
              View Methodology
            </button>
          </div>
        </div>

        {/* Chart */}
        <CategoryChart data={filteredData} />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {filteredData.map((item, idx) => (
            <Card key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Scenario Comparison Modal */}
      <ScenarioComparison
        open={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        baselineData={baselineData}
        optimizedData={optimizedData}
      />

      {/* Methodology Modal */}
      <MethodologyModal
        open={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
        content={
          <div>
            <p>
              We calculate ROI using a 10-year cost-benefit model based on
              CapEx, OpEx, and asset value growth.
            </p>
            <p>
              Baseline = standard practices, Optimized = LEED-induced
              investments.
            </p>
          </div>
        }
      />
    </div>
  );
}
