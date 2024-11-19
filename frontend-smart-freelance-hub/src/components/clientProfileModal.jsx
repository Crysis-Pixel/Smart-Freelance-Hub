import React, { useState } from "react";
import ReviewsModal from "../components/ReviewsModal.jsx"; // Adjust the path as needed
import { toast } from "react-toastify"; // Ensure you have toast for error handling

export default function ClientProfileModal({ isOpen, userData, onClose }) {
  if (!isOpen || !userData) return null;

  const {
    firstName,
    lastName,
    email,
    accountCreated,
    cBio,
    country,
    profilePicture,
    cRating,
  } = userData;

  // Reviews State
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [freelancerReviews, setFreelancerReviews] = useState([]);

  const handleCloseReviewsModal = () => {
    setIsReviewsModalOpen(false);
  };

  const handleOpenReviewsModal = async () => {
    console.log("Fetching reviews...");
    try {
      const response = await fetch("http://localhost:3000/reviews/getUserReviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reviewedType: "C",
        }),
      });

      if (response.status !== 200) {
        toast.error("No Reviews Found");
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setFreelancerReviews(data);
      setIsReviewsModalOpen(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  function StarRating({ rating }) {
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating - filledStars >= 0.5;
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(filledStars)].map((_, i) => (
          <span key={`filled-${i}`} className="text-yellow-400">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-semibold"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex flex-col items-center">
          <img
            src={profilePicture}
            alt={`${firstName} ${lastName}`}
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {firstName} {lastName}
          </h2>
          <p className="text-gray-600 mb-4">{email}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-800">
            <b>Country:</b> {country}
          </p>
          <p className="text-gray-800">
            <b>Bio:</b> {cBio || "No client bio available"}
          </p>
          <p className="text-gray-800">
            <b>Account Created:</b> {accountCreated}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-gray-800">
            <b>Rating:</b>
          </p>
          <div
            className="flex items-center cursor-pointer"
            onClick={handleOpenReviewsModal}
          >
            {cRating ? <StarRating rating={cRating} /> : "Not Rated"}
          </div>
        </div>

        {/* Reviews Modal */}
        <ReviewsModal
          isOpen={isReviewsModalOpen}
          onClose={handleCloseReviewsModal}
          reviews={freelancerReviews}
        />
      </div>
    </div>
  );
}
