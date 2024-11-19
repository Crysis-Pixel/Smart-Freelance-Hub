import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewModal = ({ isOpen, onClose, job, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleStarClick = (ratingValue) => {
    setRating(ratingValue);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = async() => {
    if (rating && review) {
      if (job.clientEmail == JSON.parse(sessionStorage.getItem("user")).email){
        console.log("Rating given: ", rating);
        const reviewUpdateResponse = await fetch("http://localhost:3000/reviews/reviewUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: job._id, emailOfReviewer: job.clientEmail , emailOfReviewed: job.freelancerEmail, rating: rating, description: review, reviewedType: "F" }),
        });
        if (reviewUpdateResponse.status === 400){
          toast.error("Already Reviewed!.");
          return;
        }
        else if (reviewUpdateResponse.status !== 200){
          toast.error("Failed to add review.");
          return;
        }
        else{
          console.log(job._id);
          const jobUpdateResponse = await fetch("http://localhost:3000/jobs/isFreelancerReviewed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId: job._id}),
          });
          if (jobUpdateResponse.status !== 200){
            toast.error("Failed to add review to jobs.");
            return;
          }
        }
    }
    else{
      const reviewUpdateResponse = await fetch("http://localhost:3000/reviews/reviewUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job._id, emailOfReviewer: job.freelancerEmail , emailOfReviewed: job.clientEmail, rating: rating, description: review, reviewedType: "C" }),
      });
      if (reviewUpdateResponse.status !== 200){
        toast.error("Failed to add review.");
        return;
      }
      else{
        console.log(job._id);
        const jobUpdateResponse = await fetch("http://localhost:3000/jobs/isClientReviewed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: job._id}),
        });
        if (reviewUpdateResponse.status === 400){
          toast.error("Already Reviewed!.");
          return;
        }
        else if (reviewUpdateResponse.status !== 200){
          toast.error("Failed to add review.");
          return;
        }
      }
    }

      onSubmitReview(rating, review);
      setReview("");
      setRating(0);
      toast.success("Review Added.");
      onClose();
    } else {
      toast.error("Please provide both rating and review description.");
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-1/3">
        <h2 className="text-4xl font-semibold mb-5">Submit Review</h2>
        <h1 className="text-2xl mb-5">Review for {JSON.parse(sessionStorage.getItem("user")).email === job.freelancerEmail? job.clientEmail : job.freelancerEmail}</h1>
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
