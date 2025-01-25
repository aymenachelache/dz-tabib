import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";


export const AddWorkingDay = ({t}) => {
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dailyLimit, setDailyLimit] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("authToken");

    // Prepare the data in the format expected by the backend
    const workingDay = {
      day_of_week: dayOfWeek,
      daily_appointment_limit: dailyLimit,
      hours: [
        {
          hour_id: 1,  // Assuming backend auto-assigns hour IDs
          start_time: startTime,
          end_time: endTime,
        },
      ],
    };

    try {
      // Send the POST request to create a new working day
      console.log(workingDay)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/working-days`, [workingDay], {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Working day added:", response.data);
      navigate(`/workingdays/${id}`);  // Redirect to profile page after successful submission
    } catch (err) {
      console.log()
      setError(err.response.data.detail || "Error adding working day.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header t={t} />
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Add a New Working Day</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Day of Week */}
        <div>
          <label htmlFor="day_of_week" className="block text-gray-700">
            Day of the Week
          </label>
          <select
            id="day_of_week"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full border rounded-md p-2 mt-2"
            required
          >
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>

        {/* Daily Appointment Limit */}
        <div>
          <label htmlFor="daily_appointment_limit" className="block text-gray-700">
            Daily Appointment Limit
          </label>
          <input
            type="number"
            id="daily_appointment_limit"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(Number(e.target.value))}
            className="w-full border rounded-md p-2 mt-2"
            required
          />
        </div>

        {/* Start Time */}
        <div>
          <label htmlFor="start_time" className="block text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            id="start_time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border rounded-md p-2 mt-2"
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label htmlFor="end_time" className="block text-gray-700">
            End Time
          </label>
          <input
            type="time"
            id="end_time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border rounded-md p-2 mt-2"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Working Day"}
        </button>
      </form>
    </div>




    <Footer t={t} />
    
    </>
  );
};

AddWorkingDay.propTypes = {
    t: PropTypes.func.isRequired,
};
