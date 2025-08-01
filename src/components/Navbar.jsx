import { useState } from "react";
import { cn } from "@/lib/utils"; // shadcn utility

export default function Navbar({ categories, onSelect }) {
  const [active, setActive] = useState(categories[0]);

  const handleClick = (cat) => {
    setActive(cat);
    onSelect(cat);
  };

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-800 relative">
      {/* Gradient Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-400"></div>

      <div className="container mx-auto flex items-center justify-between px-6 py-3 relative z-10">
        {/* Logo / Title */}
        <h1 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 to-green-300 bg-clip-text text-transparent">
          LEED Dashboard
        </h1>

        {/* Nav Items */}
        <div className="flex gap-4 relative">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => handleClick(cat)}
              className={cn(
                "relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                active === cat
                  ? "text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              )}
            >
              {cat}
              {/* Active Underline */}
              {active === cat && (
                <span className="absolute left-0 right-0 -bottom-1 h-[3px] rounded-full bg-gradient-to-r from-blue-400 to-green-300 transition-all duration-300"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
