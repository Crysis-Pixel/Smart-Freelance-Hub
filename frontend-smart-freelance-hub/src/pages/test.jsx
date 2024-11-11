import { useState } from "react";
import GigContainerModal from "../components/GigContainerModal"; // Path to your GigContainerModal

function Test() {
  const [isModalOpen, setModalOpen] = useState(false);

  // Open the modal
  const openModal = () => setModalOpen(true);

  // Close the modal
  const closeModal = () => setModalOpen(false);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Button to open the Gig Container modal */}
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Open Gig Container Modal
      </button>

      {/* Gig Container Modal */}
      <GigContainerModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Test;
