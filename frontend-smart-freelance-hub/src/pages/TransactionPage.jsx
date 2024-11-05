// TransactionPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TransactionPage = () => {
    const [loading, setLoading] = useState(false);
    const [transactionId, settransactionId] = useState('');
    const [amount, setAmount] = useState(0);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();
    const paymentreciever = sessionStorage.getItem("paymentreciever");
    const senderemail = JSON.parse(sessionStorage.getItem("user")).email;
    const [timeLeft, setTimeLeft] = useState(60); // 60-second countdown
    const [isTimerActive, setIsTimerActive] = useState(true);

    useEffect(() => {
        if (otpSent && isTimerActive) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        handleTimeout();
                        navigate('/manageJobs'); // Navigate to another page after time is up
                    }
                    return prevTime - 1;
                });
            }, 1000);

            // Cleanup timer on component unmount
            return () => clearInterval(timer);
        }
    }, [otpSent, isTimerActive, navigate, transactionId]);

    const handleTimeout = async () => {
        try {
            const response = await fetch('http://localhost:3000/transactions/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: transactionId, status: "Declined" }),
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
        alert("OTP timed out!");
        navigate('/manageJobs'); // Navigate after transaction update
    };

    useEffect(() => {
        // Check if user is payment reciever is available in session storage
        const reciever = sessionStorage.getItem('paymentreciever');
        if (!reciever) {
            alert("You do not have access to this page.");
            navigate('/');
        }
    });

    const handleTransaction = async () => {
        setLoading(true);
        try {
            // Send OTP
            const response = await fetch('http://localhost:3000/otp/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: senderemail}), // Send email for OTP
            });
            const result = await response.json();
            console.log(result.message);

            if (result.message === 'OTP sent successfully') {
                setOtpSent(true); // Show OTP input after sending
            } else {
                alert(result.error || 'Failed to send OTP');
            }

            const paymentinsert = await fetch('http://localhost:3000/payments/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({useremail: senderemail}), // example data
            });
            const result2 = await paymentinsert.json();
            const paymentId = result2._id;

            const paymentResponse = await fetch('http://localhost:3000/payments/processTransaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderemail: senderemail, contractID: null, paymentId: paymentId, freelancerEmail: paymentreciever, amount: amount }), // example data
            });

            const paymentResult = await paymentResponse.json();
            console.log(paymentResult.transactionResult.insertedId);
            settransactionId(paymentResult.transactionResult.insertedId);

            if (paymentResult.message === 'Transaction inserted successfully.') {
            } else {
                alert(paymentResult.error || 'Failed to create transaction');
            }

        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP');
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
                body: JSON.stringify({ email: senderemail, otp: otp }), // Send email and OTP for verification
            });
            const result = await response.json();
            console.log(result.message);
            if (result.message === 'OTP verified successfully') {
                setIsTimerActive(false);
                const email = JSON.parse(sessionStorage.getItem("user")).email;
                const userresponse = await fetch("http://localhost:3000/user/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
                });
                const userinfo = await userresponse.json();
                if ((Number(userinfo.totalBalance) - amount)<0){
                    alert("You do not have enough balance!");
                    const transactiondecline = await fetch('http://localhost:3000/transactions/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ _id: transactionId, status: "Declined" }), // example data
                    });
                    navigate('/balancetopup');
                    return;
                }

                // Proceed with the payment after successful OTP verification
                const paymentResponse = await fetch('http://localhost:3000/payments/processPayment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transactionId: transactionId, senderemail: senderemail, freelancerEmail: paymentreciever, amount: amount }), // example data
                });
                const paymentResult = await paymentResponse.json();
                console.log(paymentResult.message);
                if (paymentResult.message === 'Payment successful') {
                    alert(paymentResult.message);
                    sessionStorage.removeItem("paymentreciever");
                    navigate('/ProfileCl');
                } else {
                    alert(paymentResult.error || 'Payment failed');
                    navigate('/manageJobs');
                }
            } else {
                alert(result.error || 'OTP verification failed');
                const transactiondecline = await fetch('http://localhost:3000/transactions/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ _id: transactionId, status: "Declined" }), // example data
                });
                navigate('/manageJobs');
            }
        } catch (error) {
            console.error('Verification error:', error);
            const transactiondecline = await fetch('http://localhost:3000/transactions/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: transactionId, status: "Declined" }), // example data
            });
            alert('Verification failed');
            navigate('/manageJobs');
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Confirmation of Payment from {senderemail}</h2>
            <h2>You are sending payment to {paymentreciever}</h2>
            {/* <input
                type="text"
                placeholder="Person to send"
                required
                value={paymentreciever}
                onChange={(e) => setemailtosend(e.target.value)}
            /> */}
            Amount <input
                type="text"
                placeholder="Amount"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
            <button onClick={handleTransaction} disabled={loading}>
                {loading ? "Sending OTP..." : "Complete Transaction"}
            </button>

            {otpSent && (
                <div>
                    <p>OTP has been sent to your email. Time left to enter OTP: {timeLeft} seconds</p>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={handleVerifyOTP} disabled={loading}>
                        {loading ? "Verifying OTP..." : "Verify OTP"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionPage;
