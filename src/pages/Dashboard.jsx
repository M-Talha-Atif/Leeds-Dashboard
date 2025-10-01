import { useState, useMemo, useEffect, useCallback } from "react";
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
import { baselineCosts } from "@/baselineCosts";



export default function Dashboard() {
  const categories = [
    "All Categories",
    ...new Set(leedData.map((d) => d.category)), // remove duplicates
  ];

  // State management
  const [selectedCategory, setSelectedCategory] = useState("");
  const [scenarioFilter, setScenarioFilter] = useState("");
  const [tierFilter, setTierFilter] = useState(""); // phase 2- filter by tier
  //phase 2
  const [dSellOn, setDSellOn] = useState(false);                // D-Sell on/off
  const [costView, setCostView] = useState("percent");         // "percent" | "absolute"
  const [ownershipFilter, setOwnershipFilter] = useState("");  // filter by ownershipSensitivity
  const [costSource, setCostSource] = useState("REFINED"); // "REFINED" | "RAW"

  const [multiCategories, setMultiCategories] = useState([]);

  const [targetFilter, setTargetFilter] = useState("");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [showCommercial, setShowCommercial] = useState(false);

  const parsePct = (v) => {
    if (v == null) return 0;
    if (typeof v === "number") return v;
    const s = String(v).trim();
    if (s.endsWith("%")) return parseFloat(s.replace("%", "")) / 100;
    return parseFloat(s) || 0;
  };

  const applyDSell = useCallback((ownership, value) => {
    if (!dSellOn) return value;
    switch ((ownership || "").trim()) {
      case "Building O&M": return value * 0.31;
      case "Mixed (Community + Buildings)": return value * 0.318;
      case "Community-only O&M":
      case "N/A":
      default: return value;
    }
  }, [dSellOn]);

  const totalBaselineCosts = useMemo(() => {
  const lookupAsset = "Community + ALL";
  const hardBase = baselineCosts.hard[lookupAsset] ?? 0;
  const softBase = baselineCosts.soft[lookupAsset] ?? 0;
  const opexBase = baselineCosts.opex[lookupAsset] ?? 0;

  return hardBase + softBase + opexBase;
}, []);

  const normalizeAssetClass = (assetClass, costSource) => {
    console.log(assetClass)
    if (!assetClass) return "Community + ALL";

    if (costSource === "REFINED") {
      // force everything into "Community + ALL"
      if (assetClass === "Community" || assetClass === "Community + ALL") {
        console.log(true)
        return "Community + ALL";
      }
    }
    console.log("after")
    return assetClass;
  };


  const calculateImpacts = useCallback((d) => {
    // parse percent values
    const hardPct = parsePct(d.hard);
    const softPct = parsePct(d.soft);
    const opexPct = parsePct(d.opexCosts);

    // console.groupCollapsed(`📊 Calculating impacts for: ${d.creditName || "Unnamed Credit"}`);
    console.log("🔹 Raw Percent Inputs", {
      hardPct,
      softPct,
      opexPct,
      ownershipSensitivity: d.ownershipSensitivity,
      assetClass: d.assetClass,
      costSource: d.costSource,
    });

    // asset class lookup
    const lookupAsset = normalizeAssetClass(d.assetClass, costSource);

    console.log(lookupAsset)


    // console.log("🏷️ Lookup Asset:", lookupAsset);

    const hardBase = costSource == "RAW" ? baselineCosts.opex[lookupAsset] : baselineCosts.hard[lookupAsset] ?? 0;
    const softBase = costSource == "RAW" ? baselineCosts.opex[lookupAsset] : baselineCosts.soft[lookupAsset] ?? 0;
    const opexBase = baselineCosts.opex[lookupAsset] ?? 0;

    console.log("📌 Baseline Costs", { hardBase, softBase, opexBase });

    // apply D-Sell
    const adjustedOpexPct = applyDSell(d.ownershipSensitivity, opexPct);
    console.log("⚖️ Adjusted Opex % (after D-Sell):", adjustedOpexPct);

    // refined logic
    const isRefined = costSource === "REFINED";
    console.log("🧮 Is Refined Mode?", isRefined);

    // absolute amounts
    const hardAbs = isRefined
      ? (hardPct / 100) * hardBase                // already normalized in parsePct
      : applyDSell(
        d.ownershipSensitivity,
        d.rawHard != null ? Number(d.rawHard) : (hardPct / 100) * hardBase
      );

    const softAbs = isRefined
      ? (softPct / 100) * softBase
      : applyDSell(
        d.ownershipSensitivity,
        d.rawSoft != null ? Number(d.rawSoft) : (softPct / 100) * softBase
      );

    const opexAbs = isRefined ? (adjustedOpexPct / 100) * opexBase : (adjustedOpexPct / 100) * opexBase;




    console.log("💵 Absolute Costs", { hardAbs, softAbs, opexAbs });

    const budgetYearAbs = hardAbs + softAbs + opexAbs;
    const budget10Abs = hardAbs + softAbs + 7.36 * opexAbs;

    // console.log("📅 Budgets (Absolute)", { budgetYearAbs, budget10Abs });

    // percent-level aggregates
    const budgetYearPct = hardPct + softPct + adjustedOpexPct;
    const budget10Pct = hardPct + softPct + 7.36 * adjustedOpexPct;

    // console.log("📊 Budgets (Percent)", { budgetYearPct, budget10Pct });
    // console.groupEnd();


    // now compute valuePremium correctly
    const valuePremium =
      costView === "absolute"
        ? ((d.valuePremium ?? 0) * totalBaselineCosts ) / 100
        : (d.valuePremium ?? 0);

    console.log("💎 Value Premium:", valuePremium);

    const position = costView === "absolute" ? (budget10Abs) - (0.5 * (valuePremium ?? 0)) : (budget10Pct) - (0.5 * (valuePremium ?? 0));

    return {
      hardPct, softPct, opexPct, adjustedOpexPct,
      hardAbs, softAbs, opexAbs,
      budgetYearAbs, budget10Abs,
      budgetYearPct, budget10Pct,
      valuePremium,
      position

    };
  }, [applyDSell, costSource, costView]);

  // Track active credits (all enabled by default)
  const [activeCredits, setActiveCredits] = useState(() =>
    leedData.reduce((acc, item) => ({ ...acc, [item.creditName]: false }), {})
  );

  const allActive = useMemo(
    () => Object.values(activeCredits).every(v => v === true),
    [activeCredits]
  );
  //  NEW: Keyboard shortcut Shift+X
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
  // 2. Then use it inside filteredCards
  const filteredCards = useMemo(() => {
    return leedData
      .filter((d) =>
        (!selectedCategory || selectedCategory === "All Categories" || d.category === selectedCategory) &&
        (multiCategories.length === 0 || multiCategories.includes("All Categories") || multiCategories.includes(d.category)) &&
        (!scenarioFilter || scenarioFilter === "All" || d.leedOrBau === scenarioFilter) &&
        (!targetFilter || targetFilter === "All" || d.target === targetFilter) &&
        (!tierFilter || tierFilter === "All" || d.tier === tierFilter) &&
        (!ownershipFilter || ownershipFilter === "All" || d.ownershipSensitivity === ownershipFilter)
      )
      .map((d) => {
        // compute both percent and absolute values
        const imp = calculateImpacts(d);

        return {
          ...d,
          // keep original percent fields too (as decimals)
          hardPct: imp.hardPct,
          softPct: imp.softPct,
          opexPct: imp.opexPct,
          adjustedOpexPct: imp.adjustedOpexPct,

          // absolute numbers
          hardAbs: imp.hardAbs,
          softAbs: imp.softAbs,
          opexAbs: imp.opexAbs,
          budgetYearAbs: imp.budgetYearAbs,
          budget10Abs: imp.budget10Abs,

          // percent aggregates for UI if needed
          budgetYearPct: imp.budgetYearPct,
          budget10Pct: imp.budget10Pct,

          // position
          position: imp.position,
          valuePremium: imp.valuePremium,
        };
      });
  }, [selectedCategory, multiCategories, scenarioFilter, targetFilter, tierFilter, ownershipFilter, calculateImpacts])


  // Calculate totals only for active credits
  const totals = useMemo(() => {
    const activeItems = filteredCards.filter(item => activeCredits[item.creditName]);

    // New: Total credits
    const totalCredits = activeItems.reduce((sum, d) => sum + (d.credits || 0), 0);
    const activeCount = activeItems.length;

    const hard = activeItems.reduce((sum, d) => sum + (costView === "absolute" ? (d.hardAbs || 0) : (d.hardPct || 0)), 0);
    const soft = activeItems.reduce((sum, d) => sum + (costView === "absolute" ? (d.softAbs || 0) : (d.softPct || 0)), 0);
    const opex = activeItems.reduce((sum, d) => sum + (costView === "absolute" ? (d.opexAbs || 0) : (d.adjustedOpexPct || 0)), 0);

    // Apply formulas
    // const budget1 = hard + soft + opex;
    // const budget10 = (7.36 * opex) + hard + soft;
    const budget1 = activeItems.reduce(
      (sum, d) => sum + (costView === "absolute" ? d.budgetYearAbs : d.budgetYearPct),
      0
    );

    const budget10 = activeItems.reduce(
      (sum, d) => sum + (costView === "absolute" ? d.budget10Abs : d.budget10Pct),
      0
    );


    // const position = activeItems.reduce((sum, d) => sum + (d.position || 0), 0);

    const totalValuePremium = activeItems.reduce(
      (sum, d) => sum + (d.valuePremium ?? 0),
      0
    );

    console.log("Total Value Premium:", totalValuePremium);

    const position = budget10 - 0.5 * totalValuePremium; // <-- apply once at totals level

    // const position = budget10 - (0.5 * d.valuePremium)
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
      (sum, d) => sum + (costView === "absolute" ? d.budget10Abs : d.budget10Pct),
      0
    );

    const totalAssetValue = activeItems.reduce(
      (sum, d) => sum + (d?.valuePremium ?? 0),
      0
    );

    // Counts how many items have a negative budget10YrImpact
    //  (interpreted as "positive impact" for the business, since reducing costs is favorable
    // const positiveImpactCredits = activeItems.filter(
    //   (d) => d?.budget10YrImpact < 0
    // ).length;
    const positiveImpactCredits = activeItems.filter(
      (d) => (costView === "absolute" ? d.budget10Abs : d.budget10Pct) < 0
    ).length;

    const positiveImpactPercentage = totalCredits
      ? (positiveImpactCredits / totalCredits) * 100
      : 0;


    return {
      hard,
      soft,
      opex,
      total,
      activeCount,
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
  }, [filteredCards, activeCredits, costView]);

  // Toggle individual credit on/off
  const toggleCredit = (creditName) => {
    setActiveCredits(prev => ({
      ...prev,
      [creditName]: !prev[creditName]
    }));
  };

  const baselineData = leedData
    .filter((d) => d.leedOrBau === "Baseline Best Practice")
    .map((d) => ({ ...d, ...calculateImpacts(d) }));

  const optimizedData = leedData
    .filter((d) => d.leedOrBau === "LEED-Induced")
    .map((d) => ({ ...d, ...calculateImpacts(d) }));



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
          tierFilter={tierFilter}                  // state
          onTierChange={setTierFilter}             // setter
          ownershipFilter={ownershipFilter}
          onOwnershipChange={setOwnershipFilter}
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

            {/* D-Sell toggle */}
            <div className="flex items-center space-x-2">
              <Switch checked={dSellOn} onChange={setDSellOn} className={`${dSellOn ? "bg-indigo-600" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}>
                <span className={`${dSellOn ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full`} />
              </Switch>
              <span className="text-sm text-gray-700">D-Sell Simulation</span>
            </div>

            {/* Cost View toggle */}
            <div className="flex rounded-xl bg-gray-100 p-1 shadow-sm">
              <button
                disabled={costSource === "RAW"}
                onClick={() => setCostView("percent")}
                className={`flex-1 px-4 py-1.5 rounded-lg text-sm font-medium transition
    ${costSource === "RAW"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                    : costView === "percent"
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
              >
                % View
              </button>

              <button
                onClick={() => setCostView("absolute")}
                className={`flex-1 px-4 py-1.5 rounded-lg text-sm font-medium transition 
      ${costView === "absolute"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-200"}`}
              >
                Absolute
              </button>
            </div>


            <div className="flex items-center gap-2">
              {["", "REFINED", "RAW"].map((mode) => (
                <button
                  key={mode || "DEFAULT"}
                  onClick={() => setCostSource(mode)}
                  className={`px-3 py-1 rounded-lg transition
        ${costSource === mode
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {mode === "" ? "Default" : mode}
                </button>
              ))}
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
            totalRows={totals.activeCount}
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
        <FinancialSummary totals={totals} costView={costView} />



        {/* Waterfall Chart Visualization */}
        <WaterfallChart totals={totals} costView={costView} />

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
              costView={costView}   // ⬅️ add this
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