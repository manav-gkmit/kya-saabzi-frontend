import { useState, useEffect } from "react";
import { getMyCooklogs, deleteCooklog } from "../api/services";

const CooklogPage = () => {
  const [cooklogs, setCooklogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCooklogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getMyCooklogs();
        const activeCooklogs = data.filter((log) => !log.deleted_at);
        setCooklogs(activeCooklogs);
      } catch (err) {
        setError("Failed to fetch cooklogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchCooklogs();
  }, []);

  const handleDeleteCooklog = async (cooklogId) => {
    try {
      await deleteCooklog(cooklogId);
      setCooklogs(cooklogs.filter((log) => log.id !== cooklogId));
    } catch (err) {
      setError("Failed to delete cooklog.");
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">My Cooklog</h1>
      {loading && <p>Loading cooklogs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {cooklogs.length > 0 ? (
          cooklogs.map((log) => (
            <div
              key={log.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{log.dish.name}</p>
                <p className="text-sm text-gray-500">
                  Cooked on: {new Date(log.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteCooklog(log.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No cooklogs to display. Go add a dish!</p>
        )}
      </div>
    </div>
  );
};

export default CooklogPage;
