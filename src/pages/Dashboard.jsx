import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import WaterfallChart from "../components/WaterfallChart";
import Card from "../components/Card";
import { leedData } from "../data";
import ScenarioComparison from "../components/ScenarioComparison";
import MethodologyModal from "../components/MethodologyModal";
import CreditTogglePanel from "../components/CreditTogglePanel";
import { animated, useSpring, config } from '@react-spring/web';




export default function Dashboard() {


  const categories = [
    "Overall Data",
    "All Categories",
    ...new Set(leedData.map((d) => d.category))
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [scenarioFilter, setScenarioFilter] = useState("All");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [activeCredits, setActiveCredits] = useState(leedData.map(d => d.creditName));

  // Group credits by category
  const creditsByCategory = useMemo(() => {
    return leedData.reduce((acc, credit) => {
      if (!acc[credit.category]) {
        acc[credit.category] = [];
      }
      acc[credit.category].push({
        id: credit.creditName,
        name: credit.creditName
      });
      return acc;
    }, {});
  }, []);

  const toggleCredit = (creditId) => {
    setActiveCredits(prev =>
      prev.includes(creditId)
        ? prev.filter(id => id !== creditId)
        : [...prev, creditId]
    );
  };

  const toggleCategory = (category, isCurrentlySelected) => {
    const categoryCredits = creditsByCategory[category].map(c => c.id);

    setActiveCredits(prev => {
      if (isCurrentlySelected) {
        // Remove all credits in this category
        return prev.filter(id => !categoryCredits.includes(id));
      } else {
        // Add all credits in this category (without duplicates)
        return [...new Set([...prev, ...categoryCredits])];
      }
    });
  };

  const categoryFiltered =
    selectedCategory === "Overall Data"
      ? leedData  // Show all data when "Overall Data" is selected
      : leedData.filter(
        (d) =>
          (selectedCategory === "All Categories" || d.category === selectedCategory) &&
          (scenarioFilter === "All" || d.leed === scenarioFilter) &&
          activeCredits.includes(d.creditName)
      );

  const totals = useMemo(() => {
    const filteredData = selectedCategory === "Overall Data"
      ? leedData.filter(d => activeCredits.includes(d.creditName))
      : categoryFiltered;

    const hard = filteredData.reduce((sum, d) => sum + (d.capex?.hard || 0), 0);
    const soft = filteredData.reduce((sum, d) => sum + (d.capex?.soft || 0), 0);
    const budget1 = filteredData.reduce((sum, d) => sum + (d.opex?.impact1Yr || 0), 0);
    const budget10 = filteredData.reduce((sum, d) => sum + (d.opex?.impact10Yr || 0), 0);
    const position = budget10 - (hard + soft);
    const total = hard + soft;

    return {
      hard,
      soft,
      total,
      budget1,
      budget10,
      position,
      hardPct: total ? (hard / total) * 100 : 0,
      softPct: total ? (soft / total) * 100 : 0,
      impactPct: total ? (budget10 / total) * 100 : 0,
      positionPct: total ? (position / total) * 100 : 0,
    };
  }, [categoryFiltered, selectedCategory, activeCredits]);

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

        {/* Credit Toggle Panel + Chart */}
        <div className="flex flex-col lg:flex-row gap-6">
          <CreditTogglePanel
            creditsByCategory={creditsByCategory}
            activeCredits={activeCredits}
            onToggleCredit={toggleCredit}
            onToggleCategory={toggleCategory}
          />

          <div className="flex-1">
            {/* Totals summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-slate-600">Hard Cost</p>
                <p className="text-xl font-bold text-blue-600">
                  ${totals.hard.toFixed(2)} <span className="text-sm">({totals.hardPct.toFixed(1)}%)</span>
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-slate-600">Soft Cost</p>
                <p className="text-xl font-bold text-green-600">
                  ${totals.soft.toFixed(2)} <span className="text-sm">({totals.softPct.toFixed(1)}%)</span>
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="text-sm text-slate-600">10-Year Impact</p>
                <p className="text-xl font-bold text-purple-600">
                  ${totals.budget10.toFixed(2)} <span className="text-sm">({totals.impactPct.toFixed(1)}%)</span>
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <p className="text-sm text-slate-600">Total Cost</p>
                <p className="text-xl font-bold text-orange-600">
                  ${totals.total.toFixed(2)}
                </p>
              </div>
              {/* New Position Metric Card */}
              <div className="p-3 bg-indigo-50 rounded-lg text-center">
                <p className="text-sm text-slate-600 flex items-center justify-center">
                  LEED Position
                  <span className="ml-1 text-gray-400 cursor-help" title="10-Year Impact minus Total Costs">
                    ⓘ
                  </span>
                </p>
                <p className={`text-xl font-bold ${totals.position >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  ${totals.position.toFixed(2)} <span className="text-sm">({totals.positionPct.toFixed(1)}%)</span>
                </p>
              </div>
            </div>

            {/* Waterfall Chart */}
            <WaterfallChart totals={totals} />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {categoryFiltered.map((item, idx) => (
            <Card key={idx} item={item} />
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
          <div>
            <p>
              We calculate ROI using a 10-year cost-benefit model based on
              CapEx, OpEx, and projected savings.
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
