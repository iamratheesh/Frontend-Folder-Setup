import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import HelperRoutes from "./HelperRoutes";

const ProtectedRoute = ({ element, requiredRole }) => {
  // Fix: Correctly access the auth state
  const { isAuth } = useSelector((state) => state.auth);

  console.log("ProtectedRoute auth state:", { isAuth, requiredRole });

  // If user is not authenticated, redirect to role-specific login
  if (!isAuth) {
    return <Navigate to={`/${requiredRole}/auth/login`} replace />;
  }

  // If user role does not match requiredRole, redirect to home
  if (requiredRole !== requiredRole) {
    console.warn(`Role mismatch: expected ${requiredRole}, got ${requiredRole}`);
    return <Navigate to="/" replace />;
  }

  // Wrap the protected element with HelperRoutes
  return element
};

export default ProtectedRoute;