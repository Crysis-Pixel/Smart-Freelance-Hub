import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ClientProfile() {
  const [user, setUser] = useState({
    accountCreated: "",
    accountType: "Client", // Default as Client based on the data
    cbio: "", // Use cbio for client bio
    country: "",
    email: "",
    firstName: "",
    isVerified: false,
    totalProjectsPosted: 0,
    lastActive: "",
    lastName: "",
    projectsInProgress: 0,
    totalSpending: 0,
    cRating: 0, // Use cRating for client rating
    preferredSkills: "",
    languagePreference: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [countries, setCountries] = useState([]); // State for storing country list
  const navigate = useNavigate();

  // Redirect user if no user info is in sessionStorage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      navigate("/login"); // Redirect to login if user data is not present
      return;
    }
  }, [navigate]);

  // Fetch user data from the API on component mount
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
    try {
      const updatedData = { ...user, ...formData }; // Merge original and form data
      const response = await fetch("http://localhost:3000/user/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const text = await response.text();
      let updatedUser;
      try {
        updatedUser = JSON.parse(text);

        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        throw new Error("Invalid JSON response");
      }

      if (!response.ok) {
        console.error("Server Error Message:", updatedUser);
        throw new Error(updatedUser.message || "Failed to update user data");
      }

      setUser(updatedUser); // Update user state with the new data
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Header />
      <div id="dashboard" className="container mx-auto border my-32">
        <div
          id="profile-container"
          className="flex gap-10 items-center md:p-10 p-2"
        >
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img
                src={
                  user.profilePicture ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt="Profile"
              />
            </div>
          </div>
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
          <button className="btn ml-auto" onClick={handleEditToggle}>
            {isEditing ? "CANCEL" : "EDIT"}
          </button>
        </div>

        <hr />

        <div id="body-container" className="flex">
          <div id="stats-container" className="border-r-2">
            <div className="stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Total Spending</div>
                <div className="stat-value">
                  {user.totalSpending ? `$${user.totalSpending}` : "$0"}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Total Projects Posted</div>
                <div className="stat-value">
                  {user.totalProjectsPosted || 0}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Client Rating</div>
                <div className="stat-value">{user.cRating || "Not Rated"}</div>
                <div className="stat-desc">★★★★★</div>
              </div>
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
                <h1 className="font-bold">Language Preference</h1>
                {isEditing ? (
                  <input
                    type="text"
                    name="languagePreference"
                    value={formData.languagePreference || ""}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Language Preference"
                  />
                ) : (
                  <p>{user.languagePreference || "Not specified"}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div id="bio-container" className="px-10 py-5">
              <div id="bio-title" className="flex justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Client Bio</h1>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Budget: $$ - $$$</h2>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4">
                    <textarea
                      name="cbio"
                      value={formData.cbio || ""}
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
                  <p>{user.cbio || "Bio not available"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
