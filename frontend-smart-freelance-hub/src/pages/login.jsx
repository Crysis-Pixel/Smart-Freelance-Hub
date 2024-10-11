import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      // Making a POST request to the backend
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

      // Assuming backend returns user data along with a session token or user ID
      const { userId, token } = data;

      // Store the user ID and token in session or localStorage
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("authToken", token);

      // Redirect user to the dashboard or homepage
      navigate("/profile"); // Adjust the route as needed
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Login to Smart Freelance Hub
        </h1>

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
              type="password"
              className="grow bg-transparent focus:outline-none text-lg text-gray-800"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
              className="text-indigo-600 text-sm hover:text-indigo-800 hover:underline transition-all duration-200"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
