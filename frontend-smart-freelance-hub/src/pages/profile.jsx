import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WithdrawModal from "../components/WithdrawModal";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const [user, setUser] = useState({
    accountCreated: "",
    accountType: "",
    fBio: "",
    country: "",
    email: "",
    firstName: "",
    isVerified: false,
    jobsCompleted: 0,
    lastActive: "",
    lastName: "",
    lookingForJob: false,
    phoneNumber: "",
    profilePicture: "",
    fRating: 0,
    skills: [],
    totalBalance: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [countries, setCountries] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null); // Add this line for the profile picture file state
  const navigate = useNavigate();

  const availableSkills = [
    "Web-Development",
    "Video-Editor",
    "Photo-Editor",
    "UI/UX Design",
    "Graphics Designer",
    "Data Analyst",
    "Application Developer",
    "SEO Analyst",
  ];

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

        if (!response.status === 200) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        userData.profilePicture = userData.profilePicture
          ? `${userData.profilePicture}`
          : "";

        setUser(userData);
        setFormData(userData);
        setSelectedSkills(userData.skills ? userData.skills.split(", ") : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch countries from REST Countries API
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

  const handleSkillSelect = (skill) => {
    if (selectedSkills.length < 3 && !selectedSkills.includes(skill)) {
      setSelectedSkills((prevSkills) => [...prevSkills, skill]);
    }
  };

  const handleSkillRemove = (skill) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.filter((selected) => selected !== skill)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...user,
        ...formData,
        skills: selectedSkills.join(", "),
      };

      // Prepare form data with the profile picture and other data
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

  const openWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };

  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
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
      <Header profilePicture={user.profilePicture}/>
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
          <button
            className="btn btn-secondary ml-4"
            onClick={openWithdrawModal}
          >
            Withdraw
          </button>
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
                <div className="stat-title">Total Jobs</div>
                <div className="stat-value">{user.jobsCompleted || 0}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Rating</div>
                <div className="stat-value">{user.fRating || "Not Rated"}</div>
              </div>
            </div>
            <div className="flex flex-col gap-10 p-10">
              <div>
                <h1 className="font-bold">Looking For Job</h1>
                {isEditing ? (
                  <input
                    type="checkbox"
                    name="lookingForJob"
                    checked={formData.lookingForJob}
                    onChange={handleInputChange}
                    className="mr-2 "
                  />
                ) : (
                  <p>{user.lookingForJob ? "Yes" : "No"}</p>
                )}
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
                <h1 className="font-bold">Skills</h1>
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <div className="dropdown">
                      <button className="btn btn-secondary">
                        Select Skill
                      </button>
                      <ul className="dropdown-content menu p-2 shadow bg-white rounded-box w-52">
                        {availableSkills
                          .filter((skill) => !selectedSkills.includes(skill))
                          .map((skill) => (
                            <li key={skill}>
                              <button
                                type="button"
                                onClick={() => handleSkillSelect(skill)}
                              >
                                {skill}
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSkills.map((skill) => (
                        <div
                          key={skill}
                          className="badge badge-primary cursor-pointer"
                        >
                          {skill}
                          <span
                            className="ml-1 text-xs"
                            onClick={() => handleSkillRemove(skill)}
                          >
                            ✕
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>{selectedSkills.join(", ") || "Skills not specified"}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div id="bio-container" className="px-10 py-5">
              <div id="bio-title">
                <h1 className="text-2xl font-bold">Profile Bio</h1>
                <h2 className="text-s font-light">
                  {user.accountType === "Client" && "Client"}
                  {user.accountType === "Freelance" && "Freelancer"}
                  {user.accountType === "Both" && "Client and Freelancer"}
                </h2>
              </div>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4">
                    <textarea
                      name="fBio"
                      value={formData.fBio || ""}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered w-full"
                      placeholder="Update your bio"
                      rows="100"
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
                  <p>{user.fBio || "Bio not available"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {isWithdrawModalOpen && <WithdrawModal onClose={closeWithdrawModal} />}
    </>
  );
}
