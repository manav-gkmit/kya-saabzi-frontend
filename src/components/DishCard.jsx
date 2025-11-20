import { useState } from "react";

const DishCard = ({ dish }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div key={dish.dish.id} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-green-700 mb-2">
        {capitalizeFirstLetter(dish.dish.name)}
      </h2>
      {dish.notes && dish.notes.length > 0 && (
        <>
          <button
            onClick={handleToggleExpand}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md text-sm"
          >
            {isExpanded ? "Hide Notes" : "View Notes"}
          </button>
          {isExpanded && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-bold text-green-700 mb-2">
                Notes
              </h3>
              <ul className="list-disc list-inside">
                {dish.notes.map((note, index) => (
                  <li key={index} className="text-gray-700">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DishCard;
