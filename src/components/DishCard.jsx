import { useState } from "react";

const DishCard = ({ dish, isFeatured = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { dish: dishData, notes, score_breakdown } = dish;

  if (!dishData) {
    return (
      <div className="soft-card p-6 md:p-8 flex flex-col gap-2 spell-fade-up border-2 border-[var(--color-secondary-light)]">
        <h3 className="font-display text-2xl font-bold text-[var(--color-text-main)]">{dish.name}</h3>
        <p className="font-sans text-sm font-bold text-[var(--color-secondary)] uppercase tracking-wide">{dish.meal_type}</p>
      </div>
    );
  }

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  return (
    <div className={`soft-card relative overflow-hidden flex flex-col spell-fade-up ${isFeatured ? "bg-[var(--color-primary)] text-white" : "bg-white"}`}>
      
      {/* Featured Overlay logic (optional pattern) */}
      {isFeatured && (
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
      )}

      <div className="p-8 flex flex-col gap-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start mb-1">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${isFeatured ? "bg-white/20 text-white" : "bg-[var(--color-secondary-light)] text-[var(--color-secondary)]"}`}>
              {capitalize(dishData.meal_type)}
            </span>
            {score_breakdown && (
              <span className={`text-sm font-extrabold ${isFeatured ? "text-white/90" : "text-[var(--color-accent)]"}`}>
                {((score_breakdown.total / 30) * 100).toFixed(0)}% Match
              </span>
            )}
          </div>
          <h2 className={`font-display font-extrabold leading-tight ${isFeatured ? "text-4xl md:text-5xl lg:text-6xl text-white" : "text-3xl text-[var(--color-text-main)]"}`}>
            {capitalize(dishData.name)}
          </h2>
        </div>

        {/* Metadata Tags */}
        <div className={`flex flex-wrap gap-3 font-sans text-sm font-semibold mt-2 ${isFeatured ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${isFeatured ? "bg-white/10" : "bg-slate-50"}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {dishData.prep_time_minutes || 0} min
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${isFeatured ? "bg-white/10" : "bg-slate-50"}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
            {dishData.calories_estimate || 0} kcal
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${isFeatured ? "bg-white/10" : "bg-slate-50"}`}>
            <span className="uppercase tracking-wider">{dishData.dish_type}</span>
          </div>
        </div>

        {/* Culinary Notes */}
        {notes && notes.length > 0 && (
          <div className={`flex flex-col gap-4 mt-auto pt-6 border-t ${isFeatured ? "border-white/20" : "border-slate-100"}`}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`font-sans text-sm font-bold flex items-center justify-between transition-colors ${isFeatured ? "text-white hover:text-white/80" : "text-[var(--color-primary)] hover:text-rose-600"}`}
            >
              Why this choice?
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${isExpanded ? "rotate-180" : ""} ${isFeatured ? "bg-white/20" : "bg-[var(--color-primary-light)]"}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </button>
            
            {isExpanded && (
              <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
                {notes.map((note, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className={`shrink-0 mt-1 ${isFeatured ? "text-white/50" : "text-[var(--color-primary)]"}`}>✦</span>
                    <p className={`text-base font-medium leading-relaxed ${isFeatured ? "text-white/90" : "text-[var(--color-text-main)]"}`}>
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DishCard;
