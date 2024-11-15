import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyAccountPrompt = ({ isOpen, onClose, email, accountType }) => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false); // New state for handling resend
  const navigate = useNavigate();

  const handleVerifyOTP = async () => {
    if (otp.length !== 6 || isNaN(otp)) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    setErrorMessage("");
    setIsVerifying(true);

    try {
      const response = await fetch("http://localhost:3000/user/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Navigate to the appropriate profile page
        if (accountType === "Client") {
          navigate("/profileCl"); // Redirect to Client profile
        } else if (accountType === "Freelancer") {
          navigate("/profile"); // Redirect to Freelancer profile
        }
      } else {
        setErrorMessage(data.message || "OTP verification failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };
  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const response = await fetch("http://localhost:3000/user/resendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.status === 200) {
        alert("OTP has been resent to your email.");
      } else {
        alert(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      alert("An error occurred while resending the OTP.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSkipForLater = () => {
    if (accountType === "Client") {
      navigate("/profileCl"); // Redirect to Client profile
    } else if (accountType === "Freelancer") {
      navigate("/profile"); // Redirect to Freelancer profile
    } else
    {
      navigate("/home");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Verify Your Account</h2>
        <p className="mb-4">Enter the 6-digit OTP sent to your email.</p>

        {/* OTP Input Field */}
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border rounded mb-4 text-center"
        />

        {/* Error Message */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleSkipForLater}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            disabled={isVerifying}
          >
            Skip for Later
          </button>
          <button
            onClick={handleVerifyOTP}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </div>
         {/* Resend OTP Button */}
         <div className="flex justify-center mt-4">
            <button
              onClick={handleResendOTP}
              className="btn px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-300"
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          </div>
      </div>
    </div>
  );
};

export default VerifyAccountPrompt;
