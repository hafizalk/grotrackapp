import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const RouteGuard = ({ children }) => {
  function hasJWT() {
    let flag = false;

    var token = localStorage.getItem("token");

    //check user has JWT token
    token &&
    token !== null &&
    token !== undefined &&
    token !== "undefined" &&
    token !== "null"
      ? (flag = true)
      : (flag = false);

    return flag;
  }

  function jwtTokenValid() {
    var token = localStorage.getItem("token");
    if (jwt_decode(token).exp < Date.now() / 1000) {
      localStorage.clear();
      return false;
    } else {
      return true;
    }
  }

  
  return hasJWT() && jwtTokenValid() ? children : <Navigate to="/login" />;
};

export default RouteGuard;
