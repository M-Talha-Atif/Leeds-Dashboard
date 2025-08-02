import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { animated, useSpring, config } from '@react-spring/web';

const AnimatedBar = animated(Bar);

export default function WaterfallChart({ totals }) {
  // Enhanced color scheme
  const colors = {
    hard: "#4f46e5",    // Indigo-600
    soft: "#059669",     // Emerald-600
    subtotal: "#4338ca", // Indigo-700
    impact: "#7c3aed",   // Violet-600
    positive: "#10b981", // Emerald-500
    negative: "#ef4444", // Red-500
    connector: "#e5e7eb" // Gray-200
  };

  // Prepare waterfall data with enhanced structure
  const data = [
    { 
      name: "Start", 
      value: 0, 
      type: "connector",
      fill: colors.connector
    },
    { 
      name: "Hard Cost", 
      value: -Math.abs(totals.hard),
      type: "cost",
      fill: colors.hard,
      description: "Initial construction costs"
    },
    { 
      name: "Soft Cost", 
      value: -Math.abs(totals.soft),
      type: "cost",
      fill: colors.soft,
      description: "Design and certification costs"
    },
    { 
      name: "Subtotal", 
      value: -(Math.abs(totals.hard) + Math.abs(totals.soft)),
      type: "subtotal",
      fill: colors.subtotal,
      description: "Total upfront investment"
    },
    { 
      name: "10-Year Impact", 
      value: Math.abs(totals.budget10),
      type: "benefit",
      fill: colors.impact,
      description: "Projected operational savings"
    },
    { 
      name: "LEED Position", 
      value: totals.position, 
      type: totals.position >= 0 ? "positive" : "negative",
      fill: totals.position >= 0 ? colors.positive : colors.negative,
      description: totals.position >= 0 ? "Net positive ROI" : "Net cost position"
    }
  ];

  // Calculate cumulative values with enhanced formatting
  const processedData = data.map((entry, index, array) => {
    if (index === 0) return { ...entry, start: 0, end: 0 };
    
    const previousEnd = array[index - 1].end || 0;
    const isNegative = entry.value < 0;
    
    return {
      ...entry,
      start: previousEnd,
      end: previousEnd + entry.value,
      displayValue: Math.abs(entry.value),
      formattedValue: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(Math.abs(entry.value)),
      sign: isNegative ? '-' : '+'
    };
  });

  // Animation configuration
  const barAnimation = useSpring({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: config.gentle,
    reset: true
  });

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">
        LEED Cost-Benefit Waterfall
        <span className="ml-2 text-sm font-normal text-gray-500">
          (10-year projection)
        </span>
      </h3>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={processedData} 
          barSize={70} 
          margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval={0} // Ensure all labels show
          />
          <YAxis 
            tickFormatter={(value) => `$${Math.abs(value / 1000)}k`}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          
          <Tooltip 
            content={({ active, payload }) => {
              if (!active || !payload.length) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                  <p className="font-semibold">{data.name}</p>
                  <p className="text-sm text-gray-600">{data.description}</p>
                  <p className={`mt-1 font-bold ${
                    data.value >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.sign} {data.formattedValue}
                  </p>
                </div>
              );
            }}
          />
          
          {/* Connector lines */}
          <Bar dataKey="start" stackId="a" fill="transparent" />
          
          {/* Animated main bars */}
          <AnimatedBar
            dataKey="displayValue"
            stackId="a"
            style={{
              ...barAnimation,
              transformOrigin: 'center bottom'
            }}
          >
            {processedData.map((entry, index) => (
              <Bar 
                key={`bar-${index}`}
                dataKey="displayValue"
                stackId="a"
                fill={entry.fill}
                radius={entry.type === 'subtotal' || entry.type === 'positive' || entry.type === 'negative' 
                  ? [4, 4, 0, 0] 
                  : 0}
              >
                <LabelList 
                  dataKey="formattedValue" 
                  position="top" // Changed from insideTop to top
                  fill={entry.type === 'subtotal' || entry.type === 'positive' || entry.type === 'negative' 
                    ? '#1f2937' // Dark gray for better visibility
                    : '#ffffff'}
                  fontSize={12}
                  offset={10}
                />
              
              </Bar>
            ))}
          </AnimatedBar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {['hard', 'soft', 'impact', 'positive', 'negative'].map((type) => (
          <div key={type} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: colors[type] }}
            />
            <span className="text-xs text-gray-600 capitalize">
              {type === 'hard' && 'Hard Costs'}
              {type === 'soft' && 'Soft Costs'}
              {type === 'impact' && '10-Year Impact'}
              {type === 'positive' && 'Positive Position'}
              {type === 'negative' && 'Negative Position'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}