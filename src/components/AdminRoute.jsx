import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading, openAuthModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      openAuthModal();
    } else if (!loading && user && !isAdmin) {
      window.alert('You are not authorized to access the admin dashboard.');
    }
  }, [loading, user, isAdmin, openAuthModal]);

  if (loading) return <main className="admin-route-loading">Loading admin access...</main>;
  if (!user || !isAdmin) {
    return <Navigate to="/" replace state={{ from: location.pathname, unauthorized: true }} />;
  }

  return children || <Outlet />;
}