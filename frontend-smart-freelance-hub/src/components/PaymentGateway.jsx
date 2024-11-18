import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentGateway = ({ isOpen, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cardholderName: "",
    cvv: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const user = JSON.parse(sessionStorage.getItem("user"));
    const checkifPaymentExists = async () => {
      const response = await fetch("http://localhost:3000/payments/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useremail: user.email }),
      });
      const result = await response.json();
      console.log(result);
      if (!(result.message === "Payment not found")) {
        navigate("/");
      }
    };
    checkifPaymentExists();
  }, [isOpen, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const paymentData =
      paymentMethod === "card"
        ? { paymentMethod, cardDetails, useremail: user.email }
        : { paymentMethod, phoneNumber, useremail: user.email };

    try {
      const response = await fetch("http://localhost:3000/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
      const result = await response.json();
      if (result.message === "Payment created successfully") {
        toast.success(result.message);
        onClose();
        //navigate("profileCl");
      } else {
        alert(result.error || "Failed to save payment details");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to save payment details");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Enter Payment Details
        </h2>
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Payment Method:</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-greenPrimary focus:ring-green-500"
            >
              <option value="">Select a method</option>
              <option value="card">Bank Card</option>
              <option value="bkash">Bkash</option>
            </select>
          </label>

          {paymentMethod === "card" && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Card Number"
                required
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Expiry Date"
                required
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, expiryDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Cardholder Name"
                required
                onChange={(e) =>
                  setCardDetails({
                    ...cardDetails,
                    cardholderName: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="CVV"
                required
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cvv: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {paymentMethod === "bkash" && (
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 font-semibold rounded-md shadow-md text-white ${
              loading ? "bg-gray-400" : "bg-greenPrimary hover:bg-green-600"
            } focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75`}
          >
            {loading ? "Processing..." : "Submit Payment Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentGateway;
