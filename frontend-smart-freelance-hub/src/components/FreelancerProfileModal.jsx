import React from "react";

const FreelancerProfileModal = ({ isOpen, freelancer, onClose }) => {
  if (!isOpen || !freelancer) return null;

  return (
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
            src={freelancer.profilePicture || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h3 className="text-2xl font-semibold">
            {freelancer.firstName} {freelancer.lastName}
          </h3>
          <p className="text-gray-500 mb-4">{freelancer.country}</p>
          <p className="text-gray-600 mb-4">
            <b>Rating:</b> {freelancer.rating}
          </p>
          <p className="text-gray-600 mb-4">
            <b>Bio:</b> {freelancer.fBio}
          </p>
          <p className="text-gray-600 mb-4">
            <b>Jobs Completed:</b> {freelancer.jobsCompleted}
          </p>
          <p className="text-gray-600 mb-4">
            <b>Skills:</b> {freelancer.skills}
          </p>
          <div className="flex gap-4 mt-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Send Offer
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Hire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfileModal;
