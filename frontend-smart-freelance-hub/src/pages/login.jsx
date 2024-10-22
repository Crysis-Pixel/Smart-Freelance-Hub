import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect user if user info is in sessionStorage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      navigate("/home"); // Redirect to home if user data is present
      return;
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      // Login request
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Handle errors from the backend
      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // Fetch user data after login
      const userresponse = await fetch("http://localhost:3000/user/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const userdata = await userresponse.json();

      // Save user data in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(userdata));

      // Determine where to navigate based on accountType
      if (userdata.accountType === "Client") {
        navigate("/profileCl"); // Navigate to client profile
      } else if (userdata.accountType === "Freelancer") {
        navigate("/profile"); // Navigate to freelance profile
      } else if (userdata.accountType === "Both") {
        navigate("/home"); // Navigate to homepage for "both" users
      } else {
        setError("Invalid account type. Please contact support.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Login to Smart Freelance Hub
        </h1>

        <div className="max-w-screen-sm flex flex-col justify-center mx-auto items-center gap-4">
          <h1 className="text-xl">Sign-in with Google Account</h1>
          <GoogleLoginButton />
          <h1 className="text-xl">OR</h1>
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email Input */}
          <label className="input input-bordered flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-5 w-5 text-greenPrimary opacity-80"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="email"
              className="grow bg-transparent focus:outline-none text-lg text-gray-800"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Password Input */}
          <label className="input input-bordered flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-5 w-5 text-greenPrimary opacity-80"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={passwordVisible ? "text" : "password"} // Toggle password visibility
              className="grow bg-transparent focus:outline-none text-lg text-gray-800"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)} // Toggle state
              className="focus:outline-none"
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-greenPrimary text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
          >
            Login
          </button>

          {/* Forgot Password Link */}
          <div className="flex justify-center">
            <a
              href="#"
              className="text-indigo-600 text-sm hover:text-indigo-800"
            >
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
