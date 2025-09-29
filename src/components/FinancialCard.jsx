import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

// Map textColor classes to matching border & glow colors
const colorMap = {
  "text-green-600": {
    border: "border-green-200",
    ring: "ring-green-300/50",
    shadow: "shadow-green-100"
  },
  "text-red-600": {
    border: "border-red-200",
    ring: "ring-red-300/50",
    shadow: "shadow-red-100"
  },
  "text-yellow-600": {
    border: "border-yellow-200",
    ring: "ring-yellow-300/50",
    shadow: "shadow-yellow-100"
  },
  "text-blue-600": {
    border: "border-blue-200",
    ring: "ring-blue-300/50",
    shadow: "shadow-blue-100"
  },
  default: {
    border: "border-slate-200",
    ring: "ring-slate-300/50",
    shadow: "shadow-slate-100"
  }
};

export default function FinancialCard({
  label,
  value,
  icon: Icon,
  bgGradient,
  textColor,
  tooltip,
  isPercentage,
  costView
}) {
  const count = useMotionValue(0);
  // const rounded = useTransform(count, (latest) => {
  //   const fixed = Math.round(latest * 100) / 100;
  //   return isPercentage ? `${fixed.toFixed(2)}%` : fixed.toLocaleString();
  // });

  const rounded = useTransform(count, (latest) => {
    const fixed = Math.round(latest * 100) / 100;
    return costView === "absolute"
      ? fixed.toLocaleString()
      :  isPercentage ? `${fixed.toFixed(2)}%` : fixed.toLocaleString();
  });

  


  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut"
    });
    return controls.stop;
  }, [value, count]);

  const styles = colorMap[textColor] || colorMap.default;

  return (
    <motion.div
      variants={cardVariants}
      className={`relative p-5 rounded-2xl bg-gradient-to-br ${bgGradient} 
        border ${styles.border} ${styles.shadow} backdrop-blur-sm transition-all duration-300 
        hover:shadow-lg hover:-translate-y-1 hover:ring-2 ${styles.ring}`}
    >
      {/* Icon Badge */}
      {Icon && (
        <div className="absolute -top-3 -left-3 bg-white p-2 rounded-xl shadow-md">
          <Icon className="h-5 w-5 text-slate-600" />
        </div>
      )}

      {/* Label */}
      <p className="text-sm font-semibold text-slate-700 flex items-center justify-center mb-1 tracking-wide">
        {label}
        {tooltip && (
          <span
            className="ml-1 text-gray-400 cursor-help hover:text-gray-600"
            title={tooltip}
          >
            ⓘ
          </span>
        )}
      </p>

      {/* Value */}
      <motion.p
        className={`text-3xl font-extrabold ${textColor} drop-shadow-sm text-center`}
      >
        <motion.span>{rounded}</motion.span>
      </motion.p>
    </motion.div>
  );
}
