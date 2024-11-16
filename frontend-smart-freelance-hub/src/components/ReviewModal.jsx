import React, { useState } from "react";

const ReviewModal = ({ isOpen, onClose, job, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleStarClick = (ratingValue) => {
    setRating(ratingValue);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = () => {
    if (rating && review) {
      onSubmitReview(rating, review); // Call the parent's review submission handler
      setReview("");
      setRating(0);
      onClose(); // Close modal after submitting
    } else {
      alert("Please provide both rating and review description.");
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-1/3">
        <h2 className="text-4xl font-semibold mb-5">Submit Review</h2>
        <h1 className="text-2xl mb-5">Review for {job.freelancerEmail}</h1>

        {/* Rating Section */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold mb-2">Rating</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-2xl ${
                  rating >= star ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Review Description Section */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold mb-2">Review Description</h3>
          <textarea
            value={review}
            onChange={handleReviewChange}
            placeholder="Write your review here..."
            className="w-full p-2 border rounded-md"
            rows="5"
          />
        </div>

        {/* Submit and Cancel buttons */}
        <div className="flex justify-end gap-4 mt-5">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Review
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ReviewModal;
