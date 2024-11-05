import { useState } from "react";
import PaymentGateway from "../components/PaymentGateway";

function Test() {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Open Payment Modal
      </button>

      <PaymentGateway isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Test;
