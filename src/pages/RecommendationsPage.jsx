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
        setError("Failed to fetch recommendations.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Recommendations
      </h1>
      {loading && <p>Loading recommendations...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {recommendations.map((dish) => (
          <DishCard key={dish.dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;
