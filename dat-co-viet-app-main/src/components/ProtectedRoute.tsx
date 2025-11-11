import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles = ["customer"], 
  redirectTo = "/admin/users" 
}: ProtectedRouteProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      navigate(redirectTo);
    }
  }, [user, allowedRoles, redirectTo, navigate]);

  // If user is admin and trying to access customer page, don't render children
  if (user && !allowedRoles.includes(user.role)) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;