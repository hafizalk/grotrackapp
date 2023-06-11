import React from "react";
import { Navigate } from "react-router-dom";

const RouteGuard = ({ children }) => {
  function hasJWT() {
    let flag = false;

    //check user has JWT token
    localStorage.getItem("token") ? (flag = true) : (flag = false);

    return flag;
  }

  return hasJWT() ? children : <Navigate to="/login" />;
};

export default RouteGuard;
