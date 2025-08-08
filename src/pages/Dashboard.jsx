import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import WaterfallChart from "../components/WaterfallChart";
import Card from "../components/Card";
import { leedData } from "../data";
import ScenarioComparison from "../components/ScenarioComparison";
import MethodologyModal from "../components/MethodologyModal";
import { Switch } from "@headlessui/react";

export default function Dashboard() {
  const categories = [
    "Overall Data",
    "All Categories",
    ...new Set(leedData.map((d) => d.category)),
  ];

  // State management
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [scenarioFilter, setScenarioFilter] = useState("All");
  const [targetFilter, setTargetFilter] = useState("All");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [showCommercial, setShowCommercial] = useState(true);

  // Track active credits (all enabled by default)
  const [activeCredits, setActiveCredits] = useState(() =>
    leedData.reduce((acc, item) => ({ ...acc, [item.creditName]: true }), {})
  );

  // Filter data based on category, scenario, and target (show all cards)
  const filteredCards = useMemo(() => {
    return selectedCategory === "Overall Data"
      ? leedData
      : leedData.filter(
          (d) =>
            (selectedCategory === "All Categories" ||
              d.category === selectedCategory) &&
            (scenarioFilter === "All" || d.leedOrBau === scenarioFilter) &&
            (targetFilter === "All" || d.target === targetFilter)
        );
  }, [selectedCategory, scenarioFilter, targetFilter]);

  // Calculate totals only for active credits
  const totals = useMemo(() => {
    const activeItems = filteredCards.filter(item => activeCredits[item.creditName]);
    
    const hard = activeItems.reduce((sum, d) => sum + (d.hard || 0), 0);
    const soft = activeItems.reduce((sum, d) => sum + (d.soft || 0), 0);
    const opex = activeItems.reduce((sum, d) => sum + (d.opexCosts || 0), 0);
    const budget1 = activeItems.reduce((sum, d) => sum + (d.budgetYearImpact || 0), 0);
    const budget10 = activeItems.reduce((sum, d) => sum + (d.budget10YrImpact || 0), 0);
    const position = activeItems.reduce((sum, d) => sum + (d.position || 0), 0);
    const total = hard + soft;

    return {
      hard,
      soft,
      opex,
      total,
      budget1,
      budget10,
      position,
      hardPct: total ? (hard / total) * 100 : 0,
      softPct: total ? (soft / total) * 100 : 0,
      impactPct: total ? (budget10 / total) * 100 : 0,
      positionPct: total ? (position / total) * 100 : 0,
    };
  }, [filteredCards, activeCredits]);

  // Toggle individual credit on/off
  const toggleCredit = (creditName) => {
    setActiveCredits(prev => ({
      ...prev,
      [creditName]: !prev[creditName]
    }));
  };

  // Prepare data for scenario comparison modal
  const baselineData = leedData.filter(
    (d) => d.leedOrBau === "Baseline Best Practice"
  );
  const optimizedData = leedData.filter((d) => d.leedOrBau === "LEED-Induced");

  // Calculate total credits for active filtered items
  const totalCredits = filteredCards
    .filter(item => activeCredits[item.creditName])
    .reduce((sum, d) => sum + (d.credits || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 md:p-6">
        {/* Filters Section */}
        <FilterBar
          categories={categories}
          onCategoryChange={setSelectedCategory}
          onScenarioChange={setScenarioFilter}
          onTargetChange={setTargetFilter}
          selectedCategory={selectedCategory}
          scenarioFilter={scenarioFilter}
          targetFilter={targetFilter}
        />

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{selectedCategory}</h1>

          <div className="flex flex-wrap items-center gap-4">
            {/* Commercial Info Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={showCommercial}
                onChange={setShowCommercial}
                className={`${
                  showCommercial ? "bg-blue-600" : "bg-gray-300"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    showCommercial ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                />
              </Switch>
              <span className="text-sm text-gray-700">Show Commercial Info</span>
            </div>

            {/* Target Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="target-filter" className="text-sm text-gray-700 font-medium">
                Target:
              </label>
              <select
                id="target-filter"
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Action Buttons */}
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

        {/* Total Credits Display */}
        <div className="mb-4 text-sm text-gray-700 font-medium">
          Target Credits: <span className="font-bold text-indigo-700">{totalCredits}</span>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-lg text-center shadow-sm">
            <p className="text-sm text-slate-600">Hard Cost</p>
            <p className="text-xl font-bold text-blue-600">
              {totals.hard.toFixed(2)}% <span className="text-sm">({totals.hardPct.toFixed(1)}%)</span>
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center shadow-sm">
            <p className="text-sm text-slate-600">Soft Cost</p>
            <p className="text-xl font-bold text-green-600">
              {totals.soft.toFixed(2)}% <span className="text-sm">({totals.softPct.toFixed(1)}%)</span>
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center shadow-sm">
            <p className="text-sm text-slate-600">OpEx Impact</p>
            <p className="text-xl font-bold text-purple-600">
              {totals.opex.toFixed(2)}%
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center shadow-sm">
            <p className="text-sm text-slate-600">Total Cost</p>
            <p className="text-xl font-bold text-orange-600">
              {totals.total.toFixed(2)}%
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-center shadow-sm">
            <p className="text-sm text-slate-600 flex items-center justify-center">
              LEED Position
              <span className="ml-1 text-gray-400 cursor-help" title="10-Year Impact minus Total Costs">
                ⓘ
              </span>
            </p>
            <p className={`text-xl font-bold ${totals.position >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totals.position.toFixed(2)}% <span className="text-sm">({totals.positionPct.toFixed(1)}%)</span>
            </p>
          </div>
        </div>

        {/* Waterfall Chart Visualization */}
        <WaterfallChart totals={totals} />

        {/* LEED Credit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {filteredCards.map((item, idx) => (
            <Card 
              key={`${item.creditName}-${idx}`}
              item={item} 
              showCommercialData={showCommercial}
              isActive={activeCredits[item.creditName]}
              onToggle={() => toggleCredit(item.creditName)}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <ScenarioComparison
        open={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        baselineData={baselineData}
        optimizedData={optimizedData}
      />
      <MethodologyModal
        open={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
        content={
          <div className="space-y-2">
            <p>
              We calculate ROI using a 10-year cost-benefit model based on
              CapEx, OpEx, and projected savings.
            </p>
            <p>
              Baseline = standard practices, Optimized = LEED-induced investments.
            </p>
          </div>
        }
      />
    </div>
  );
}