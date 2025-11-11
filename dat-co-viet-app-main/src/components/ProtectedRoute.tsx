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
  redirectTo = "/admin/users",
}: ProtectedRouteProps) => {
  const { user, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isLoggedIn) {
      navigate("/auth");
    } else if (user && !allowedRoles.includes(user.role)) {
      navigate(redirectTo);
    }
  }, [user, allowedRoles, redirectTo, navigate, isLoggedIn, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;