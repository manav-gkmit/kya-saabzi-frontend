import { useState, useEffect } from "react";
import { getRecommendations, getMyHousehold } from "../api/services";
import DishCard from "../components/DishCard";
import { getCurrentMealType } from "../utils/mealType";

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentMealTypeRequested = getCurrentMealType();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {        
        const recoRes = await getRecommendations(currentMealTypeRequested);
        const recoData = recoRes.data;
        const recommendationsArray = Array.isArray(recoData) ? recoData : [recoData];
        setRecommendations(recommendationsArray);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("No recommendations found for this meal time. Try adding more dishes or logging some cooks!");
        } else {
          setError("Unable to retrieve recommendations right now.");
        }
        console.error(err);
      }

      try {
        const hhRes = await getMyHousehold();
        setHousehold(hhRes.data);
      } catch (err) {
        console.error("Unable to retrieve household right now.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMealTypeRequested]);

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  
  const prefs = household?.preferences || {};
  const strategyNote = prefs.include_recently_cooked 
    ? "Suggesting everything in your archive"
    : `Maintaining a ${prefs.recommendation_window_days || 6}-day variety gap`;

  return (
    <div className="flex flex-col gap-10 py-8 md:py-16 spell-fade-up">
      {/* Friendly Header */}
      <div className="flex flex-col gap-3 text-center md:text-left">
        <div className="flex flex-wrap items-center gap-2 mx-auto md:mx-0">
          <div className="inline-flex items-center gap-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide w-fit">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          {household && (
            <div className="inline-flex items-center gap-1.5 bg-[var(--color-accent-light)] text-[var(--color-accent)] px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-tighter">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {strategyNote}
            </div>
          )}
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black text-[var(--color-text-main)] tracking-tight mt-3 leading-[0.95]">
          {currentMealTypeRequested ? (
            <>
              Today's <span className="text-[var(--color-primary)]">{capitalize(currentMealTypeRequested)}</span>
            </>
          ) : (
            "Today's Special"
          )}
        </h1>
        <p className="font-sans text-xl text-[var(--color-text-muted)] font-semibold max-w-2xl mx-auto md:mx-0 leading-relaxed opacity-80">
          {currentMealTypeRequested 
            ? `Hand-picked ${currentMealTypeRequested} suggestions tailored for your household, balancing your recent favorites with fresh variety.`
            : "Carefully chosen suggestions based on what your family loves, balancing comfort with a bit of variety."
          }
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-[var(--color-text-muted)]">
          <div className="w-12 h-12 border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
          <p className="font-medium animate-pulse">Gathering recipes...</p>
        </div>
      )}

      {error && (
        <div className="soft-card p-8 bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold text-center border-none">
          {error}
        </div>
      )}

      {/* Asymmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {recommendations.map((item, index) => (
          <div key={item?.dish?.id ?? index} className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
            <DishCard dish={item} isFeatured={index === 0} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;
