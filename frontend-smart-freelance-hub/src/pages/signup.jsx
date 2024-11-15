import { useEffect, useState, useContext } from "react";
import { fetchEx } from "../utils/common";
import GoogleLoginButton from "../components/GoogleSignUpButton";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../contexts/Modalcontext";
import OTPModal from "../components/OTPmodal";
import VerifyAccountPrompt from "../components/VerifyAccountPrompt";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    phoneNumber: "",
    accountType: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formError, setFormError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [closeVerifyModal, setCloseVerifyModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const navigate = useNavigate();

  // needed for modal
  const { openModal } = useContext(ModalContext);

  // Redirect user if user info is in sessionStorage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      navigate("/home"); // Redirect to home if user data is present
      return;
    }
  }, [navigate]);

  // Fetch country data from the REST Countries API
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryList = data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        countryList.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      })
      .catch((error) => console.error("Error fetching country data:", error));
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setIsChecked(checked); // Update checkbox state
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Validate the form before submission
  const validateForm = () => {
    // Check if all required fields are filled and checkbox is checked
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.password &&
      formData.country &&
      formData.phoneNumber &&
      formData.accountType &&
      isChecked
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormError("Please fill in all fields and accept the terms.");
      return;
    }

    setFormError("");

    //Added by Mostakim
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Invalid email format.");
      return;
    }
    const checkEmailResponse = await fetch(
      "http://localhost:3000/user/checkUserEmail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      }
    );
    const emailCheckData = await checkEmailResponse.json();
    if (emailCheckData.exists) {
      setFormError("Email already exists. Please use a different email.");
      alert("Email already exists. Please use a different email.");
      return;
    }

    const response = await fetch("http://localhost:3000/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountType: formData.accountType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
      }),
    });

    const data = await response.json();

    // If registration is successful
    if (response.status === 200) {
      //Added by Mostakim
      toast.success("Account Created Successfully!", {
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
      const userresponse = await fetch("http://localhost:3000/user/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const userdata = await userresponse.json();

      sessionStorage.setItem("user", JSON.stringify(userdata));
      // Redirect based on account type
      if (formData.accountType === "Client") {
        //navigate("/profileCl"); // Redirect to Client profile
      } else if (formData.accountType === "Freelancer") {
        //navigate("/profile"); // Redirect to Freelancer profile
      }
      setOpenVerifyModal(true);
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-screen-md w-full">
          <h1 className="text-center text-6xl pb-10">
            Sign-Up to get started!
          </h1>

          <div className="max-w-screen-sm flex flex-col justify-center mx-auto items-center gap-4">
            {/* apple button hidden */}
            {/* <button className="btn">Continue with Apple Account</button> */}

            {/* Added by Mostakim */}
            <h1 className="text-xl">Sign-up with Google Account</h1>
            <GoogleLoginButton />
            <h1 className="text-xl divider">OR</h1>
          </div>
          <hr className="max-w-screen-sm mx-auto" />

          <form
            action=""
            className="max-w-screen-sm grid md:grid-cols-2 grid-cols-1 mx-auto md:gap-4 gap-2"
            onSubmit={handleSubmit}
          >
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">First Name</span>
              </div>
              <input
                type="text"
                placeholder="'John'"
                className="input input-bordered"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Last Name</span>
              </div>
              <input
                type="text"
                placeholder="'Smith'"
                className="input input-bordered"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 col-span-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="email"
                className="grow"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                title="Please enter a valid email address (e.g., example@example.com)."
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 col-span-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>

              <input
                type={passwordVisible ? "text" : "password"}
                className="grow"
                placeholder="Enter your password here"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength="6"
                // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$" // Remove later
                title="Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)."
              />

              <button
                type="button"
                className="focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6 opacity-70"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.455 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-4.997 7-9.542 7S3.732 16.057 2.458 12z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6 opacity-70"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.583 10.583A3 3 0 0 0 13.417 13.417M9.858 9.858A3.993 3.993 0 0 1 12 9a4 4 0 0 1 4 4m1.458 2.958C19.268 16.057 15.545 19 12 19c-4.545 0-8.268-2.943-9.542-7a12.683 12.683 0 0 1 1.86-3.162m7.06-3.06A12.683 12.683 0 0 1 12 5c4.545 0 8.268 2.943 9.542 7"
                    />
                  </svg>
                )}
              </button>
            </label>

            <label className="form-control w-full col-span-2">
              <select
                className="select select-bordered w-full"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full col-span-2">
              <input
                type="text"
                placeholder="Phone Number"
                className="input input-bordered"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                pattern="^\+?[0-9]{1,4}?[0-9]{7,15}$" // Regex pattern to allow international numbers
                title="Phone number must be between 7 to 15 digits, optionally starting with a '+' sign."
                maxLength="15" // Maximum length for phone number
                minLength="7" // Minimum length for phone number
              />
            </label>
            <label className="form-control w-full col-span-2">
              <select
                className="select select-bordered w-full"
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select account type</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Client">Client</option>
              </select>
            </label>

            {/* Checkbox for terms and conditions */}
            <div className="col-span-2 flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                name="terms"
                checked={isChecked}
                onChange={handleInputChange}
              />
              <label htmlFor="terms">
                I agree to the <Link to="/terms">Terms and Conditions</Link>
              </label>
            </div>

            <button
              type="submit"
              className={`btn btn-primary col-span-2 ${
                !validateForm() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!validateForm()}
              // onClick={openModal}
            >
              Sign Up
            </button>

            {/* Error message */}
            {formError && (
              <div className="text-red-500 col-span-2">{formError}</div>
            )}
          </form>
        </div>
      </div>
      
      <VerifyAccountPrompt
        isOpen={openVerifyModal}
        onClose={closeVerifyModal}
        email={formData.email}
        accountType={formData.accountType}
      />
    </>
  );
}
