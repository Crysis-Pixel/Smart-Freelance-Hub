//Added by Mostakim
//import this to make sure protected routes (e.g., the dashboard) are only accessible if the user is logged in.
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const user = sessionStorage.getItem("user");

    // If no user data, redirect to login
    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
