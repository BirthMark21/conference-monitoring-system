import { Route, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { EventContext } from "./MyContext";

function PrivateRoute({ children }) {
  const isAuthenticated = () => {
    const token = sessionStorage.getItem("userData"); // Retrieve JWT token from session storage
    return token !== null;
  };

  return isAuthenticated() ? <>{children}</> : <Navigate to="/" />;
}

export default PrivateRoute;
