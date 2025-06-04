// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading your fitness journey...</p>
      </div>
    </div>
  );
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to index page (not auth) to match your existing flow
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user has completed their profile (except for dashboard route)
  const storedProfile = localStorage.getItem('userProfile');
  const isDashboardRoute = location.pathname === '/dashboard';
  
  if (!storedProfile && !isDashboardRoute) {
    // Redirect new users to dashboard for profile setup
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}