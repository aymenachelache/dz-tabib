import PropTypes from 'prop-types';
import { Header } from '../../components/header/Header';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";
import doctorImg from "./../../assets/doctor.jpg";

export const AppointmentPage = ({ t }) => {
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState({});
    const [dayName, setDayName] = useState("");
    const { id, jj, mm, aaaa, workingday } = useParams();
    const [data, setData] = useState({
        doctor_id: id,
        date: `${aaaa}-${mm}-${jj}`,
        type: "face_to_face",
        reason: "",
        status: "pending",
        working_day_id: workingday
    });


    useEffect(() => {
        const token = Cookies.get("authToken");

        const fetchData = async () => {
            const doctorResponse = await axios.get(`${import.meta.env.VITE_API_URL}/doctors/${id}`);
            setProfile(doctorResponse.data);
        }
        fetchData();

        const getDayName = (workingDayId) => {
            const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            return daysOfWeek[workingDayId] || "Invalid Day";
        };
        
        // Example usage
        setDayName(getDayName(workingday));

    }, [id]);

    const handleAppointmentTypeChange = (e) => {
        const appointmentType = e.target.value;
        setData(prevData => ({
            ...prevData,
            type: appointmentType
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = Cookies.get("authToken");

        console.log(data)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/appointment`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Appointment booked successfully:", response.data);
            // You can redirect the user or show a success message here
            navigate("/myappointments");
        } catch (error) {
            console.log(error.response.data.detail)
            setError(error.response.data.detail || 'An error occurred. Please try again.');

        }
    };

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <>
            <Header t={t} />
            <div className="appointment-page">
                <div className="bg-gray-100 min-h-[calc(100vh-80px)]  flex justify-center items-center">
                    <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 grid grid-cols-2 gap-6">
                        {/* Left Section: Doctor Information */}
                        <div className="max-md:col-span-2 col-span-1 border-r pr-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gray-200 rounded-full border-2 border-blue-400 overflow-hidden">
                                    <img src={profile.photo || doctorImg} alt="DoctorImg" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">{t("doctorCard.doctor")} {profile.first_name} {profile.last_name}</h2>
                                    <p className="text-gray-500">
                                        {profile.specialization_name}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-6 text-gray-700">
                                <strong>{dayName} {jj}-{mm}-{aaaa}</strong>,{" "}
                                <span className="text-blue-500 font-semibold">
                                    Appointment reservation
                                </span>
                            </p>
                        </div>

                        {/* Right Section: Booking Form */}
                        <div className="max-md:col-span-2 col-span-1">
                            <h2 className="text-xl font-bold text-blue-500 mb-4">{t("appointmentPage.form.title")}</h2>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {/* Reason */}
                                <div>
                                    <label
                                        htmlFor="reason"
                                        className="block text-gray-600 mb-1 font-medium"
                                    >
                                        {t("appointmentPage.form.Reason")} (Optional)
                                    </label>
                                    <input
                                        id="reason"
                                        name="reason"
                                        type="text"
                                        value={data.reason}
                                        onChange={handleInputChange}
                                        placeholder={t("appointmentPage.form.Enter_Reason")}
                                        className="block w-full border-0  rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6 outline-none"
                                    />
                                </div>
                                {/* Appointment Type */}
                                <div>
                                    <label
                                        htmlFor="appointment_type"
                                        className="block text-gray-600 mb-1 font-medium"
                                    >
                                        {t("appointmentPage.form.appointmentTypeLabel")}
                                    </label>
                                    <select
                                        id="appointment_type"
                                        name="type"
                                        value={data.type}
                                        onChange={handleAppointmentTypeChange}
                                        className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6 outline-none"
                                    >
                                        <option value="face_to_face">Face-to-Face</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                                {/* Submit Button */}
                                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                                <div className="mt-6 flex gap-4">
                                    <button type="submit" className="!text-center flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600">
                                        {t("appointmentPage.buttons.book")}
                                    </button>
                                    <button onClick={handleGoBack} type="button" className="!text-center flex-1 border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-100">
                                        {t("appointmentPage.buttons.cancel")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

AppointmentPage.propTypes = {
    t: PropTypes.func.isRequired,
};
