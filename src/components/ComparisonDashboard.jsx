import CategoryChart from "./CategoryChart";

export default function ComparisonDashboard({ baselineData, optimizedData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full w-full">
      {/* Baseline Scenario */}
      <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 w-full">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Baseline Scenario</h2>
        <CategoryChart data={baselineData} height={600} />
      </div>

      {/* Optimized Scenario */}
      <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 w-full">
        <h2 className="text-xl font-bold text-green-600 mb-4">Optimized Scenario</h2>
        <CategoryChart data={optimizedData} height={600} />
      </div>
    </div>
  );
}
