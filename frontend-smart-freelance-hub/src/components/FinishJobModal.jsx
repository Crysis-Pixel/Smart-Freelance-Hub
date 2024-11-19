import React, { useState } from "react";
import ReviewModal from "./ReviewModal";
import TransactionModal from "./TransactionModal";

export default function FinishJobModal({ isOpen, onClose, job }) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const handleOpenReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleReviewSubmit = (rating, reviewDescription) => {
    console.log("Review Submitted: ", rating, reviewDescription);
    setIsReviewModalOpen(false);
  };

  const handlePayment = () => {
    setIsTransactionModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
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
            <p className="text-gray-700 mb-5">
              Freelancer Email: {job.freelancerEmail}
            </p>

            {job.isPaid ? (
              <p className="text-green-700 mb-5 text-xl">Payment done ✓</p>
            ) : (
              <p className="text-red-500 mb-5 text-xl">
                Amount to Pay: {job.offeredPrice}
              </p>
            )}

            {job.isFreelancerReviewed ? (
              <p className="text-green-700 mb-5 text-xl">
                Freelancer Reviewed ✓
              </p>
            ) : (
              <p className="text-red-500 mb-5 text-xl">
                Freelancer review pending
              </p>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="flex flex-col gap-4">
                {!job.isPaid && (
                  <button
                    className="btn btn-primary w-full"
                    onClick={handlePayment}
                  >
                    Pay Freelancer
                  </button>
                )}
                {!job.isFreelancerReviewed && (
                  <button
                    className="btn btn-secondary w-full"
                    onClick={handleOpenReviewModal}
                  >
                    Review Freelancer
                  </button>
                )}
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

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        job={job}
        onSubmitReview={handleReviewSubmit}
      />

      {isTransactionModalOpen && (
        <TransactionModal job={job} onClose={handleCloseTransactionModal} />
      )}
    </>
  );
}
