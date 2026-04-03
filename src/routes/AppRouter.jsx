import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import PrivateRoute from '../utils/privateRoute.jsx';
import App from '../App';
import DashboardPage from '../pages/DashboardPage';
import RecommendationsPage from '../pages/RecommendationsPage';
import DishesPage from '../pages/DishesPage';
import CooklogPage from '../pages/CooklogPage';
import SettingsPage from '../pages/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <AuthPage />,
      },
      {
        path: 'register',
        element: <AuthPage />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'recommend',
            element: <RecommendationsPage />,
          },
          {
            path: 'dishes',
            element: <DishesPage />,
          },
          {
            path: 'cooklogs',
            element: <CooklogPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
