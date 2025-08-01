export default function ExecutiveSummary({ kpis }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="p-5 rounded-xl shadow-md bg-white border">
          <h3 className="text-sm font-semibold text-gray-500">{kpi.title}</h3>
          <p className={`text-2xl font-bold ${kpi.color} mt-2`}>{kpi.value}</p>
          <p className="text-xs text-gray-400">{kpi.description}</p>
        </div>
      ))}
    </div>
  );
}
