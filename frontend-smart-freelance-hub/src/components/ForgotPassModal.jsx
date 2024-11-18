import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassModal = ({ onClose }) => {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const email = JSON.parse(sessionStorage.getItem("user")).email;
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (otpSent && isTimerActive) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            toast.error("OTP timed out!");
            onClose();
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [otpSent, isTimerActive, onClose]);

  const handleOTPSend = async () => {
    setLoading(true);
    try {

        const response1 = await fetch("http://localhost:3000/user/getUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email }),
        });
        
        if (response1.status === 200) {
            const result1 = await response1.json();
            if (result1.isGoogle === true){
                toast.error("Password cannot be changed as user is a google account.");
                onClose();
                return;
            }
        }
        else{
            toast.error("User does not exist in database");
            onClose();
            return;
        }


      const response = await fetch("http://localhost:3000/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
      const result = await response.json();

      if (result.message === "OTP sent successfully") {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        toast.error(result.error || "Failed to send OTP");
        onClose();
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: otp }),
      });
      const result = await response.json();

      if (result.message === "OTP verified successfully") {
        setOtpVerified(true);
        setIsTimerActive(false);
        toast.success("OTP verified. You can now set a new password.");
        // const userupdate = await fetch(
        //   "http://localhost:3000/user/updateUser",
        //   {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ email: email, password: password}),
        //   }
        // );
        // const result2 = await userupdate.json();
        // console.log(result2);

        // if (result2 === "Top up successful") {
        //   toast.success(`Balance updated successfully by ${amount}!`);
        //   onClose();
        // } else {
        //   toast.error("Failed to update balance.");
        //   onClose();
        // }
      } else {
        toast.error(result.error || "OTP verification failed");
        onClose();
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try{
        const userupdate = await fetch(
          "http://localhost:3000/user/updateUser",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password}),
          }
        );

        if (userupdate.status === 200) {
          toast.success(`Password changed successfully.`);
          onClose();
        } else {
          toast.error("Failed to update password.");
          onClose();
        }
    }
    catch(error){
        console.error("Error updating password:", error);
        toast.error("Failed to update password.");
    }

    const handleCancel = () => {
        setOtpSent(false);
        setOtpVerified(false);
        setIsTimerActive(false);
        setTimeLeft(60);
        setOtp("");
        setPassword("");
        onClose();
      };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-2">Forgot Password Service</h2>

        {!otpSent && (
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Please enter your email:
            </label>
            <input
              type="text"
              id="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail((e.target.value))}
            />
            <button
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200 mt-2"
              onClick={handleOTPSend}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* {!otpSent && (
          <button
            className="w-full bg-greenPrimary text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
            onClick={handleOTPSend}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )} */}

        {otpSent && !otpVerified &&(
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              OTP has been sent to your email. Time left: {timeLeft} seconds
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
            />
            <button
              className="w-full bg-greenPrimary text-white py-2 rounded-md hover:bg-green-500 transition duration-200 mt-2"
              onClick={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </div>
        )}

        {otpVerified && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter new password:
            </label>
            <input
              type="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              required
            />
            <button
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200 mt-2"
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        )}

        <button
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200 mt-4"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
      {/* <PaymentGateway isOpen={isModalOpen} onClose={closeModal} /> */}
    </div>
  );
};

export default ForgotPassModal;
