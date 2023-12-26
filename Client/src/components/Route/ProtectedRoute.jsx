import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, adminRoute, userRole, loading }) => {
  if (loading === false) {
    if (isAuthenticated === false) {
      return <Navigate to={"/login"} />;
    }
    if (adminRoute && userRole !== "admin") {
      return <Navigate to="/" />;
    }
    return <Outlet />;
  }
};

export default ProtectedRoute;
