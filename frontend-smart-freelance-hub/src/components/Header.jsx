// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // To store user data
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    // Check if user data exists in sessionStorage
    const userData = sessionStorage.getItem("user"); // Retrieve user data from sessionStorage
    if (userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData)); // Parse and store user data if logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  const handleLogout = () => {
    // Remove user data from sessionStorage and update state
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false); // Close the dropdown on logout
    navigate("/home"); // Navigate to the home page after logout
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  // Determine the dropdown option based on the current route
  const getDropdownOption = () => {
    if (location.pathname === "/profile") {
      return "Change to Client";
    } else if (location.pathname === "/profileCl") {
      return "Change to Freelancer";
    } else {
      return "Go to Profile";
    }
  };

  return (
    <>
      <div className="bg-grey">
        <div className="navbar container mx-auto">
          <div className="navbar-start">
            <Link to="/home">LOGO</Link>
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
                <div className="relative">
                  <div
                    onClick={toggleDropdown}
                    className="avatar cursor-pointer"
                  >
                    <div className="ring-primary ring-offset-base-100 w-12 rounded-full">
                      <img
                        src={
                          user.profilePicture
                            ? user.profilePicture
                            : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                        alt="User Avatar"
                      />
                    </div>
                  </div>
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <ul className="py-1">
                        <li>
                          <Link
                            to={
                              location.pathname === "/profile" ||
                              location.pathname === "/profileCl"
                                ? "#"
                                : "/profile"
                            }
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                            onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                          >
                            {getDropdownOption()}
                          </Link>
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
