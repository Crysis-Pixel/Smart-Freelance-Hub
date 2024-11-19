import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TransactionModal = ({ job, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const paymentReceiver = job.freelancerEmail;
  const senderEmail = JSON.parse(sessionStorage.getItem("user")).email;
  const [timeLeft, setTimeLeft] = useState(60); // 60-second countdown
  const [isTimerActive, setIsTimerActive] = useState(true);
  const amount = job.offeredPrice;

  useEffect(() => {
    if (otpSent && isTimerActive) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimeout();
            navigate("/manageJobs");
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [otpSent, isTimerActive, navigate]);

  const handleTimeout = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/transactions/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: transactionId, status: "Declined" }),
        }
      );
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
    toast.error("OTP timed out!");
    onClose();
  };

  const handleTransaction = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:3000/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: senderEmail }),
      });
      const result = await response.json();

      if (result.message === "OTP sent successfully") {
        setOtpSent(true);
      } else {
        toast.error(result.error || "Failed to send OTP");
        onClose();
      }

      const paymentInsert = await fetch("http://localhost:3000/payments/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useremail: senderEmail }),
      });
      const result2 = await paymentInsert.json();
      const paymentId = result2._id;

      const paymentResponse = await fetch(
        "http://localhost:3000/payments/processTransaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderemail: senderEmail,
            paymentId,
            freelancerEmail: paymentReceiver,
            amount,
          }),
        }
      );

      const paymentResult = await paymentResponse.json();
      setTransactionId(paymentResult.transactionResult.insertedId);
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
        body: JSON.stringify({ email: senderEmail, otp }),
      });
      const result = await response.json();

      if (result.message === "OTP verified successfully") {
        setIsTimerActive(false);
        const userResponse = await fetch("http://localhost:3000/user/getUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: senderEmail }),
        });
        const userInfo = await userResponse.json();

        if (Number(userInfo.totalBalance) - amount < 0) {
          toast.error("Insufficient balance!");
          onClose();
          return;
        }

        const paymentResponse = await fetch(
          "http://localhost:3000/payments/processPayment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transactionId,
              senderemail: senderEmail,
              freelancerEmail: paymentReceiver,
              amount,
            }),
          }
        );
        const paymentResult = await paymentResponse.json();

        if (paymentResult.message === "Payment successful") {
          const jobIsPaidResponse = await fetch(
            "http://localhost:3000/jobs/isPaid",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jobId: job._id
              }),
            }
          );

          if (jobIsPaidResponse.status == 200){
            toast.success(paymentResult.message);
            sessionStorage.removeItem("paymentreciever");
            onClose();
            navigate("/manageJobs");
          }
          else{
            toast.error(paymentResult.error || "Payment failed");
            onClose();
            navigate("/manageJobs");
          } 
        } else {
          toast.error(paymentResult.error || "Payment failed");
          onClose();
          navigate("/manageJobs");
        }
      } else {
        toast.error(result.error || "OTP verification failed");
        onClose();
        navigate("/manageJobs");
      }
    } catch (error) {
      console.error("Verification error:", error);
      onClose();
      navigate("/manageJobs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Confirm Payment</h2>
        <p className="text-gray-600 mb-4">
          Sending payment from {senderEmail} to {paymentReceiver}
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <p className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            {amount}
          </p>
        </div>

        {!otpSent ? (
          <button
            onClick={handleTransaction}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Complete Transaction"}
          </button>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              OTP sent. Time left: {timeLeft} seconds
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter OTP"
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 mt-2"
              disabled={loading}
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 mt-4"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TransactionModal;
