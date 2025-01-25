import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { Footer } from '../../components/footer/Footer';
import { Header } from '../../components/header/Header';

const PatientAppointment = ({ t }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = Cookies.get("authToken"); // Get the token from cookies

                // Make API request to fetch all appointments
                const response = await axios.get(
                   `${import.meta.env.VITE_API_URL}/user/appointments`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Update the appointments list
                if (response.data && response.data.length > 0) {
                    setAppointments(response.data); // Update with new appointments
                } else {
                    setAppointments([]); // Clear the list if no appointments are found
                }
                console.log(response.data)
            } catch (err) {
                console.log(err.response.data.detail);
                setError(err.response.data.detail || 'No appointments.');
                setAppointments([]); // Clear the list on error
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []); // Fetch appointments on page load

    // Function to determine the status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'; // Yellow for "pending"
            case 'cancelled':
                return 'bg-red-100 text-red-800'; // Red for "cancelled"
            case 'completed':
                return 'bg-green-100 text-green-800'; // Green for "completed"
            default:
                return 'bg-gray-100 text-gray-800'; // Gray for default
        }
    };

    // Handle removal of appointment
    const handleRemoveAppointment = async (appointmentId) => {
        try {
            const token = Cookies.get("authToken"); // Get the token from cookies

            // Send DELETE request to remove the appointment
            await axios.delete(`${import.meta.env.VITE_API_URL}/user/appointments/${appointmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove the appointment from the state
            setAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment.id !== appointmentId)
            );
        } catch (err) {
            console.log(err);
            setError('Failed to remove appointment.');
        }
    };

    return (
        <>
            <Header t={t} />
            <div className="p-5 font-sans bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">{t("patient_appointments")}</h1>

                    {/* Loading Spinner */}
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 p-4 rounded-lg mb-6">
                            <p className="text-red-600 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Appointments Table */}
                    {appointments.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                            <table className="min-w-full">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">{t("doctor_name")}</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">{t("appointment_date")}</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">{t("reason")}</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">{t("status")}</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">{t("type")}</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">{t("doctor_specialization")}</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">{t("actions")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                            {/* Doctor Information */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {`${appointment.doctor_first_name} ${appointment.doctor_last_name}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {appointment.appointment_date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {appointment.reason || t("no_reason")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                        appointment.status
                                                    )}`}
                                                >
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {appointment.type}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {appointment.doctor_specialization}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 cursor-pointer">
                                                <button
                                                    onClick={() => handleRemoveAppointment(appointment.id)}
                                                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded"
                                                >
                                                    {t("Annuler")}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-8">{t("no_appointments")}</p>
                    )}
                </div>
            </div>
            <Footer t={t} />
        </>
    );
};

export default PatientAppointment;
