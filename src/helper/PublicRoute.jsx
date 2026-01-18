import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ element, role }) => {
  const { user } = useSelector((state) => state.auth);

  if (user && user.role === role) {
    return <Navigate to={`/${role}/app`} replace />;
  }

  return element;
};

export default PublicRoute;
