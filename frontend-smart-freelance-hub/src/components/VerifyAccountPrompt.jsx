import { useNavigate } from "react-router-dom";

const VerifyAccountPrompt = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleVerifyNow = () => {
    navigate("/verify-account");
    onClose();
  };

  const handleSkipForLater = () => {
    navigate("/home");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Verify Your Account</h2>
        <p className="mb-6">
          Would you like to verify your account now, or skip for later?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSkipForLater}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Skip for Later
          </button>
          <button
            onClick={handleVerifyNow}
            className="bg-greenPrimary text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Verify Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPrompt;
