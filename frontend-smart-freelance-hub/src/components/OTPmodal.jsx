import React, { useState, useEffect, useContext } from "react";
import { ModalContext } from "../contexts/ModalContext";

const OTPModal = ({ correctOTP }) => {
  const { isModalOpen, closeModal } = useContext(ModalContext);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isOtpValid, setIsOtpValid] = useState(true);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = () => {
    const enteredOTP = otp.join("");
    if (enteredOTP === correctOTP) {
      alert("OTP Verified!");
      setIsOtpValid(true);
      closeModal();
    } else {
      setIsOtpValid(false);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-55">
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
              onFocus={(e) => e.target.select()}
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
        >
          Verify
        </button>
        <button
          onClick={closeModal}
          className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md transition duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
