import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyAccountPrompt = () => {
  const [isOpen, setIsOpen] = useState(true); // State to control modal visibility
  const navigate = useNavigate();

  const handleVerifyNow = () => {
    // Navigate to the verification page
    navigate("/verify-account");
    setIsOpen(false); // Close the modal
  };

  const handleSkipForLater = () => {
    // Navigate to a different page
    navigate("/home");
    setIsOpen(false); // Close the modal
  };

  if (!isOpen) return null; // Don't render the modal if it's closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Verify Your Account</h2>
        <p className="mb-6">
          Would you like to verify your account now, or skip for later?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleVerifyNow}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Verify Now
          </button>
          <button
            onClick={handleSkipForLater}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Skip for Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPrompt;
