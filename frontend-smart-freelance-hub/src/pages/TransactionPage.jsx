// TransactionPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TransactionPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [emailtosend, setemailtosend] = useState('');
    const [amount, setAmount] = useState(0);

    const handleTransaction = async () => {
        setLoading(true);

        // Simulated 60-second wait for OTP verification
        setTimeout(async () => {
            try {
                const response = await fetch('http://localhost:3000/payments/processPayment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    //contractID is null for now
                    body: JSON.stringify({ contractID: null, paymentID: null, freelancerEmail: emailtosend, amount: amount }), // example data
                });
                const result = await response.json();
                console.log(result.message);
                if (result.message === 'Payment successful') {
                    alert(result.message);
                    navigate('/');
                } else {
                    alert(result.error || 'Transaction failed');
                    navigate('/');
                }
            } catch (error) {
                console.error('Transaction error:', error);
                alert('Transaction failed');
                navigate('/');
            } finally {
                setLoading(false);
            }
        }, 10000);
    };

    return (
        <div>
            <h2>Confirm Payment</h2>
            <input type="text" placeholder="person to send" required value={emailtosend} onChange={(e) => setemailtosend(e.target.value)} />
            <input type="text" placeholder="Amount" required value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <button onClick={handleTransaction} disabled={loading}>
                {loading ? "Waiting for OTP verification..." : "Complete Transaction"}
            </button>
        </div>
    );
};

export default TransactionPage;
