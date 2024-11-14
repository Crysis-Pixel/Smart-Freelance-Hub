import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/SmartFreelanceHubLOGO.png";

function Header({ profilePicture }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewMessage, setViewMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  //Password
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [availableJob, setAvailableJobs] = useState([]);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/jobs/getFreelancerJob",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              freelancerEmail: JSON.parse(sessionStorage.getItem("user")).email,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const jobsData = await response.json();

        setAvailableJobs(jobsData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchJobs();
  }, []);

  console.log(availableJob);

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
  const handlePasswordChange = async () => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters, with one lowercase letter and one symbol."
      );
      return;
    } else if (newPassword !== verifyPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    try {
      const email = user.email;
      const response = await fetch(
        "http://localhost:3000/user/changeUserPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: oldPassword, newPassword }),
        }
      );
      if (!response.ok) throw new Error("Password change failed");
      toast.success("Password changed successfully.", {
        autoClose: 2000,
        theme: "light",
      });
      setIsChangePasswordModalOpen(false);
      setOldPassword("");
      setNewPassword("");
      setVerifyPassword("");
      setPasswordError("");
      setShowPassword(false);
    } catch (err) {
      toast.error("Password change failed. Please try again.", {
        autoClose: 2000,
        theme: "light",
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
                className="h-16 w-25" // Adjust size as needed
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
          <div className="border">
            {availableJob.length === 1 &&
              availableJob[0].status === "pending" && (
                <div>
                  You have a gig offer, visit freelancer profile to check
                </div>
              )}
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
                    <div className="ring-primary ring-offset-red-200 w-12 rounded-full ring ring-offset-2 relative">
                      <img
                        src={
                          profilePicture
                            ? profilePicture
                            : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                        alt="User Avatar"
                      />
                    </div>
                    {availableJob.length === 1 &&
                      availableJob[0].status === "pending" && (
                        <div className="bg-red-700 rounded-full absolute w-6 -right-3 -top-2"></div>
                      )}
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
                            onClick={() => {
                              setIsChangePasswordModalOpen(true);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          >
                            Change Password
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
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Old Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border px-3 py-2 rounded-md"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border px-3 py-2 rounded-md"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Verify New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border px-3 py-2 rounded-md"
                value={verifyPassword}
                onChange={(e) => {
                  setVerifyPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
              />

              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <div className="mb-4">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label className="text-sm">Show Password</label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="btn border-100 bg-gray-200 text-gray-700"
                onClick={() => {
                  setIsChangePasswordModalOpen(false);
                  setPasswordError("");
                  setOldPassword("");
                  setNewPassword("");
                  setVerifyPassword("");
                  setIsDropdownOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn bg-green-600 text-white hover:bg-green-700 border-none"
                onClick={handlePasswordChange}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
