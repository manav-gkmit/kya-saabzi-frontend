import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import DashboardPage from "../pages/DashboardPage";
import PrivateRoute from "../utils/privateRoute.jsx";
import PublicOnlyRoute from "../utils/publicOnlyRoute.jsx";
import App from "../App";
import CooklogPage from "../pages/CooklogPage.jsx";
import RecommendationsPage from "../pages/RecommendationsPage.jsx";
import DishesPage from "../pages/DishesPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: "login",
            element: <AuthPage />,
          },
          {
            path: "register",
            element: <AuthPage />,
          },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "cooklogs",
            element: <CooklogPage />,
          },
          {
            path: "recommendations",
            element: <RecommendationsPage />,
          },
          {
            path: "dishes",
            element: <DishesPage />,
          },
        ],
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
