// GoogleLoginButton.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const navigate = useNavigate();
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        var credentialResponseDecoded = jwtDecode(
          credentialResponse.credential
        );
        console.log(credentialResponseDecoded.given_name);
        var email = credentialResponseDecoded.email;
        var password = "";
        const response = fetch("http://localhost:3000/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => {
            console.error("Error:", error);
            alert("Error has occured.");
            return;
          });

        const userresponse = fetch("http://localhost:3000/user/getUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });
        
        userresponse
        .then((response) => {
          if (!response.ok) {
            alert("Network response was not ok");
          }
          return response.json(); // Convert response to JSON
        })
        .then((userdata) => {
          sessionStorage.setItem("user", JSON.stringify(userdata)); // Store in sessionStorage
          console.log(userdata); // Optional: log the userdata
        })
        .catch((error) => {
          console.error("Error:", error); // Handle errors
          alert("Error has occured.");
          return;
        });
        
        navigate("/profile");
      }}
      onError={() => {
        console.log("Login Failed");
        setError("An error occurred. Please try again.");
        console.error(error);
      }}
    />
  );
};

export default GoogleLoginButton;
