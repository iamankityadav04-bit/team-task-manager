import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, booting, isAdmin } = useAuth();
  const location = useLocation();

  if (booting) return <Spinner fullScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
