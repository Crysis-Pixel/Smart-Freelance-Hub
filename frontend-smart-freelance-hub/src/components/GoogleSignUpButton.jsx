// GoogleLoginButton.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const GoogleLoginButton = ({ onSuccess, onError }) => {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        var credentialResponseDecoded = jwtDecode(
          credentialResponse.credential
        );
        console.log(credentialResponseDecoded.given_name);
        const response = fetch("http://localhost:3000/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountType: "Freelancer",
            firstName: credentialResponseDecoded.given_name,
            lastName: credentialResponseDecoded.family_name,
            email: credentialResponseDecoded.email,
            password: "",
            country: "",
            phoneNumber: "",
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Error:", error));
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
};

export default GoogleLoginButton;
