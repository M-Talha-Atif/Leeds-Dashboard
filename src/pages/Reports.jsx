"use client";
import { leedData } from "../data";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, TrendingDown, TrendingUp, Layers, FileText, AlertCircle } from "lucide-react";

export default function Reports() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search for better UX
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const filteredData = leedData.filter(
    (item) =>
      item.creditName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const formatCurrency = (val) => `$${val.toFixed(2)}M`;

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
            <thead className="bg-slate-900 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Credit</th>
                <th className="px-4 py-3 text-left">CapEx</th>
                <th className="px-4 py-3 text-left">10Y OpEx</th>
                <th className="px-4 py-3 text-left">LEED</th>
                <th className="px-4 py-3 text-left">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
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
                  <td className="px-4 py-3 text-amber-700 font-semibold">{formatCurrency(item.capex.hard + item.capex.soft)}</td>
                  <td className={`px-4 py-3 font-semibold flex items-center gap-1 ${item.opex.impact10Yr < 0 ? "text-green-600" : "text-red-600"}`}>
                    {item.opex.impact10Yr < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                    {formatCurrency(item.opex.impact10Yr)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{item.leed}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={item.verdict.includes("High Cost") ? "bg-red-500 text-white" : "bg-green-500 text-white"}>
                      {item.verdict}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm text-gray-400">Try adjusting your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
