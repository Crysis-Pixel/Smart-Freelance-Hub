import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import TopUpModal from "../components/TopUpModal";
import PaymentGateway from "../components/PaymentGateway.jsx";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReviewsModal from "../components/ReviewsModal.jsx"; // Adjust the path as needed

export default function ClientProfile() {
  const [user, setUser] = useState({
    accountCreated: "",
    accountType: "Client",
    cBio: "",
    country: "",
    email: "",
    firstName: "",
    isVerified: false,
    totalProjectsPosted: 0,
    lastActive: "",
    lastName: "",
    projectsInProgress: 0,
    totalBalance: 0,
    cRating: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [countries, setCountries] = useState([]);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null); // Add this line for the profile picture file state
  const navigate = useNavigate();

  //Reviews
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [freelancerReviews, setFreelancerReviews] = useState([]);

  const handleCloseReviewsModal = () => {
    setIsReviewsModalOpen(false);
  };
  const handleOpenReviewsModal = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/reviews/getUserReviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            reviewedType: "C",
          }),
        }
      );

      if (response.status !== 200) {
        toast.error("No Reviews found");
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setFreelancerReviews(data);
      setIsReviewsModalOpen(true);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleOpenReviewModal = () => {
    setIsReviewModalOpen(true);
  };
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
  }, [navigate]);

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
        setFormData(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map((country) => country.name.common);
        setCountries(countryNames);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };

    fetchCountries();
  }, []);

  const handleFileChange = (e) => {
    setProfilePictureFile(e.target.files[0]); // Capture the selected file
  };
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.cBio) {
      toast.error("First Name, Last Name, and Bio are required.", {
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
      return;
    }

    try {
      const updatedData = {
        ...user,
        ...formData,
      };

      const formDataObj = new FormData();
      formDataObj.append("email", user.email);
      formDataObj.append("profilePicture", profilePictureFile);

      const profRes = await fetch(
        "http://localhost:3000/user/uploadProfilePicture",
        {
          method: "POST",
          body: formDataObj,
        }
      );

      if (profRes.status === 200) {
        const data = await profRes.json();
        user.profilePicture = data.path;
        updatedData.profilePicture = data.path;
        sessionStorage.setItem("user", JSON.stringify(updatedData));
      } else {
        console.error("Failed to upload profile picture.");
      }

      const response = await fetch("http://localhost:3000/user/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setUser(updatedData);
      sessionStorage.setItem("user", JSON.stringify(updatedData));
      setIsEditing(false);
      showToast();
    } catch (err) {
      setError(err.message);
    }
  };

  function StarRating({ rating }) {
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating - filledStars >= 0.5;
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(filledStars)].map((_, i) => (
          <span key={`filled-${i}`} className="text-yellow-400">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            ★
          </span>
        ))}
      </div>
    );
  }

  const openTopUpModal = () => {
    setIsTopUpModalOpen(true);
  };

  const closeTopUpModal = () => {
    setIsTopUpModalOpen(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  const showToast = () => {
    toast.success("Changes save successfully", {
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

  function formatBalance(value) {
    if (value >= 1_000_000_000) {
      return `$${value / 1_000_000_000}B`;
    } else if (value >= 1_000_000) {
      return `$${value / 1_000_000}M`;
    } else if (value >= 1_000) {
      return `$${value / 1_000}K`;
    }
    return `$${value}`;
  }

  return (
    <>
      <Header profilePicture={user.profilePicture} />
      <div id="dashboard" className="container mx-auto border my-32">
        <div
          id="profile-container"
          className="flex gap-10 items-center md:p-10 p-2"
        >
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img
                src={
                  user.profilePicture
                    ? `${user.profilePicture}`
                    : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt="Profile"
                onError={(e) => {
                  e.target.src =
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                }}
              />
            </div>
          </div>
          {/* Edit mode file input */}
          {isEditing && (
            <div>
              <input type="file" onChange={handleFileChange} />
            </div>
          )}
          <div className="flex-grow">
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleInputChange}
                className="input input-bordered w-full mb-2"
                placeholder="First Name"
              />
            ) : (
              <h1 className="text-xl">
                {user.firstName || "First Name"} {user.lastName || "Last Name"}
              </h1>
            )}
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Last Name"
              />
            ) : (
              <p>{user.country || "Country not provided"}</p>
            )}
          </div>

          {!isEditing && (
            <>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/manageJobs")}
              >
                Manage Jobs
              </button>
              <button
                className="btn btn-secondary ml-4"
                onClick={openTopUpModal}
              >
                Top Up
              </button>
            </>
          )}

          <button className="btn ml-auto" onClick={handleEditToggle}>
            {isEditing ? "CANCEL" : "EDIT"}
          </button>
        </div>

        <hr />

        <div id="body-container" className="flex">
          <div id="stats-container" className="border-r-2">
            <div className="stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Total Balance</div>
                <div className="stat-value">
                  {user.totalBalance ? formatBalance(user.totalBalance) : "$0"}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Total Projects Posted</div>
                <div className="stat-value">{user.jobsCompleted || 0}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Rating</div>
                <div
                  className="stat-value flex items-center cursor-pointer"
                  onClick={handleOpenReviewsModal}
                >
                  {user.cRating ? (
                    <StarRating rating={user.cRating} />
                  ) : (
                    "Not Rated"
                  )}
                </div>
              </div>
              {/* Reviews Modal */}
              <ReviewsModal
                isOpen={isReviewsModalOpen}
                onClose={handleCloseReviewsModal}
                reviews={freelancerReviews}
              />
            </div>
            <div className="flex flex-col gap-10 p-10">
              <div>
                <h1 className="font-bold">Projects in Progress</h1>
                <p>{user.projectsInProgress || 0} active projects</p>
              </div>

              <div>
                <h1 className="font-bold">Country</h1>
                {isEditing ? (
                  <select
                    name="country"
                    value={formData.country || ""}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>{user.country || "Country not provided"}</p>
                )}
              </div>

              <div>
                <h1 className="font-bold">Account Created</h1>
                <p>{user.accountCreated || "New"}</p>
              </div>
            </div>
          </div>

          <div>
            <div id="bio-container" className="px-10 py-5">
              <div id="bio-title" className="flex justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Client Bio</h1>
                  <h2 className="text-s font-light">
                    {user.accountType === "Client" && "Client"}
                    {user.accountType === "Freelance" && "Freelancer"}
                    {user.accountType === "Both" && "Client and Freelancer"}
                  </h2>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4">
                    <textarea
                      name="cBio"
                      value={formData.cBio || ""}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered w-full"
                      placeholder="Update your bio"
                      rows="6"
                      style={{
                        resize: "none",
                        width: "600px",
                        height: "150px",
                      }}
                    />

                    <button type="submit" className="btn">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p>{user.cBio || "Bio not available"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {isTopUpModalOpen && <TopUpModal onClose={closeTopUpModal} />}
    </>
  );
}
