import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const Rating = ({ idDoctor, t }) => {
  const [rating, setRating] = useState(0); // Current rating
  const [lastRating, setLastRating] = useState(null); // Last rating given by the patient
  const [comment, setComment] = useState(""); // Last rating given by the patient
  const [userId, setUserId] = useState(null);
  const [hoverRating, setHoverRating] = useState(0); // Rating when hovering over stars
  const [successMessage, setSuccessMessage] = useState(null); // Success message state
  const [errorMessage, setErrorMessage] = useState(null); 
  const token = Cookies.get("authToken");


  const calculateAverageRating = async (idDoctor) => {
    console.log(`DoctorId : ${idDoctor}`);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/evaluate/calculate_rating`,
        null,
        { params: { id_doctor: idDoctor } }
      );
      console.log("Moyenne des évaluations:", response.data);
    } catch (error) {
      console.error("Erreur lors du calcul de la moyenne des évaluations:", error);
    }
  };

  // Fetch the last rating given by the patient
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
      console.log(response.data)
      console.log(response.data.reviews[0].note);
      if (response.data && response.data.reviews[0].note) {
        setLastRating(response.data.reviews[0].note);
        setComment(response.data.reviews[0].comment);
        setRating(response.data.reviews[0].note); // Set the current rating to the last rating
      }
    } catch (error) {
      console.error("Error fetching last rating:", error);
      console.log(error)
    }
  };

  // Handle when a star is clicked
  const handleClick = async (newRating) => {
    setRating(newRating); // This will update the rating displayed
    console.log(newRating); // Check the newRating value

    const requestData = {
      id_doctor: idDoctor, // ID of the doctor being rated
      id_patient: userId,  // ID of the logged-in user
      note: newRating,     // The rating value
      // comment: comment,         // Optional comment field (empty for now)
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/evaluate/create`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Authorization header with the token
          },
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Rating updated successfully!");
        setSuccessMessage(response.data.message); // Set success message
        calculateAverageRating(idDoctor);  // Recalculate average rating
        fetchLastRating(userId, idDoctor); // Fetch the last rating again to update the UI

        // Clear the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        console.error("Failed to update rating.");
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      console.log(error.response.data.detail);
      setErrorMessage(error.response?.data?.detail)
    }
  };

  // Handle when hovering over a star
  const handleMouseEnter = (newRating) => {
    setHoverRating(newRating);
  };

  // Handle when mouse leaves the stars
  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  // Fetch the user data and last rating when the component mounts
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
        console.log(`id ${response.data.id}`);
        fetchLastRating(response.data.id, idDoctor); // Fetch the last rating after setting the user ID
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [token, idDoctor]); // Depend on token and idDoctor so it refetches if either changes

  return (
    <div className="p-8 !text-center">
      <h1 className="text-2xl font-bold mb-4 !text-center">{t("rating.title")}</h1>
      <div className="flex justify-center items-center space-x-1 !text-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleClick(star)} // Passing star value directly to handleClick
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={`text-3xl focus:outline-none ${
              star <= (hoverRating || rating)
                ? "text-yellow-500" // Filled star
                : "text-gray-300" // Empty star
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {/* <p className="mt-4 text-gray-600">
        {t("rating.yourRating")}: {rating} {t("rating.stars")}
      </p> */}
      {successMessage && (
        <p className="mt-4 text-green-600">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mt-4 text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};