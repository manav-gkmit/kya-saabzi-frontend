import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import PrivateRoute from '../utils/privateRoute.jsx';
import App from '../App';

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
            element: <div></div>,
          },
        ],
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
