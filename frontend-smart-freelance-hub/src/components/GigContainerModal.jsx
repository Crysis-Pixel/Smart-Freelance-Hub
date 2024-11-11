import React from "react";

const GigContainerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-11/12 max-w-5xl overflow-auto">
        <h2 className="text-2xl font-semibold mb-5 text-center">
          Freelancer Matches
        </h2>

        {/* Dummy Freelancer Data */}
        <div className="flex justify-center gap-10 flex-wrap">
          {/* Freelancer Card 1 */}
          <div className="flex-shrink-0 w-full sm:w-80 md:w-60 border p-5 rounded-md shadow-sm flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
            <div className="text-center">
              <p className="text-gray-600 font-semibold">Jane Doe</p>
              <p className="text-gray-600">Rating: 4.7</p>
              <p className="text-gray-600">Last Active: 2 hours ago</p>
              <p className="text-gray-600">Skills: Web Development, React</p>
            </div>
          </div>

          {/* Freelancer Card 2 */}
          <div className="flex-shrink-0 w-full sm:w-80 md:w-60 border p-5 rounded-md shadow-sm flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
            <div className="text-center">
              <p className="text-gray-600 font-semibold">John Smith</p>
              <p className="text-gray-600">Rating: 4.9</p>
              <p className="text-gray-600">Last Active: 5 hours ago</p>
              <p className="text-gray-600">Skills: UI/UX Design, Figma</p>
            </div>
          </div>

          {/* Freelancer Card 3 */}
          <div className="flex-shrink-0 w-full sm:w-80 md:w-60 border p-5 rounded-md shadow-sm flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
            <div className="text-center">
              <p className="text-gray-600 font-semibold">Alice Jones</p>
              <p className="text-gray-600">Rating: 4.8</p>
              <p className="text-gray-600">Last Active: 10 minutes ago</p>
              <p className="text-gray-600">Skills: Graphic Design, Photoshop</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-5">
          <button
            className="px-4 py-2 bg-greenPrimary text-white rounded-md hover:bg-green-500"
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
