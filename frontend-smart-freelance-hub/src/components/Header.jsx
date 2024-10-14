import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ModalContext } from "../contexts/Modalcontext";
import OTPModal from "./OTPmodal";
function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // To store user data

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem("user"); // Retrieve user data from localStorage
    if (userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData)); // Parse and store user data if logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  const handleLogout = () => {
    // Remove user data from localStorage and update state
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  // needed for modal
  const { openModal } = useContext(ModalContext);

  return (
    <>
      <div className="bg-grey">
        <div className="navbar container mx-auto">
          <div className="navbar-start">
            {/* <Link to="/home">LOGO</Link> */}
            <button className="btn" onClick={openModal}>
              Open Modal
            </button>
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
                {/* Show Login and Sign-Up buttons if the user is a guest */}
                <Link to="/signup" className="btn bg-greenPrimary border-none">
                  Sign-Up
                </Link>
                <Link to="/login" className="btn bg-greenPrimary border-none">
                  Login
                </Link>
              </>
            ) : (
              <>
                {/* Show Avatar if the user is logged in */}
                <Link to="/profile">
                  <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 w-12 rounded-full">
                      <img
                        src={
                          user?.profileImage || "https://via.placeholder.com/50"
                        }
                        alt="User Avatar"
                      />
                    </div>
                  </div>
                </Link>
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="btn bg-red-500 text-white border-none"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* to verify the modal, put the OTP code that needs to be verified with 'correctOTP'  */}
      <OTPModal correctOTP="111111" />
    </>
  );
}

export default Header;
