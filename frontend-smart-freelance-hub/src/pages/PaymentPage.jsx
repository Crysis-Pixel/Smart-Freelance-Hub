// PaymentPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiryDate: '', cardholderName: '', cvv: '' });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is client from session storage
        const user = JSON.parse(sessionStorage.getItem('user'));
        const checkifPaymentExists = async() =>{
            const response = await fetch('http://localhost:3000/payments/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({useremail: user.email}),
            });
            const result = await response.json();
            console.log(result);
            if (!(result.message === "Payment not found")){
                navigate('/');
            }
        }
        checkifPaymentExists();
    }, [navigate]);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const user = JSON.parse(sessionStorage.getItem("user"));
        const paymentData = paymentMethod === 'card' ? { paymentMethod, cardDetails, useremail: user.email } : { paymentMethod, phoneNumber, useremail: user.email };

        try {
            const response = await fetch('http://localhost:3000/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });
            const result = await response.json();
            console.log(result.message === 'Payment created successfully');
            if (result.message === 'Payment created successfully') {
                alert(result.message);
                if (user.accountType === 'Client') navigate("/ProfileCl");
                else navigate("/Profile");
            } else {
                alert(result.error || 'Failed to save payment details');
            }
        } catch (error) {
            console.error("Error submitting payment:", error);
            alert('Failed to save payment details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Enter Payment Details for {JSON.parse(sessionStorage.getItem('user')).email}</h2>
            <form onSubmit={handlePaymentSubmit}>
                <label>
                    Payment Method:
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
                        <option value="">Select a method</option>
                        <option value="card">Bank Card</option>
                        <option value="bkash">Bkash</option>
                    </select>
                </label>

                {paymentMethod === 'card' && (
                    <div>
                        <input type="text" placeholder="Card Number" required onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})} />
                        <input type="text" placeholder="Expiry Date" required onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})} />
                        <input type="text" placeholder="Cardholder Name" required onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})} />
                        <input type="text" placeholder="CVV" required onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} />
                    </div>
                )}

                {paymentMethod === 'bkash' && (
                    <input type="text" placeholder="Phone Number" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Submit Payment Details"}
                </button>
            </form>
        </div>
    );
};

export default PaymentPage;
