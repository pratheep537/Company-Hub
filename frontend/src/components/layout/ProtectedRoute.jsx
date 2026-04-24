import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../ui/Spinner';

export const ProtectedRoute = ({ allowedRole }) => {
  const { user, loading, token } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-base">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!token || !user) {
    // Redirect to the correct login page based on where they tried to go
    const loginPath = location.pathname.startsWith('/member') ? '/member/login' : '/admin/login';
    return <Navigate to={loginPath} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to their respective dashboard
    const dashboardPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/member/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return <Outlet />;
};
