// GoogleLoginButton.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const credentialResponseDecoded = jwtDecode(
          credentialResponse.credential
        );
        console.log(credentialResponseDecoded.given_name);

        const email = credentialResponseDecoded.email;
        const password = "";

        // Login request
        fetch("http://localhost:3000/user/login", {
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
            toast.error("Error occurred while logging in.", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              transition: Slide,
            });
          });

        // Fetch user data
        fetch("http://localhost:3000/user/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((userdata) => {
            if (userdata) {
              sessionStorage.setItem("user", JSON.stringify(userdata));
              console.log(userdata);

              // Navigate based on accountType if userdata is valid
              if (userdata.accountType === "Client") {
                navigate("/profileCl");
              } else if (userdata.accountType === "Freelancer") {
                navigate("/profile");
              } else if (userdata.accountType === "Both") {
                navigate("/home");
              } else {
                toast.error("Invalid account type.", {
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  transition: Slide,
                });
              }

              // Display welcome toast
              toast.success(
                `Logged in successfully! Welcome, ${userdata.firstName} ${userdata.lastName}`,
                {
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  transition: Slide,
                }
              );
            } else {
              throw new Error("User data is null");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            toast.error("Error occurred while fetching user data.", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              transition: Slide,
            });
          });
      }}
      onError={() => {
        console.error("An error occurred during Google login.");
        toast.error("Login failed. Please try again.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      }}
    />
  );
};

export default GoogleLoginButton;
