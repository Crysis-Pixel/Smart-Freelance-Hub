import React, { useState, useEffect } from "react";
import FreelancerProfileModal from "./FreelancerProfileModal";

const GigContainerModal = ({ isOpen, onClose, freelancers }) => {
  const [page, setPage] = useState(0);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clientAccount = sessionStorage.getItem("user");
  const clientMail = JSON.parse(clientAccount);
  const closeModal = () => {
    setPage(0);
    onClose();
  };

  if (!isOpen) return null;

  const newUsersSorted = [...freelancers.newUsers]
    .filter(
      (user) =>
        user.similarity_value >= 0.5 && user.user.email !== clientMail.email
    )
    .sort((a, b) => b.similarity_value - a.similarity_value);

  const oldUsersSorted = [...freelancers.oldUsers]
    .filter(
      (user) =>
        user.similarity_value >= 0.5 && user.user.email !== clientMail.email
    )
    .sort((a, b) => b.similarity_value - a.similarity_value);

  const combinedUsers = [...newUsersSorted, ...oldUsersSorted];
  const usersPerPage = 3;

  // Determine the freelancers to display on the first page
  const firstPageUsers =
    page === 0
      ? [
          ...newUsersSorted.slice(0, 2), // Top 2 new freelancers for the first page
          ...oldUsersSorted.slice(0, usersPerPage - 2), // Fill the rest with top old users
        ]
      : combinedUsers;

  const startIndex = page * usersPerPage;
  const paginatedUsers = firstPageUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const hasMore = startIndex + usersPerPage < combinedUsers.length;
  const hasPrevious = page > 0;

  const handleCardClick = (freelancer) => {
    setSelectedFreelancer(freelancer);
    fetchUserData(freelancer.user.email);
  };

  const fetchUserData = async (email) => {
    setLoading(true);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-11/12 max-w-5xl overflow-auto">
        <h2 className="text-2xl font-semibold mb-5 text-center">
          Freelancer Matches
        </h2>

        <div className="flex justify-center gap-10 flex-wrap">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((item, index) => {
              const freelancer = item.user;
              const isNewUser = freelancers.newUsers.includes(item);
              const matchScore = (item.similarity_value * 100).toFixed(0);

              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(item)}
                  className="relative flex-shrink-0 w-full sm:w-80 md:w-60 border p-5 rounded-md shadow-sm flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-105"
                >
                  {isNewUser && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      New
                    </span>
                  )}
                  <img
                    src={
                      freelancer.profilePicture ||
                      "https://via.placeholder.com/100"
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <p className="text-gray-600 text-xl text-center">
                    {`${freelancer.firstName} ${freelancer.lastName}`}
                  </p>
                  <div className="">
                    <p className="text-gray-600">
                      <b>Match Score:</b> {matchScore}%
                    </p>
                    <p className="text-gray-600">
                      <b>Rating:</b> {freelancer.fRating}
                    </p>
                    <p className="text-gray-600">
                      <b>Last Active:</b> {freelancer.lastActive}
                    </p>
                    <p className="text-gray-600">
                      <b>Skills:</b>{" "}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {freelancer.skills.split(",").map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-black text-xs py-1 px-3 rounded-full"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600 text-center">
              No freelancers found matching the requirements.
            </p>
          )}
        </div>

        {/* Page Counter */}
        <p className="text-center mt-4 text-gray-600">
          Page {page + 1} of {Math.ceil(combinedUsers.length / usersPerPage)}
        </p>

        {/* Button containers */}
        <div className="flex justify-between mt-5">
          <div className="flex gap-3">
            {hasPrevious && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => setPage((prev) => prev - 1)}
              >
                Go back
              </button>
            )}
            {hasMore && (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={() => setPage((prev) => prev + 1)}
              >
                Show more ({combinedUsers.length - (startIndex + usersPerPage)}{" "}
                more)
              </button>
            )}
          </div>

          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={closeModal}
          >
            Close
          </button>
        </div>

        {/* Freelancer Profile Modal */}
        <FreelancerProfileModal
          isOpen={Boolean(selectedFreelancer && userData)}
          freelancer={userData}
          onClose={() => setSelectedFreelancer(null)}
        />
      </div>
    </div>
  );
};

export default GigContainerModal;
