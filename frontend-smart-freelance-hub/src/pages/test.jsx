import { useState } from "react";
import OTPModal from "../components/OTPmodal";
import VerifyAccountPrompt from "../components/VerifyAccountPrompt";

function Test() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button className="btn btn-primary" onClick={openModal}>
        Open OTP Modal
      </button>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Open Verify Account Modal
      </button>

      {isModalOpen && (
        <OTPModal
          email="abdullahalraiyan4@gmail.com"
          isModalOpen={isModalOpen}
          closeModal={closeModal}
        />
      )}

      <VerifyAccountPrompt isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Test;
