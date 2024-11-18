import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FreelancerProfileModal = ({
  isOpen,
  freelancer,
  jobId,
  onClose,
  clientMail,
}) => {
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState("");
  const [error, setError] = useState("");
  console.log(freelancer);
  if (!isOpen || !freelancer) return null;

  const adjustedMinWage =
  Math.round(freelancer.jobsCompleted > 0
      ? freelancer.minWage * 1.2
      : freelancer.minWage);
  const minOffer = Math.round(adjustedMinWage / 1.2);

  const handleHire = async () => {
    const payload = {
      jobId,
      clientEmail: clientMail,
      freelancerEmail: freelancer.email,
      offeredPrice: Math.round(adjustedMinWage),
    };

    try {
      const response = await fetch("http://localhost:3000/jobs/jobPending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to send job offer");
      alert("Hire request sent successfully!");
      onClose();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSendOffer = async () => {
    const payload = {
      jobId,
      clientEmail: clientMail,
      freelancerEmail: freelancer.email,
      offeredPrice: parseFloat(offeredPrice),
    };

    try {
      const response = await fetch("http://localhost:3000/jobs/jobPending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to send custom offer");
      toast.success("Offer sent successfully!");
      setOfferModalOpen(false);
      onClose();
    } catch (err) {
      toast.error(`${err.message}. User is already assigned to a task.`);
    }
  };

  const validateOfferedPrice = (price) => {
    if (price < minOffer) {
      setError(`Offer must be at least ${minOffer}`);
    } else {
      setError("");
    }
    setOfferedPrice(price);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-8 w-11/12 max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
          >
            X
          </button>

          <div className="flex flex-col items-center text-center">
            <img
              src={
                freelancer.profilePicture || "https://via.placeholder.com/100"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h3 className="text-2xl font-semibold">
              {freelancer.firstName} {freelancer.lastName}
            </h3>
            <p className="text-gray-500 mb-4">{freelancer.country}</p>
            <p className="text-gray-600 mb-4">
              <b>Rating:</b> {freelancer.rating || "Not Rated"}
            </p>
            <p className="text-gray-600 mb-4">
              <b>Bio:</b> {freelancer.fBio || "Bio not updated"}
            </p>
            <p className="text-gray-600 mb-4">
              <b>Jobs Completed:</b> {freelancer.jobsCompleted || "New"}
            </p>
            <p className="text-gray-600 mb-4">
              <b>Rate:</b> ${adjustedMinWage} /Project 
            </p>
            <p className="text-gray-600 mb-4">
              <b>Skills:</b> {freelancer.skills}
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setOfferModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Send Offer
              </button>
              <button
                onClick={handleHire}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Hire
              </button>
            </div>
          </div>
        </div>
      </div>

      {offerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 relative">
            <button
              onClick={() => setOfferModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              X
            </button>

            <h3 className="text-2xl font-semibold mb-4">Enter Offer Price</h3>
            <p className="text-gray-600 mb-4">Minimum offer: ${minOffer}</p>
            <input
              type="number"
              value={offeredPrice}
              onChange={(e) => validateOfferedPrice(e.target.value)}
              placeholder="Enter your offer"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex justify-end">
              <button
                onClick={handleSendOffer}
                disabled={!offeredPrice || error}
                className={`mt-4 px-4 py-2 rounded-md text-white ${
                  error || !offeredPrice
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-greenPrimary hover:bg-green-600"
                }`}
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FreelancerProfileModal;
