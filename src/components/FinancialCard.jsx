import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function FinancialCard({
  label,
  value,
  subValue,
  icon: Icon,
  bgGradient,
  textColor,
  tooltip,
  isPercentage
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    isPercentage ? `${latest.toFixed(2)}%` : latest.toLocaleString()
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut"
    });
    return controls.stop;
  }, [value, count]);

  return (
    <motion.div
      variants={cardVariants}
      className={`relative p-5 rounded-2xl shadow-md bg-gradient-to-br ${bgGradient} border border-white/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
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
        {subValue !== undefined && (
          <span className="text-sm text-slate-500 font-medium">
            {" "}
            ({subValue.toFixed(1)}%)
          </span>
        )}
      </motion.p>
    </motion.div>
  );
}
