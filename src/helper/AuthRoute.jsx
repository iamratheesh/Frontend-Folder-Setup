import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = ({ element, requiredRole }) => {
  const { isAuth } = useSelector((state) => state.auth);

  // If user is already logged in, redirect to their app home
  if (isAuth) {
    return <Navigate to={`/${requiredRole}/app/home`} replace />;
  }

  // Otherwise, render the login/register page
  return element;
};

export default AuthRoute;
