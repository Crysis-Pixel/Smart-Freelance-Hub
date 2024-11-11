import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/SmartFreelanceHubLOGO.png";

function Header({profilePicture}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewMessage, setViewMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = JSON.parse(sessionStorage.getItem("user")).email;
        const response = await fetch("http://localhost:3000/user/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
    navigate("/home");

    toast.info("Logged out successfully.", {
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
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getDropdownOption = () => {
    if (location.pathname === "/profile") {
      return "Change to Client";
    } else if (location.pathname === "/profileCl") {
      return "Change to Freelancer";
    } else {
      return "Go to Profile";
    }
  };

  const updateAccountType = async () => {
    try {
      const email = JSON.parse(sessionStorage.getItem("user")).email;
      const response = await fetch(
        "http://localhost:3000/user/updateUserAccountType",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, accountType: "Both" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update account type");
      }

      if (location.pathname === "/profile") {
        navigate("/profileCl");
        setViewMessage("Changed to Client view");
        toast.info("Switched to Client view.", {
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
      } else if (location.pathname === "/profileCl") {
        navigate("/profile");
        setViewMessage("Changed to Freelancer view");
        toast.info("Switched to Freelancer view.", {
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
      } else {
        navigate("/profile");
        setViewMessage("Navigated to Profile");
      }

      setIsDropdownOpen(false);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to update account type.", {
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
    }
  };

  return (
    <>
      <div className="bg-grey">
        <div className="navbar container mx-auto">
          <div className="navbar-start">
            <Link to="/home">
              <img
                src={logo}
                alt="Logo"
                className="h-20 w-25" // Adjust size as needed
              />
            </Link>
            <ul className="menu menu-horizontal px-1 hidden lg:flex">
              <li>
                <a>Find Talent</a>
              </li>
              <li>
                <a>Find Work</a>
              </li>
              <li>
                <a>Why Us?</a>
              </li>
            </ul>
          </div>
          <div className="navbar-end gap-5">
            {!isLoggedIn ? (
              <>
                <Link to="/signup" className="btn bg-greenPrimary border-none">
                  Sign-Up
                </Link>
                <Link to="/login" className="btn bg-greenPrimary border-none">
                  Login
                </Link>
              </>
            ) : (
              <>
                <div className="relative">
                  <div
                    onClick={toggleDropdown}
                    className="avatar cursor-pointer"
                  >
                    <div className="ring-primary ring-offset-base-100 w-12 rounded-full">
                      <img
                        src={
                          profilePicture
                            ? profilePicture
                            : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                        alt="User Avatar"
                      />
                    </div>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <ul className="py-1">
                        <li>
                          <button
                            onClick={updateAccountType}
                            className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          >
                            {getDropdownOption()}
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                {viewMessage && (
                  <div className="text-green-500 mt-2">{viewMessage}</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
