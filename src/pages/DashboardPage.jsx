import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Welcome to Kya Saabzi!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-green-700 mb-4">My Cooklog</h2>
          <p className="text-gray-600 mb-4">
            View and manage your cooking history.
          </p>
          <Link to="/cooklogs" className="text-green-600 hover:underline">
            View My Cooklog
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Recommendations
          </h2>
          <p className="text-gray-600 mb-4">
            Looking for what should I cook today?
          </p>
          <Link
            to="/recommendations"
            className="text-green-600 hover:underline"
          >
            Get Recommendations
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Today's Dish
          </h2>
          <p className="text-gray-600 mb-4">Add what you have cooked today.</p>
          <Link to="/dishes" className="text-green-600 hover:underline">
            Go add
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
