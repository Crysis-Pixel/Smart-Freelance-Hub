import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BalanceWithdraw = () => {
    const [amount, setAmount] = useState(0);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const email = JSON.parse(sessionStorage.getItem("user")).email;
    const [timeLeft, setTimeLeft] = useState(60); // 60-second countdown
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [currentBalance, setCurrentBalance] = useState(0);

    useEffect(() => {
        if (otpSent && isTimerActive) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        alert("OTP timed out!");
                        navigate('/Profile'); // Navigate to another page after time is up
                    }
                    return prevTime - 1;
                });
            }, 1000);

            // Cleanup timer on component unmount
            return () => clearInterval(timer);
        }
    }, [otpSent, isTimerActive, navigate]);

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
                alert("Please enter details from payment entry page.");
                navigate('/PaymentPage');
            }
        };

        const user = JSON.parse(sessionStorage.getItem('user'));
        setCurrentBalance(user.totalBalance);
        if (user?.accountType !== 'Freelancer') {
            alert("You do not have access to this page.");
            navigate('/ProfileCl');
        } else {
            checkifPaymentExists();
        }
    }, [navigate, currentBalance, email]);

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
            } else {
                alert(result.error || 'Failed to send OTP');
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
                body: JSON.stringify({ email: email, otp: otp }),
            });
            const result = await response.json();
            console.log(result.message);
            if (result.message === 'OTP verified successfully') {
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
                        alert("Withdraw successful!");
                        console.log("Withdraw successful");
                        navigate('/Profile');
                    } else {
                        alert("Failed to withdraw.");
                        navigate('/Profile');
                    }
                }
                else{
                    alert("You cannot withdraw more than you have.");
                    navigate('/Profile');
                }
            } else {
                alert(result.error || 'OTP verification failed');
                navigate("/Profile");
            }
        } catch (error) {
            console.error('Verification error:', error);
            alert('Verification failed');
            navigate("/Profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Withdraw for {email}</h2>
            Amount: <input
                type="number"
                placeholder="Amount"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
            <button onClick={handleTransaction} disabled={loading}>
                {loading ? "Sending OTP..." : "Withdraw Balance"}
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

export default BalanceWithdraw;