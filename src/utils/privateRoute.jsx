import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
