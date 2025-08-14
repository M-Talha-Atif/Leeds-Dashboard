"use client";
import { leedData } from "../data";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  TrendingDown,
  TrendingUp,
  Layers,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function Reports() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const filteredData = leedData.filter(
    (item) =>
      item.creditName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const formatPercent = (val) => `${val.toFixed(2)}%`;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 bg-white z-10 pb-4 shadow-sm">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-7 w-7 text-slate-700" /> Reports
        </h1>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search credits or categories..."
            className="p-2 pl-10 border rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        {filteredData.length > 0 ? (
          <table className="min-w-full border">
            <thead className="bg-slate-900 text-white sticky top-0 z-10 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Credit</th>
                <th className="px-4 py-3 text-left">Target</th>
                <th className="px-4 py-3 text-left">Credits</th>
                <th className="px-4 py-3 text-left">Hard Cost</th>
                <th className="px-4 py-3 text-left">Soft Cost</th>
                <th className="px-4 py-3 text-left">CapEx</th>
                <th className="px-4 py-3 text-left">Budget 10 Year</th>
                <th className="px-4 py-3 text-left">Budget 1 Year</th>
                <th className="px-4 py-3 text-left">Value Premium</th>
                <th className="px-4 py-3 text-left">ELEV-X Position</th>
                <th className="px-4 py-3 text-left">LEED or BAU</th>
                <th className="px-4 py-3 text-left">Commercial Label</th>
                <th className="px-4 py-3 text-left">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => {
                const capex = item.hard + item.soft;

                const coloredCell = (val) => (
                  <span className="text-black font-semibold">
                    {formatPercent(val)}
                  </span>
                );

                return (
                  <motion.tr
                    key={idx}
                    className={`border-b hover:scale-[1.01] hover:shadow-md hover:bg-gray-50 transition-all duration-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-500" /> {item.category}
                    </td>
                    <td className="px-4 py-3">{item.creditName}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{item.target}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{item.credits}</td>
                    <td className="px-4 py-3 font-semibold text-black">
                      {item.hard < 0 ? (
                        <TrendingDown className="h-4 w-4 inline" />
                      ) : (
                        <TrendingUp className="h-4 w-4 inline" />
                      )}{" "}
                      {formatPercent(item.hard)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-black">
                      {item.soft < 0 ? (
                        <TrendingDown className="h-4 w-4 inline" />
                      ) : (
                        <TrendingUp className="h-4 w-4 inline" />
                      )}{" "}
                      {formatPercent(item.soft)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-black">
                      {capex < 0 ? (
                        <TrendingDown className="h-4 w-4 inline" />
                      ) : (
                        <TrendingUp className="h-4 w-4 inline" />
                      )}{" "}
                      {formatPercent(capex)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-black">
                      {item.budget10YrImpact < 0 ? (
                        <TrendingDown className="h-4 w-4 inline" />
                      ) : (
                        <TrendingUp className="h-4 w-4 inline" />
                      )}{" "}
                      {formatPercent(item.budget10YrImpact)}
                    </td>
                    <td className="px-4 py-3">
                      {coloredCell(item.budgetYearImpact)}
                    </td>
                    <td className="px-4 py-3">
                      {coloredCell(item.valuePremium)}
                    </td>
                    <td className="px-4 py-3">{coloredCell(item.position)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{item.leedOrBau}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-emerald-500 text-white">
                        {item.commercialLabel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-indigo-600 text-white">
                        {item.elevx}
                      </Badge>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
