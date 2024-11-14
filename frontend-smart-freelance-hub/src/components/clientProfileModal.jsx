// src/components/ClientProfileModal.jsx

import React from "react";

export default function ClientProfileModal({ isOpen, userData, onClose }) {
  if (!isOpen || !userData) return null;

  const {
    firstName,
    lastName,
    email,
    accountType,
    accountCreated,
    cBio,
    fBio,
    country,
    skills,
    profilePicture,
    phoneNumber,
    totalBalance,
    cRating,
    fRating,
    jobsCompleted,
    minWage,
    lookingForJob,
  } = userData;

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
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative z-50">
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
          <div className="mb-4">
            <p className="text-gray-800">
              <b>Bio:</b> {cBio || "No client bio available"}
            </p>
          </div>
          <p className="text-gray-800">
            <b>Account Created:</b> {accountCreated}
          </p>
          <p className="text-gray-800">
            <b>Last Active:</b> {userData.lastActive}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-gray-800">
            <b>Client Rating:</b>{" "}
            {cRating ? <StarRating rating={cRating} /> : "Not Rated"}
          </p>
        </div>
      </div>
    </div>
  );
}
