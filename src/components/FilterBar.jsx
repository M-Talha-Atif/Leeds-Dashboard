import { useState } from "react";
import { ChevronDown } from "lucide-react";
import MultiCategorySelector from "./MultiCategorySelector";
import { motion } from "framer-motion";

export default function FilterBar({ categories, onCategoryChange, onScenarioChange, multiCategories, onMultiCategoriesChange, tierFilter, onTierChange,
  ownershipFilter, onOwnershipChange
 }) {
  const scenarios = ["All", "Baseline Best Practice", "LEED-Induced"];

  const [selectedScenario, setSelectedScenario] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    onCategoryChange(e.target.value);
  };

  const handleScenarioChange = (e) => {
    setSelectedScenario(e.target.value);
    onScenarioChange(e.target.value);
  };

  return (
    <motion.div
      className="flex flex-wrap gap-6 bg-white shadow-sm p-5 rounded-xl border border-gray-200 mb-6"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Category Dropdown */}
      <motion.div
        className="flex flex-col min-w-[200px] flex-1 md:flex-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <div className="relative">
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(59,130,246,0.4)" }}
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full md:w-64 p-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 appearance-none transition"
          >
            <option value="">-- Select Category --</option>
            <option value="All Categories">All Categories</option>
            {categories
              .filter((cat) => cat !== "All Categories")
              .map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
          </motion.select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
        </div>
      </motion.div>

      {/* Tier Dropdown */}
      <motion.div
        className="flex flex-col min-w-[200px] flex-1 md:flex-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tier</label>
        <div className="relative">
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(251,191,36,0.4)" }}
            value={tierFilter}
            onChange={(e) => onTierChange(e.target.value)}
            className="w-full md:w-64 p-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 appearance-none transition"
          >
            <option value="">-- Select Tier --</option>
            <option value="All">All</option>
            <option value="Tier 1">Tier 1</option>
            <option value="Tier 2">Tier 2</option>
            <option value="Tier 3">Tier 3</option>
          </motion.select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
        </div>
      </motion.div>


      {/* Scenario Dropdown */}
      <motion.div
        className="flex flex-col min-w-[200px] flex-1 md:flex-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">Scenario</label>
        <div className="relative">
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(34,197,94,0.4)" }}
            value={selectedScenario}
            onChange={handleScenarioChange}
            className="w-full md:w-64 p-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 appearance-none transition"
          >
            <option value="">-- Select Scenario --</option>
            {scenarios.map((sc, idx) => (
              <option key={idx} value={sc}>
                {sc}
              </option>
            ))}
          </motion.select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
        </div>
      </motion.div>
      {/* Multi-Category Selector */}
      <motion.div
        className="flex flex-col min-w-[200px] flex-1 md:flex-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Multi-Select Categories
        </label>
        <MultiCategorySelector
          categories={categories}
          selected={multiCategories}
          onChange={onMultiCategoriesChange}
        />
      </motion.div>

      {/* Ownership Sensitivity Dropdown */}
      <motion.div className="flex flex-col min-w-[200px]">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Ownership</label>
        <select value={ownershipFilter} onChange={(e) => onOwnershipChange(e.target.value)} className="w-full md:w-64 p-3 rounded-lg border">
          <option value="">All</option>
          <option value="N/A">N/A</option>
          <option value="Community-only O&M">Community-only O&M</option>
          <option value="Building O&M">Building O&M</option>
          <option value="Mixed (Community + Buildings)">Mixed (Community + Buildings)</option>
        </select>
      </motion.div>



      {/* Certification Full Bar */}
      <motion.div
        className="flex-1 bg-gradient-to-r from-gray-50 via-blue-50 to-green-50 p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between min-w-[300px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(34,197,94,0.15)" }}
      >
        {/* Top Row */}
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div>
            <div className="text-sm uppercase font-semibold text-gray-500">Certification Scheme</div>
            <div className="text-lg font-bold text-gray-800">LEED Communities Plan and Design</div>
          </div>

          <div>
            <div className="text-sm uppercase font-semibold text-gray-500">Stage</div>
            <div className="text-lg font-bold text-amber-600">Pre Certification</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm uppercase font-semibold text-gray-500">Progress</div>
            <span className="text-lg font-bold text-green-600">95%</span>
          </div>
        </div>

        {/* Progress Bar with Motion Effects */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner relative">
          {/* Main progress fill */}
          <motion.div
            className="h-3 rounded-full bg-green-500"
            style={{ width: "95%" }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(34,197,94,0.4)",
                "0 0 8px rgba(34,197,94,0.6)",
                "0 0 0px rgba(34,197,94,0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Shimmer effect */}
          <motion.div
            className="absolute top-0 left-0 h-3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{ width: "30%" }}
            animate={{ x: ["-30%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
