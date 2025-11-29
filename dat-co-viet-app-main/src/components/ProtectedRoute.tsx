import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles = ["USER"],
  redirectTo = "/",
}: ProtectedRouteProps) => {
  const { user, isLoggedIn, isLoading } = useAuth();

  console.log('ProtectedRoute render:', { isLoading, isLoggedIn, user });

  // If still loading, show loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not logged in, redirect to auth
  if (!isLoggedIn) {
    console.log('ProtectedRoute - not logged in, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // If user role not allowed, redirect
  if (user && !allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute - role not allowed, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  console.log('ProtectedRoute - user authenticated and authorized, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;