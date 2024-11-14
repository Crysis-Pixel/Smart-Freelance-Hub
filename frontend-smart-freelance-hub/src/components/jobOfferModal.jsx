import React, { useState, useEffect } from "react";
import ClientProfileModal from "./ClientProfileModal";

export default function JobOfferModal({ jobOffer, isOpen, onClose }) {
  const [isClientProfileModalOpen, setIsClientProfileModalOpen] =
    useState(false);
  const [clientMail, setClientMail] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setUserData(null);
      setClientMail("");
    }
  }, [isOpen]);

  if (!isOpen || !jobOffer) return null;

  const {
    clientEmail,
    createdAt,
    description,
    offeredPrice,
    requirements = [],
    title,
    _id,
    freelancerEmail,
  } = jobOffer;

  const fetchUserData = async (email) => {
    setUserData(null);
    try {
      const response = await fetch("http://localhost:3000/user/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleVisitProfile = (email) => {
    setClientMail(email);
    fetchUserData(email);
    setIsClientProfileModalOpen(true);
  };

  const handleAcceptOffer = async () => {
    try {
      const response = await fetch("http://localhost:3000/jobs/assignjob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: _id,
          clientEmail: clientEmail,
          freelancerEmail: freelancerEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept job offer");
      }

      console.log("Job offer accepted successfully!");
      onClose(); // Close the modal after accepting
    } catch (err) {
      console.error("Error accepting job offer:", err.message);
    }
  };

  const handleDeclineOffer = async () => {
    try {
      const response = await fetch("http://localhost:3000/jobs/declineJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: _id,
          freelancerEmail: freelancerEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to decline job offer");
      }

      console.log("Job offer declined successfully!");
      onClose(); // Close the modal after declining
    } catch (err) {
      console.error("Error declining job offer:", err.message);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative z-50">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-semibold"
            onClick={onClose}
          >
            &times;
          </button>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>

          <div className="mb-4">
            <div className="flex justify-between">
              <p className="text-gray-600">
                <b>Client Email:</b> {clientEmail}
              </p>
              <p
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => handleVisitProfile(clientEmail)}
              >
                Visit Profile
              </p>
            </div>
            <p className="text-gray-600">
              <b>Created At:</b> {new Date(createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <b>Description:</b> {description}
            </p>
            <p className="text-gray-600">
              <b>Offered Price:</b> ${offeredPrice}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 font-medium">Requirements:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {requirements.length > 0 ? (
                requirements.map((requirement, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm"
                  >
                    {requirement}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No specific requirements</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
              onClick={handleDeclineOffer}
            >
              Decline Offer
            </button>
            <button
              className="flex-1 py-2 rounded-md border border-gray-300 hover:border-gray-400 text-gray-700 transition-colors bg-greenPrimary hover:bg-green-500"
              onClick={handleAcceptOffer}
            >
              Accept Offer
            </button>
          </div>
        </div>
      </div>

      {isClientProfileModalOpen && userData && (
        <ClientProfileModal
          isOpen={isClientProfileModalOpen}
          userData={userData}
          onClose={() => setIsClientProfileModalOpen(false)}
        />
      )}
    </>
  );
}
