//logout.jsx made by Mostakim for Sessions
import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear(); // Clear all session storage data
        navigate("/login"); // Redirect to the login page
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
