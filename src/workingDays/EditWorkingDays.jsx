import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

export const EditWorkingDays = ({ t }) => {
    const [workingDays, setWorkingDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch working days from the backend
    useEffect(() => {
        const fetchWorkingDays = async () => {
            const token = Cookies.get("authToken");
            if (!token) {
                setError(t("profile.noTokenError"));
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/working-days/1`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setWorkingDays(response.data);
                console.log(response.data)
                setWorkingDays(response.data.filter((el) => el.day_id == id))
            } catch (err) {
                setError(t("profile.fetchError"));
            } finally {
                setLoading(false);
            }
        };

        fetchWorkingDays();

    }, []);

    // Handle changes to working day fields (day of week, daily limit, time)
    const handleWorkingDayChange = (index, field, value) => {
        const updatedWorkingDays = [...workingDays];
        if (field === "start_time" || field === "end_time") {
            updatedWorkingDays[index].hours[0][field] = value;
        } else {
            updatedWorkingDays[index][field] = value;
        }
        setWorkingDays(updatedWorkingDays);
    };
    // Submit the updated working days to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = Cookies.get("authToken");

        // Extract the necessary data
        const dataToSend = {
            daily_appointment_limit: workingDays[0].daily_appointment_limit,
            hours: workingDays[0].hours.map((hour) => ({
                hour_id: hour.hour_id, // Assuming hour_id exists and is relevant
                start_time: hour.start_time,
                end_time: hour.end_time
            }))
        };
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/working-days/${id}?working_hour_id=${workingDays[0].hours[0].hour_id}`, dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setSuccess("Working day updated successfully");
            navigate(`/profile`);
        } catch (err) {
            console.error("Error response:", err.response);
            setError(t("profile.updateError"));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10">
                <p>{t("loading")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <>
            <Header t={t} />
            <div className="bg-gray-100 pt-14">
                <div className="container min-h-screen mx-auto p-10 bg-white rounded-lg">
                    <h1 className="text-3xl font-bold mb-6">{t("working_days.edit")}</h1>
                    {success && <p className="text-green-500">{success}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {workingDays.map((day, index) => (
                                <div key={index} className="space-y-4">
                                    <h3 className="text-xl font-semibold">{t("working_days.day")} {day.day_of_week || "Day"}</h3>
                                    <div className="flex space-x-4">
                                        {/* Day of Week */}
                                        <div className="w-full">
                                            <label className="block">
                                                <span className="text-gray-700">{t("day_of_week")}</span>
                                                <input
                                                    type="text"
                                                    value={day.day_of_week}
                                                    onChange={(e) => handleWorkingDayChange(index, "day_of_week", e.target.value)}
                                                    className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                                    disabled
                                                />
                                            </label>
                                        </div>
                                        {/* Daily Appointment Limit */}
                                        <div className="w-full">
                                            <label className="block">
                                                <span className="text-gray-700">{t("daily_appointment_limit")}</span>
                                                <input
                                                    type="number"
                                                    value={day.daily_appointment_limit}
                                                    onChange={(e) => handleWorkingDayChange(index, "daily_appointment_limit", e.target.value)}
                                                    className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {/* Start Time */}
                                        <label className="block">
                                            <span className="text-gray-700">{t("start_time")}</span>
                                            <input
    type="time"
    value={
        day.hours[0]?.start_time
            ? day.hours[0].start_time.split(":").slice(0, 2).map((part) => part.padStart(2, "0")).join(":")
            : "00:00"
    }
    onChange={(e) => handleWorkingDayChange(index, "start_time", e.target.value)}
    className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
/>

                                        </label>
                                        {/* End Time */}
                                        <label className="block">
                                            <span className="text-gray-700">{t("end_time")}</span>
                                            <input
                                                type="time"
                                                value={
                                                    day.hours[0]?.end_time
                                                        ? day.hours[0].end_time.split(":").slice(0, 2).map((part) => part.padStart(2, "0")).join(":")
                                                        : "00:00"
                                                }
                                                onChange={(e) => handleWorkingDayChange(index, "end_time", e.target.value)}
                                                className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                            />

                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md disabled:opacity-50"
                        >
                            {t("submit")}
                        </button>
                    </form>
                </div>
            </div>
            <Footer t={t} />
        </>
    );
};

EditWorkingDays.propTypes = {
    t: PropTypes.func.isRequired,
};
