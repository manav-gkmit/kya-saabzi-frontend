import { Outlet, Link, useLocation } from "react-router-dom";
import useAuth from "./hooks/useAuth";

function App() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-green-700 p-4 text-white shadow-md">
        <ul className="flex justify-between items-center mx-auto">
          <li className="flex items-center">
            <Link to="/" className="hover:opacity-80">
              <img src="/ingredient.ico" alt="Home" className="h-8 w-8" />
            </Link>
            <span className="ml-2 text-lg font-semibold">Kya Saabzi</span>
          </li>
          <li className="flex space-x-4">
            {user ? (
              <button
                onClick={logout}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </li>
        </ul>
      </nav>
      <main className={isAuthPage ? "grow" : "grow container mx-auto p-4"}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
