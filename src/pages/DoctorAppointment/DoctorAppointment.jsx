import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from "js-cookie";
import { Footer } from '../../components/footer/Footer';
import { Header } from '../../components/header/Header';

const DoctorAppointment = ({ t }) => {
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const toggleDatePickerVisibility = () => {
        setIsDatePickerVisible(!isDatePickerVisible);
    };

    const fetchAppointments = async () => {
        if (!selectedDate) return;

        setLoading(true);
        setError(null);

        try {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            const token = Cookies.get("authToken");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/doctor/appointments/day?date=${formattedDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAppointments(response.data || []);
        } catch (err) {
            console.log(err);
            setError('Failed to fetch appointments.');
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (appointmentId, newStatus) => {
        const token = Cookies.get("authToken");

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/doctor/appointment/${appointmentId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data) {
                // Update the local state
                setAppointments((prevAppointments) =>
                    prevAppointments.map((appointment) =>
                        appointment.id === appointmentId
                            ? { ...appointment, status: newStatus }
                            : appointment
                    )
                );
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update appointment status.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [selectedDate]);

    return (
        <>
            <Header t={t} />
            <div className="p-5 font-sans bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Doctor's Appointments</h1>
                    <div className="relative mb-4">
                        <button
                            onClick={toggleDatePickerVisibility}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            {isDatePickerVisible ? "Hide Date Picker" : "Show Date Picker"}
                        </button>
                        {isDatePickerVisible && (
                            <div className="absolute top-12 bg-white p-6 rounded-lg shadow-lg z-10">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">Select a date</h2>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    className="border p-2 rounded-lg w-full text-center"
                                    inline
                                />
                            </div>
                        )}
                    </div>
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 p-4 rounded-lg mb-6">
                            <p className="text-red-600 flex items-center">{error}</p>
                        </div>
                    )}
                    {appointments.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                            <table className="min-w-full">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="px-6 py-4">Patient Name</th>
                                        <th className="px-6 py-4">Phone</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Reason</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">{`${appointment.patient_first_name} ${appointment.patient_last_name}`}</td>
                                            <td className="px-6 py-4">{appointment.patient_phone_number}</td>
                                            <td className="px-6 py-4">{appointment.appointment_date}</td>
                                            <td className="px-6 py-4">{appointment.reason || "No reason provided"}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                        appointment.status
                                                    )}`}
                                                >
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{appointment.type}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={appointment.status}
                                                    onChange={(e) =>
                                                        updateStatus(appointment.id, e.target.value)
                                                    }
                                                    className="border px-2 py-1 rounded-lg"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-8">No appointments for this date.</p>
                    )}
                </div>
            </div>
            <Footer t={t} />
        </>
    );
};

export default DoctorAppointment;
