import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OnboardingRoute = ({ element, role }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to={`/${role}/auth/login`} replace />;
  if (!user.isOnboarded) return element;

  return <Navigate to={`/${role}/app`} replace />;
};

export default OnboardingRoute;
