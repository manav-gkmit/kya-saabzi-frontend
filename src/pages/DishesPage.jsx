import { useState } from "react";
import { addDish } from "../api/services";

const DishesPage = () => {
  const [newDishName, setNewDishName] = useState("");
  const [newDishNote, setNewDishNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!newDishName) return;
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      await addDish({ name: newDishName, note: newDishNote });
      setNewDishName("");
      setNewDishNote("");
      setSuccessMessage(`Successfully added dish: ${newDishName}`);
    } catch (err) {
      setError(err.response.data.detail[0].msg ?? "Failed to add dish.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-2">
        Add Your Creation
      </h1>
      <p className="text-gray-600 mb-6">
        Every masterpiece has a story. What's yours? Add a note to remember the
        occasion, a special twist, or just how delicious it was.
      </p>

      <form onSubmit={handleAddDish} className="mb-6">
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter a new dish name"
            value={newDishName}
            onChange={(e) => setNewDishName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Add optional notes about the dish..."
            value={newDishNote}
            onChange={(e) => setNewDishNote(e.target.value)}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Dish"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
    </div>
  );
};

export default DishesPage;
