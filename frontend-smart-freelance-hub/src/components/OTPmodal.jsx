// OTPModal.js
import React, { useState, useEffect } from "react";

const OTPModal = ({ email, isModalOpen, closeModal }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (element, index) => {
    if (element.key === "Backspace" && !otp[index]) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      if (element.target.previousSibling) {
        element.target.previousSibling.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const enteredOTP = otp.join("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/user/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: enteredOTP, email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("OTP Verified!");
        setIsOtpValid(true);
        closeModal();
      } else {
        setIsOtpValid(false);
        setOtp(new Array(6).fill(""));
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setIsOtpValid(false);
      setOtp(new Array(6).fill(""));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setOtp(new Array(6).fill(""));
      setIsOtpValid(true);
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-55">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className={`w-12 h-12 text-center border rounded-md text-lg focus:outline-none ${
                !isOtpValid ? "border-red-500" : "border-gray-300"
              }`}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              disabled={isSubmitting}
            />
          ))}
        </div>
        {!isOtpValid && (
          <p className="text-red-500 mb-2 text-center">
            Invalid OTP, please try again.
          </p>
        )}
        <button
          onClick={handleSubmit}
          className="w-full bg-greenPrimary hover:bg-green-800 text-white py-2 rounded-md transition duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>
        <button
          onClick={closeModal}
          className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md transition duration-200"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
