import React from "react";

export default function ReviewsModal({ isOpen, onClose, reviews }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full p-1"
          onClick={onClose}
        >
          ✕
        </button>
        
        {/* Reviews List */}
        <div className="max-h-96 overflow-y-auto">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="mb-6 border-b pb-4">
                <p className="font-semibold">{review.reviewerName}</p>
                <p className="text-sm text-gray-600">{review.date}</p>
                <p className="mt-2">{review.comment}</p>

                {/* Client Email and Description */}
                <p className="mt-2 text-gray-700">
                  <strong>Reviewer Email:</strong> {review.emailOfReviewer}
                </p>
                <p className="mt-1 text-gray-700">
                  <strong>Description:</strong> {review.description}
                </p>

                {/* Star Rating */}
                <div className="mt-2 text-yellow-400">
                  {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                </div>
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
