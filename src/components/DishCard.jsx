import { useState } from "react";

const SCORE_MAX = 10; // The backend uses a 0-10 weighted scale now

const DishCard = ({ dish, isFeatured = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { dish: dishData, notes, score_breakdown } = dish || {};

  if (!dish || !dishData) {
    return (
      <div className="soft-card p-6 md:p-8 flex flex-col gap-2 spell-fade-up border-2 border-[var(--color-secondary-light)]">
        <h3 className="font-display text-2xl font-bold text-[var(--color-text-main)]">{dish?.name || "Unknown Dish"}</h3>
        <p className="font-sans text-sm font-bold text-[var(--color-secondary)] uppercase tracking-wide">{dish?.meal_type || "Meal"}</p>
      </div>
    );
  }

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  return (
    <div 
      className={`relative transition-all duration-500 spell-fade-up 
      ${isFeatured ? "scale-[1.02] z-20" : "z-10"}`}
    >
      {/* Featured Badge/Sticker - Outside overflow boundary */}
      {isFeatured && (
        <div className="absolute -top-4 -left-4 z-40 pointer-events-none -rotate-6 drop-shadow-2xl">
          <div className="bg-white/95 backdrop-blur-sm text-rose-500 font-display font-black text-[12px] px-4 py-2 rounded-xl shadow-xl shadow-rose-900/20 uppercase tracking-widest border-2 border-rose-50 flex items-center gap-2 animate-bounce-subtle">
            <span className="text-lg text-amber-500 animate-pulse">✨</span>
            Today's Pick
          </div>
        </div>
      )}

      {/* Main Card Body */}
      <div className={`soft-card overflow-hidden flex flex-col h-full relative
        ${isFeatured 
          ? "bg-gradient-to-br from-[#f43f5e] via-[#fb7185] to-[#f43f5e] text-white shadow-2xl shadow-rose-200/50 border-none ring-4 ring-white/20" 
          : "bg-white border-slate-100 hover:border-rose-100"}`}
      >
        {/* Shine/Sweep Decorative Effect */}
        {isFeatured && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine" />
          </div>
        )}

        {/* Background Decorative Element */}
        {isFeatured && (
          <div className="absolute -top-12 -left-12 opacity-10 pointer-events-none animate-spin-slow">
            <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        )}

        <div className={`p-8 md:p-10 flex flex-col gap-6 relative z-10 h-full`}>
          {/* Header Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md
                ${isFeatured 
                  ? "bg-white/15 text-white/90 border border-white/20 ml-2" 
                  : "bg-rose-50 text-rose-500 border border-rose-100"}`}
              >
                {dishData.meal_type}
              </span>
              {score_breakdown && (
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-24 rounded-full overflow-hidden ${isFeatured ? "bg-white/20" : "bg-slate-100"}`}>
                    <div 
                      className={`h-full rounded-full ${isFeatured ? "bg-white" : "bg-rose-500"}`} 
                      style={{ width: `${(score_breakdown.total / SCORE_MAX) * 100}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-black tracking-tighter ${isFeatured ? "text-white/80" : "text-rose-500"}`}>
                    {((score_breakdown.total / SCORE_MAX) * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
            
            <h2 className={`font-display font-black leading-[1.1] tracking-tight
              ${isFeatured 
                ? "text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-sm" 
                : "text-3xl text-slate-800"}`}
            >
              {capitalize(dishData.name)}
            </h2>
          </div>

          {/* Info Grid */}
          <div className={`grid grid-cols-3 gap-3 font-sans text-xs font-bold
            ${isFeatured ? "text-white/90" : "text-slate-500"}`}>
            {[
              { label: `${dishData.prep_time_minutes || 0}m`, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: `${dishData.calories_estimate || 0} kcal`, icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" },
              { label: capitalize(dishData.dish_type), icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }
            ].map((item, idx) => (
              <div key={idx} className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors
                ${isFeatured ? "bg-white/10 hover:bg-white/15" : "bg-slate-50 hover:bg-rose-50"}`}>
                <svg className={`w-5 h-5 ${isFeatured ? "text-white/60" : "text-rose-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                </svg>
                <span className="truncate w-full text-center">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Rationale Section */}
          <div className={`mt-4 pt-6 border-t ${isFeatured ? "border-white/20" : "border-slate-100"}`}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`w-full flex items-center justify-between group transition-all
                ${isFeatured ? "text-white" : "text-slate-800"}`}
            >
              <div className="flex flex-col items-start gap-0.5">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isFeatured ? "text-white/50" : "text-slate-400"}`}>The Science</span>
                <span className="font-display font-bold text-sm">Why this choice?</span>
              </div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500
                ${isExpanded ? "rotate-180" : ""} 
                ${isFeatured 
                  ? "bg-white/10 group-hover:bg-white/20 text-white" 
                  : "bg-slate-50 group-hover:bg-rose-50 text-rose-500"}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="mt-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                {score_breakdown && (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Viral", val: score_breakdown.popularity, color: "var(--color-secondary)" },
                      { label: "Loyalty", val: score_breakdown.history, color: "var(--color-success)" },
                      { label: "Surprise", val: score_breakdown.randomness, color: "var(--color-accent)" }
                    ].map((p, i) => (
                      <div key={i} className={`p-2 rounded-xl text-[9px] font-black uppercase tracking-tighter text-center border
                        ${isFeatured ? "bg-white/5 border-white/10 text-white/80" : "bg-slate-50 border-slate-100 text-slate-500"}`}>
                        {p.label}: {p.val}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {notes && notes.length > 0 ? (
                    notes.map((note, index) => (
                      <div key={index} className={`flex gap-4 p-4 rounded-2xl leading-relaxed text-sm font-medium
                        ${isFeatured ? "bg-white/10 text-white/90" : "bg-rose-50/50 text-slate-700"}`}>
                        <span className={`text-xl ${isFeatured ? "text-white/40" : "text-rose-300"}`}>“</span>
                        <p className="pt-1">{note}</p>
                      </div>
                    ))
                  ) : (
                    <p className={`text-sm italic text-center py-4 ${isFeatured ? "text-white/40" : "text-slate-400"}`}>
                      A fresh culinary adventure awaits.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
