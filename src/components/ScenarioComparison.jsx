"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import ComparisonDashboard from "./ComparisonDashboard";

export default function ScenarioComparison({ open, onClose, baselineData, optimizedData }) {
  const hasData = baselineData?.length && optimizedData?.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] xl:max-w-[85vw] h-[95vh] p-0 rounded-lg">
        <DialogHeader className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 sticky top-0 z-10">
          <DialogTitle className="text-2xl font-bold text-gray-800">Scenario Comparison</DialogTitle>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="h-[calc(100%-73px)] overflow-auto p-6 bg-white">
          {hasData ? (
            <ComparisonDashboard baselineData={baselineData} optimizedData={optimizedData} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
              <p className="text-lg font-medium">No data available for comparison.</p>
              <p className="text-sm">Check your scenario filters.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
