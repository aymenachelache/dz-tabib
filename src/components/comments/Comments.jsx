import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const Comments = ({ idDoctor, t }) => {
  const [rating, setRating] = useState(0); // Current rating
  const [lastRating, setLastRating] = useState(null); // Last rating given by the patient
  const [userId, setUserId] = useState(null); // Logged-in user ID
  const [hoverRating, setHoverRating] = useState(0); // Rating when hovering over stars
  const [successMessage, setSuccessMessage] = useState(null); // Success message state
  const [errorMessage, setErrorMessage] = useState(null); // Error message state
  const [comment, setComment] = useState(""); // Comment input state
  const [reviews, setReviews] = useState([]); // Reviews state
  const token = Cookies.get("authToken");

  // Calculate the average rating for the doctor
  const calculateAverageRating = async (idDoctor) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/evaluate/calculate_rating`,
        null,
        { params: { id_doctor: idDoctor } }
      );
      console.log("Average rating calculated:", response.data);
    } catch (error) {
      console.error("Error calculating average rating:", error);
    }
  };

  // Fetch the last rating and comment given by the patient
  const fetchLastRating = async (idPatient, idDoctor) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/evaluate/patient`,
        {
          params: {
            id_patient: idPatient,
            doctor_id: idDoctor,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.reviews[0]) {
        setLastRating(response.data.reviews[0].note);
        setRating(response.data.reviews[0].note); // Set the current rating to the last rating
        setComment(response.data.reviews[0].comment || ""); // Set the comment if available
      }
    } catch (error) {
      console.error("Error fetching last rating:", error);
    }
  };

  // Fetch all reviews for the doctor
  const fetchReviews = async (idDoctor) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/evaluate`,
        {
          params: {
            id_doctor: idDoctor,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews(response.data.reviews); // Update the reviews state
      console.log("Reviews fetched:", response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      id_doctor: idDoctor, // ID of the doctor being rated
      id_patient: userId,  // ID of the logged-in user
      note: rating,        // The rating value
      comment: comment,    // The comment input
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/evaluate/create`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Rating and comment submitted successfully!");
        setSuccessMessage(response.data.message); // Set success message
        calculateAverageRating(idDoctor);  // Recalculate average rating
        fetchLastRating(userId, idDoctor); // Fetch the last rating and comment again to update the UI
        fetchReviews(idDoctor); // Fetch reviews again to update the UI

        // Clear the comment input after successful submission
        setComment("");

        // Clear the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        console.error("Failed to submit rating and comment.");
      }
    } catch (error) {
      console.error("Error submitting rating and comment:", error);
      setErrorMessage(error.response?.data?.detail || "An error occurred.");
    }
  };

  // Handle when a star is clicked
  const handleClick = (newRating) => {
    setRating(newRating);
  };

  // Handle when hovering over a star
  const handleMouseEnter = (newRating) => {
    setHoverRating(newRating);
  };

  // Handle when mouse leaves the stars
  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  // Fetch the user data, last rating, and reviews when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(response.data.id); // Set the user ID
        fetchLastRating(response.data.id, idDoctor); // Fetch the last rating and comment
        fetchReviews(idDoctor); // Fetch reviews
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [token, idDoctor]); // Re-fetch data when token or idDoctor changes

  return (
    <div className="!text-center">
      <h2 className="text-xl font-bold mb-4">Leave a Comment and Rating</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Comment Input */}
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {/* Success and Error Messages */}
      {successMessage && (
        <p className="mt-4 text-green-600">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mt-4 text-red-600">{errorMessage}</p>
      )}

      {/* Display Reviews */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Reviews</h3>
        {reviews.length > 0 ? (
          reviews.filter((review) => review.comment.trim() !== "").map((review, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  {review.patient_first_name} {review.patient_last_name}
                </p>
                <p className="text-yellow-500">Rating: {review.note}</p>
              </div>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};