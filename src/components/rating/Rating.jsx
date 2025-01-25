import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const Rating = ({ idDoctor }) => {
  const [rating, setRating] = useState(0); // Current rating
  const [userId, setUserId] = useState(null);
  const [hoverRating, setHoverRating] = useState(0); // Rating when hovering over stars
  const token = Cookies.get("authToken");


  const calculateAverageRating = async (idDoctor) => {
    try {
      console.log(idDoctor)
      const response = await axios.put("http://127.0.0.1:8000/evaluate/calculate_rating", null,
        {params: { id_doctor: idDoctor }}
      );
      console.log("Moyenne des évaluations:", response.data.average_rating);
    } catch (error) {
      console.error("Erreur lors du calcul de la moyenne des évaluations:", error);
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
      comment: "",         // Optional comment field (empty for now)
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/evaluate/create", requestData, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`, // Add Authorization header with the token
        },
      });

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Rating updated successfully!");
        calculateAverageRating(idDoctor);  // Remplacez `doctorId` par l'ID du médecin
      } else {
        console.error("Failed to update rating.");
      }
    } catch (error) {
      console.error("Error updating rating:", error);
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

  // Fetch the user data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/me', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserId(response.data.id); // Set the user ID
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [token]); // Depend on token so it refetches if token changes

  return (
    <div className="p-8 !text-center">
      <h1 className="text-2xl font-bold mb-4  !text-center">Rate this product:</h1>
      <div className="flex space-x-1  !text-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleClick(star)} // Passing star value directly to handleClick
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={`text-3xl focus:outline-none ${star <= (hoverRating || rating)
                ? "text-yellow-500" // Filled star
                : "text-gray-300" // Empty star
              }`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="mt-4 text-gray-600">Your rating: {rating} stars</p>
    </div>
  );
};
