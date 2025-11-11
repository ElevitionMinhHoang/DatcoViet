import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function DebugRouter() {
  const location = useLocation();

  useEffect(() => {
    console.log("Route changed to:", location.pathname);
    console.log("Current location:", location);
  }, [location]);

  return null;
}