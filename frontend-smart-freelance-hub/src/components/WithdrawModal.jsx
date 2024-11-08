import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentGateway from "../components/PaymentGateway.jsx";


const WithdrawModal = ({ onClose }) => {
    const [amount, setAmount] = useState(0);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const email = JSON.parse(sessionStorage.getItem("user")).email;
    const [timeLeft, setTimeLeft] = useState(60); // 60-second countdown
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
                        onclose();
                    }
                    return prevTime - 1;
                });
            }, 1000);

            // Cleanup timer on component unmount
            return () => clearInterval(timer);
        }
    }, [otpSent, isTimerActive, onclose]);

    useEffect(() => {
        const checkifPaymentExists = async () => {
            const response = await fetch('http://localhost:3000/payments/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ useremail: email }),
            });
            const result = await response.json();
            //console.log(result);
            if ((result.message === "Payment not found")) {
                toast.error("Please enter details from payment entry page.");
                openModal();
            }
        };
        checkifPaymentExists();
    }, [email]);

    const handleTransaction = async () => {

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/otp/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }), // Send email for OTP
            });
            const result = await response.json();
            console.log(result.message);

            if (result.message === 'OTP sent successfully') {
                setOtpSent(true);
                toast.success("OTP sent successfully");
            } else {
                toast.error(result.error || 'Failed to send OTP');
                onClose();
            }

        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Failed to send OTP');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/otp/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, otp: otp }),
            });
            const result = await response.json();
            console.log(result.message);
            if (result.message === 'OTP verified successfully') {

                const currentuser = await fetch("http://localhost:3000/user/getUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                    });
                const userinfo = await currentuser.json();
                const currentBalance = userinfo.totalBalance;

                if ((currentBalance - amount) > 0){
                    setIsTimerActive(false);
                    const userinfo = await fetch("http://localhost:3000/user/updateUserBalance", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: email, amount: -amount }),
                    });
                    const result2 = await userinfo.json();
                    //console.log(result2);
                    if (result2 === "Top up successful") {
                        toast.success("Withdraw successful!");
                        console.log("Withdraw successful");
                        onClose();
                    } else {
                        toast.error("Failed to withdraw.");
                        onClose();
                    }
                }
                else{
                    toast.error("You cannot withdraw more than you have.");
                    onClose();
                }
            } else {
                toast.error(result.error || 'OTP verification failed');
                onClose();
            }
        } catch (error) {
            console.error('Verification error:', error);
            toast.error('Verification failed');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-2">Withdraw Balance</h2>
        <p className="text-gray-600 mb-4">For: {email}</p>

        {!otpSent ? (
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Enter amount"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">
              Amount to be removed: <span className="font-bold">{amount}</span>
            </p>
          </div>
        )}

        {!otpSent && (
          <button
            className="w-full bg-greenPrimary text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
            onClick={handleTransaction}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {otpSent && (
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
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-2"
              onClick={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
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
      <PaymentGateway isOpen={isModalOpen} onClose={closeModal} />
    </div>
    );
};

export default WithdrawModal;
