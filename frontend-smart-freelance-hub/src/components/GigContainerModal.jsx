import React, { useState } from "react";

const GigContainerModal = ({ isOpen, onClose, freelancers }) => {
  if (!isOpen) return null;

  // Sort and filter users based on similarity value
  const newUsersSorted = [...freelancers.newUsers]
    .filter((user) => user.similarity_value >= 0.5)
    .sort((a, b) => b.similarity_value - a.similarity_value);
  const oldUsersSorted = [...freelancers.oldUsers]
    .filter((user) => user.similarity_value >= 0.5)
    .sort((a, b) => b.similarity_value - a.similarity_value);

  // Combine users and set pagination
  const combinedUsers = [...newUsersSorted, ...oldUsersSorted];
  const usersPerPage = 3;
  const [page, setPage] = useState(0);

  const startIndex = page * usersPerPage;
  const paginatedUsers = combinedUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const hasMore = startIndex + usersPerPage < combinedUsers.length;
  const hasPrevious = page > 0;

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
                  className="relative flex-shrink-0 w-full sm:w-80 md:w-60 border p-5 rounded-md shadow-sm flex flex-col items-center"
                >
                  {isNewUser && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      New
                    </span>
                  )}
                  <img
                    src={
                      freelancer.profilePic || "https://via.placeholder.com/100"
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
                      <b>Skills:</b> {freelancer.skills}
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
          {/* Left button group */}
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
                className="px-4 py-2 bg-greenPrimary text-white rounded-md hover:bg-green-600"
                onClick={() => setPage((prev) => prev + 1)}
              >
                Show more ({combinedUsers.length - (startIndex + usersPerPage)}{" "}
                more)
              </button>
            )}
          </div>

          {/* Right button group */}
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GigContainerModal;
