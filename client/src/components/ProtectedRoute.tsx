import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("currentUserId");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
