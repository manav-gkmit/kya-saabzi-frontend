import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-[var(--color-text-muted)]">
        <div className="w-12 h-12 border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        <p className="font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
