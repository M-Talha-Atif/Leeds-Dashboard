// components/CreditTogglePanel.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";

export default function CreditTogglePanel({ 
  creditsByCategory = {}, 
  activeCredits, 
  onToggleCredit,
  onToggleCategory 
}) {
  const [expandedCategories, setExpandedCategories] = useState([]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  return (
    <div className="w-full lg:w-1/3 bg-white shadow rounded-lg p-4 h-fit">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">LEED Credits</h2>

      <div className="space-y-2">
        {Object.entries(creditsByCategory).map(([category, credits]) => {
          const categoryCredits = credits.map(c => c.id);
          const allSelected = categoryCredits.every(id => activeCredits.includes(id));
          const someSelected = categoryCredits.some(id => activeCredits.includes(id));

          return (
            <div key={category} className="border rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    indeterminate={!allSelected && someSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleCategory(category, allSelected);
                    }}
                    className="w-4 h-4 mr-2"
                  />
                  <span className="font-medium">{category}</span>
                </div>
                {expandedCategories.includes(category) ? <ChevronUp size={18} /> : <ChevronRight size={18} />}
              </div>

              {expandedCategories.includes(category) && (
                <div className="p-2 space-y-1">
                  {credits.map(credit => (
                    <div 
                      key={credit.id} 
                      className="flex items-center pl-6 py-1 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        id={`credit-${credit.id}`}
                        checked={activeCredits.includes(credit.id)}
                        onChange={() => onToggleCredit(credit.id)}
                        className="w-4 h-4 mr-2"
                      />
                      <label htmlFor={`credit-${credit.id}`} className="text-sm">
                        {credit.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}