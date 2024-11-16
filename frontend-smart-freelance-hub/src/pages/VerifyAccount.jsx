import { useState } from "react";
import OTPModal from "../components/OTPModal";
import VerifyAccountPrompt from "../components/VerifyAccountPrompt";

function VerifyAccount() {
  const [isOTPModalOpen, setOTPModalOpen] = useState(false);
  const [isVerifyModalOpen, setVerifyModalOpen] = useState(false);

  const openOTPModal = () => setOTPModalOpen(true);
  const closeOTPModal = () => setOTPModalOpen(false);

  const openVerifyModal = () => setVerifyModalOpen(true);
  const closeVerifyModal = () => setVerifyModalOpen(false);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={openOTPModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Open OTP Modal
      </button>

      <button
        onClick={openVerifyModal}
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600 transition"
      >
        Open Verify Account Modal
      </button>

      {isOTPModalOpen && (
        <OTPModal
          email="abdullahalraiyan4@gmail.com"
          isModalOpen={isOTPModalOpen}
          closeModal={closeOTPModal}
        />
      )}

      {isVerifyModalOpen && (
        <VerifyAccountPrompt
          isOpen={isVerifyModalOpen}
          onClose={closeVerifyModal}
        />
      )}
    </div>
  );
}

export default VerifyAccount;
