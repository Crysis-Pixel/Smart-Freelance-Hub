// GoogleLoginButton.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalContext } from "../contexts/Modalcontext";
import OTPModal from "../components/OTPmodal";
import VerifyAccountPrompt from "../components/VerifyAccountPrompt";

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          // Decode JWT to get user information
          const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
          console.log("User given name:", credentialResponseDecoded.given_name);

          const email = credentialResponseDecoded.email;

          // Prepare user data for registration
          const userData = {
            accountType: "Freelancer",
            firstName: credentialResponseDecoded.given_name,
            lastName: credentialResponseDecoded.family_name,
            email: email,
            password: "",
            country: "",
            phoneNumber: "",
          };

          // Send registration request
          const response = await fetch("http://localhost:3000/user/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          // Check if response is successful
          if (!response.ok) {
            throw new Error("Failed to register user.");
          }

          // Parse response data
          const data = await response.json();
          console.log("Registration response:", data);

          // Show success toast
          toast.success("Account Created Successfully! \nYour default account is Freelancer.\nYou can change it.", {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Slide,
          });

          // Fetch user data for further processing
          const userResponse = await fetch("http://localhost:3000/user/getUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          if (!userResponse.ok) {
            throw new Error("Failed to retrieve user data.");
          }

          const userdata = await userResponse.json();
          sessionStorage.setItem("user", JSON.stringify(userdata));

          // Trigger VerifyAccountPrompt modal
          <VerifyAccountPrompt />;

          // Trigger OTPModal if needed
          <OTPModal email={userdata.email} />;
          
          // Navigate based on account type
          if (userdata.accountType === "Client") {
            navigate("/profileCl");
          } else if (userdata.accountType === "Freelancer") {
            navigate("/profile");
          } else if (userdata.accountType === "Both") {
            navigate("/home");
          }

        } catch (error) {
          // Log and show error message
          console.error("Error:", error);
          toast.error("Registration failed. Please try again.", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        }
      }}
      onError={() => {
        console.error("Login Failed");
        toast.error("Google Login failed. Please try again.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }}
    />
  );
};

export default GoogleLoginButton;
