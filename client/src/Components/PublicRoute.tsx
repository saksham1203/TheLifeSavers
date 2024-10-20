import React, { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

// Add props type to accept children
interface PublicRouteProps {
  children?: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If the user is authenticated, redirect to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  // Otherwise, render the children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
