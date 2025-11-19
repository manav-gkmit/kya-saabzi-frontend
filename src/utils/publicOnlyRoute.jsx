import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicOnlyRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return !token ? <Outlet /> : <Navigate to="/" />;
};

export default PublicOnlyRoute;
