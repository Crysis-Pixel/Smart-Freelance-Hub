import React, { useState } from "react";
import ReviewModal from "./ReviewModal"; // Import ReviewModal

export default function FinishJobModal({ isOpen, onClose, job }) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleOpenReviewModal = () => {
    setIsReviewModalOpen(true); // Open the ReviewModal when "Review Freelancer" is clicked
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false); // Close the ReviewModal
  };

  const handleReviewSubmit = (rating, reviewDescription) => {
    console.log("Review Submitted: ", rating, reviewDescription);
    setIsReviewModalOpen(false); // Close the ReviewModal after submission
  };

  const handlePayment = () => {
    alert("Navigating to pay freelancer...");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h2 className="text-4xl font-semibold mb-5">Complete Job</h2>
            <h1 className="text-2xl mb-5">
              To finish the job, you must pay and review the freelancer
            </h1>
            <p className="text-gray-700 mb-5">Pay: {job.freelancerEmail}</p>
            <p className="text-gray-700 mb-5">
              Amount to Pay: {job.offeredPrice}
            </p>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="flex flex-col gap-4">
                <button
                  className="btn btn-primary w-full"
                  onClick={handlePayment}
                >
                  Pay Freelancer
                </button>
                <button
                  className="btn btn-secondary w-full"
                  onClick={handleOpenReviewModal}
                >
                  Review Freelancer
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        job={job}
        onSubmitReview={handleReviewSubmit}
      />
    </>
  );
}
