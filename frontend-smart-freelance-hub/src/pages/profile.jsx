import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WithdrawModal from "../components/WithdrawModal";
import AddOtherSkill from "../components/AddOtherSkill";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBox from "../components/ChatBox";
import JobOfferModal from "../components/jobOfferModal.jsx";
import { Menu } from "@headlessui/react";

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
    minWage: 0,
    isAvailable: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [countries, setCountries] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null); // Add this line for the profile picture file state
  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const [otherSkill, setOtherSkill] = useState("");
  const [availableJob, setAvailableJobs] = useState([]);
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isJobOfferModal, setIsJobOfferModal] = useState(false);
  const [jobOffer, setJobOffer] = useState(null);
  const [clientEmail, setClientEmail] = useState(null);
  const [isAvailable, setIsAvailableJobs] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const availableSkills = [
    "Accounting & Bookkeeping",
    "AI (Artificial Intelligence)",
    "Application Developer",
    "Blockchain Development",
    "Content Writing",
    "Copywriting",
    "Data Analyst",
    "Digital Marketing",
    "E-commerce",
    "Financial Analysis",
    "Game Developer",
    "Graphics Designer",
    "IT Support",
    "Machine Learning",
    "Mobile App Development",
    "Photo Editor",
    "Project Management",
    "SEO Analyst",
    "Social Media Marketing",
    "Technical Writing",
    "Translation",
    "UI/UX Design",
    "Video Editor",
    "Virtual Assistance",
    "Web Design",
    "Web Development",
    "Other",
  ];

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
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
    if (selectedSkills.length < 5 && !selectedSkills.includes(skill)) {
      if (skill === "Other") {
        setIsOtherModalOpen(true);
      } else {
        setSelectedSkills((prevSkills) => [...prevSkills, skill]);
      }
    }
  };

  const handleOtherSkillSubmit = () => {
    if (otherSkill && selectedSkills.length < 5) {
      setSelectedSkills((prevSkills) => [...prevSkills, otherSkill]);
      setOtherSkill("");
    }
    setIsOtherModalOpen(false);
  };

  const handleSkillRemove = (skill) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.filter((selected) => selected !== skill)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobRes = await fetch("http://localhost:3000/jobs/getfreelancerJob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        freelancerEmail: JSON.parse(sessionStorage.getItem("user")).email,
      }),
    });

    if (!jobRes.status === 200) {
      throw new Error("Failed to fetch user data");
    }

    const jobResResult = await jobRes.json();

    if (Array.isArray(jobResResult)) {
      for (let i = 0; i < jobResResult.length; i++) {
        if (
          jobResResult[i].status === "assigned" &&
          formData.lookingForJob === true
        ) {
          toast.error("Cannot set looking for job while you are doing a job!", {
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
      }
    } else {
      console.error("jobResResult is not an array:", jobResResult);
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.fBio ||
      !formData.country ||
      selectedSkills.length === 0 ||
      !formData.minWage
    ) {
      toast.error("Please fill out all fields before submitting!", {
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
        skills: selectedSkills.join(", "),
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

  const toggleChat = (email) => {
    setClientEmail(email);

    setIsChatOpen((prev) => !prev);
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
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
  const openJobOfferModal = (job) => {
    setJobOffer(job);
    setIsJobOfferModal(true);
  };

  const closeJobOfferModal = () => {
    setIsJobOfferModal(false);
  };

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
          {availableJob.length === 1 &&
            availableJob[0].status === "pending" && (
              <button
                className="btn"
                onClick={() => openJobOfferModal(availableJob[0])}
              >
                View Gig Offer
              </button>
            )}
          {availableJob.length === 1 &&
            availableJob[0].status === "assigned" && (
              <button
                className="btn"
                onClick={() => toggleChat(availableJob[0].clientEmail)}
              >
                Contact Client
              </button>
            )}
          {user.totalBalance > 0 && (
            <button
              className="btn btn-secondary ml-4"
              onClick={openWithdrawModal}
            >
              Withdraw
            </button>
          )}
          <button className="btn ml-auto" onClick={handleEditToggle}>
            {isEditing ? "CANCEL" : "EDIT"}
          </button>
        </div>

        <hr />

        <div id="body-container" className="flex">
          <div id="stats-container" className="border-r-2 grid">
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
                <div className="stat-value flex items-center">
                  {user.fRating ? (
                    <StarRating rating={user.fRating} />
                  ) : (
                    "Not Rated"
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10 p-10">
              <div className="flex justify-between">
                <div className="flex justify-between">
                  <div>
                    <h1 className="font-bold">
                      {(() => {
                        if (!availableJob || !availableJob[0])
                          return "Looking for Job";

                        const status = availableJob[0].status;
                        if (status === "pending") return "Offer Pending";
                        if (status === "assigned") return "Assigend";
                        return "Looking For Job";
                      })()}
                    </h1>

                    {availableJob &&
                      availableJob[0]?.status !== "pending" &&
                      availableJob[0]?.status !== "assigned" && (
                        <>
                          {isEditing ? (
                            <input
                              type="checkbox"
                              name="lookingForJob"
                              checked={formData.lookingForJob}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                          ) : (
                            <p>{user.lookingForJob ? "Yes" : "No"}</p>
                          )}
                        </>
                      )}
                  </div>
                </div>

                <div>
                  <h1 className="font-bold">Expected Minimum Wage</h1>
                  {isEditing ? (
                    <input
                      type="number"
                      name="minWage"
                      value={formData.minWage || ""}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="Enter minimum wage"
                      min="0"
                      required
                    />
                  ) : (
                    <p>{user.minWage ? `$${user.minWage}` : "Not specified"}</p>
                  )}
                </div>
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
                    <Menu as="div" className="relative">
                      <Menu.Button className="btn btn-secondary">
                        Select Skill
                      </Menu.Button>
                      <Menu.Items className="absolute menu p-2 shadow bg-white rounded-box w-52 max-h-52 overflow-y-auto">
                        {availableSkills
                          .filter((skill) => !selectedSkills.includes(skill))
                          .map((skill) => (
                            <Menu.Item key={skill}>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active
                                      ? "bg-blue-500 text-white"
                                      : "text-black"
                                  } p-2 w-full text-left`}
                                  onClick={() => handleSkillSelect(skill)}
                                >
                                  {skill}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                      </Menu.Items>
                    </Menu>

                    <div className="flex flex-wrap gap-2 mt-2 w-96">
                      {selectedSkills.map((skill) => (
                        <div
                          key={skill}
                          className="badge badge-primary cursor-pointer px-4 py-1 rounded-full bg-blue-100 border-none"
                        >
                          {skill}
                          <span
                            className="ml-2 text-xs cursor-pointer text-red-600"
                            onClick={() => handleSkillRemove(skill)}
                          >
                            ✕
                          </span>
                        </div>
                      ))}
                    </div>
                    {selectedSkills.length === 0 && (
                      <p className="text-red-500 mt-2">
                        At least one skill must be selected.
                      </p>
                    )}
                    {selectedSkills.length >= 5 && (
                      <p className="text-red-500 mt-2">Maximum skills added.</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedSkills.length}/5 skills selected
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2 w-96">
                    {selectedSkills.map((skill) => (
                      <div
                        key={skill}
                        className="badge badge-primary px-4 py-1 rounded-full bg-blue-100 border-none"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
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

      <AddOtherSkill
        isOpen={isOtherModalOpen}
        onClose={() => setIsOtherModalOpen(false)}
        onSubmit={handleOtherSkillSubmit}
        skill={otherSkill}
        setSkill={setOtherSkill}
      />
      <JobOfferModal
        isOpen={isJobOfferModal}
        onClose={closeJobOfferModal}
        jobOffer={jobOffer}
      />
      <ChatBox isOpen={isChatOpen} onClose={toggleChat} email={clientEmail} />
    </>
  );
}
