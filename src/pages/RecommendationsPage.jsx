import { useState, useEffect } from "react";
import { getRecommendations } from "../api/services";
import DishCard from "../components/DishCard";

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getRecommendations();
        const recommendationsArray = Array.isArray(data) ? data : [data];
        setRecommendations(recommendationsArray);
      } catch (err) {
        setError("Unable to retrieve recommendations right now.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="flex flex-col gap-10 py-8 md:py-16 spell-fade-up">
      {/* Friendly Header */}
      <div className="flex flex-col gap-3 text-center md:text-left">
        <div className="inline-flex items-center gap-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide w-fit mx-auto md:mx-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[var(--color-text-main)] tracking-tight mt-2">
          Today's Special
        </h1>
        <p className="font-sans text-xl text-[var(--color-text-muted)] font-medium max-w-xl mx-auto md:mx-0">
          Carefully chosen suggestions based on what your family loves, balancing comfort with a bit of variety.
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
