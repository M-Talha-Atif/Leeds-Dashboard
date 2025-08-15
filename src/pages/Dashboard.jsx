import { useState, useMemo, useEffect } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import WaterfallChart from "../components/WaterfallChart";
import Card from "../components/Card";
import { leedData } from "../data";
import ScenarioComparison from "../components/ScenarioComparison";
import MethodologyModal from "../components/MethodologyModal";
import { Switch } from "@headlessui/react";
import FinancialSummary from "../components/FinancialSummary";
import PerformanceInsights from "../components/PerformanceInsights";


export default function Dashboard() {
  const categories = [
    "All Categories",
    ...new Set(leedData.map((d) => d.category)), // remove duplicates
  ];

  // State management
  const [selectedCategory, setSelectedCategory] = useState("");
  const [scenarioFilter, setScenarioFilter] = useState("");
  const [multiCategories, setMultiCategories] = useState([]);

  const [targetFilter, setTargetFilter] = useState("");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [showCommercial, setShowCommercial] = useState(false);

  // Track active credits (all enabled by default)
  const [activeCredits, setActiveCredits] = useState(() =>
    leedData.reduce((acc, item) => ({ ...acc, [item.creditName]: false }), {})
  );

  const allActive = useMemo(
    () => Object.values(activeCredits).every(v => v === true),
    [activeCredits]
  );
  // ⬇️ NEW: Keyboard shortcut Shift+X
  useEffect(() => {
    const handleKeyDown = (e) => {
      // prevent toggling when typing inside inputs/textareas
      const tag = e.target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target.isContentEditable) {
        return;
      }

      if (e.shiftKey && e.key.toLowerCase() === "x") {
        e.preventDefault();
        setActiveCredits((prev) =>
          Object.fromEntries(Object.keys(prev).map((k) => [k, !allActive]))
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allActive]);


  // Filter data based on category, scenario, and target (show all cards)
  const filteredCards = useMemo(() => {
    return leedData.filter(
      (d) =>
        (!selectedCategory || selectedCategory === "All Categories" || d.category === selectedCategory) &&
        (multiCategories.length === 0 || multiCategories.includes("All Categories") || multiCategories.includes(d.category)) &&
        (!scenarioFilter || scenarioFilter === "All" || d.leedOrBau === scenarioFilter) &&
        (!targetFilter || targetFilter === "All" || d.target === targetFilter)
    );
  }, [selectedCategory, scenarioFilter, targetFilter, multiCategories]);



  // Calculate totals only for active credits
  const totals = useMemo(() => {
    const activeItems = filteredCards.filter(item => activeCredits[item.creditName]);

    // New: Total credits
    const totalCredits = activeItems.reduce((sum, d) => sum + (d.credits || 0), 0);

    const hard = activeItems.reduce((sum, d) => sum + (d.hard || 0), 0);
    const soft = activeItems.reduce((sum, d) => sum + (d.soft || 0), 0);
    const opex = activeItems.reduce((sum, d) => sum + (d.opexCosts || 0), 0);
    const budget1 = activeItems.reduce((sum, d) => sum + (d.budgetYearImpact || 0), 0);
    const budget10 = activeItems.reduce((sum, d) => sum + (d.budget10YrImpact || 0), 0);
    const position = activeItems.reduce((sum, d) => sum + (d.position || 0), 0);
    console.log("Total Credits:", totalCredits);
    console.log("Hard Costs:", hard);
    console.log("Soft Costs:", soft);
    console.log("OpEx Impact:", opex);
    console.log("Budget 1 Year:", budget1);
    console.log("Budget 10 Year:", budget10);
    console.log("Position:", position);
    const total = hard + soft;

    const totalCapex = hard + soft;

    const totalOpexImpact = activeItems.reduce(
      (sum, d) => sum + (d.budget10YrImpact || 0),
      0
    );
    const totalAssetValue = activeItems.reduce(
      (sum, d) => sum + (d?.valuePremium ?? 0),
      0
    );

    // Counts how many items have a negative budget10YrImpact
    //  (interpreted as "positive impact" for the business, since reducing costs is favorable
    const positiveImpactCredits = activeItems.filter(
      (d) => d?.budget10YrImpact < 0
    ).length;
    const positiveImpactPercentage = totalCredits
      ? (positiveImpactCredits / totalCredits) * 100
      : 0;


    return {
      hard,
      soft,
      opex,
      total,
      budget1,
      budget10,
      position,
      totalCapex,
      totalOpexImpact,
      totalAssetValue,
      totalCredits,
      positiveImpactCredits,
      positiveImpactPercentage,
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
          multiCategories={multiCategories}               // pass state
          onMultiCategoriesChange={setMultiCategories}   // pass setter
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
                className={`${showCommercial ? "bg-blue-600" : "bg-gray-300"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${showCommercial ? "translate-x-6" : "translate-x-1"
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
                <option value="">-- Select Scenario --</option>
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

        {/* Performance Insights */}

        <div className="mb-8">
          <PerformanceInsights
            positiveImpactCredits={totals.positiveImpactCredits}
            totalCredits={totals.totalCredits}
            totalHard={totals.hard}
            totalSoft={totals.soft}
            total10YearBudget={totals.budget10}
            total1YearBudget={totals.budget1}
            positiveImpactPercentage={totals.positiveImpactPercentage}
            totalOpexImpact={totals.opex}
            totalAssetValue={totals.totalAssetValue}
            totalCapex={totals.totalCapex}
            formatCurrency={(value) =>
              value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              })
            }
          />
        </div>

        {/* Financial Summary Cards */}
        <FinancialSummary totals={totals} />



        {/* Waterfall Chart Visualization */}
        <WaterfallChart totals={totals} />

        <div className="flex justify-center mt-6 mb-8">
          <button
            onClick={() =>
              setActiveCredits(prev =>
                Object.fromEntries(Object.keys(prev).map(k => [k, !allActive]))
              )
            }
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium backdrop-blur-md transition-all duration-200 transform hover:-translate-y-0.5 border ${allActive
              ? "bg-red-500/80 hover:bg-red-500 text-white border-red-400/40"
              : "bg-green-500/80 hover:bg-green-500 text-white border-green-400/40"
              } shadow-lg hover:shadow-xl`}
          >
            {/* Toggle Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {allActive ? (
                // Power off icon
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v9m0 0a9 9 0 11-6.364-2.636"
                />
              ) : (
                // Power on icon (cross)
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
            </svg>

            {/* Text */}
            <span className="tracking-wide">
              {allActive ? "Turn All Off" : "Turn All On"}
            </span>

            {/* Shortcut hint */}
            <span className="ml-2 text-xs text-white/90 bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
              ⌘ Shift + X
            </span>
          </button>
        </div>



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