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

    // Handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Toggle visibility of the date picker div
    const toggleDatePickerVisibility = () => {
        setIsDatePickerVisible(!isDatePickerVisible);
    };

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!selectedDate) return; // Ne rien faire si aucune date n'est sélectionnée

            setLoading(true);
            setError(null);

            try {
                // Formater la date au format "YYYY-MM-DD"
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
                const day = String(selectedDate.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;

                const token = Cookies.get("authToken"); // Récupérer le token depuis les cookies

                // Faire la requête API avec la date sélectionnée
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/doctor/appointments/day?date=${formattedDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Mettre à jour les rendez-vous
                if (response.data && response.data.length > 0) {
                    setAppointments(response.data); // Mettre à jour avec les nouveaux rendez-vous
                } else {
                    setAppointments([]); // Vider la liste si aucun rendez-vous n'est trouvé
                }
            } catch (err) {
                console.log(err);
                setError('Failed to fetch appointments.');
                setAppointments([]); // Vider la liste en cas d'erreur
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [selectedDate]); // Déclencher useEffect chaque fois que selectedDate change

    // Fonction pour déterminer la couleur du statut
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'; // Jaune pour "pending"
            case 'cancelled':
                return 'bg-red-100 text-red-800'; // Rouge pour "cancelled"
            case 'completed':
                return 'bg-green-100 text-green-800'; // Vert pour "completed"
            default:
                return 'bg-gray-100 text-gray-800'; // Gris par défaut
        }
    };

    return (
        <>
            <Header t={t} />
            <div className="p-5 font-sans bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Doctor's Appointments</h1>

                    {/* Bouton pour afficher/masquer la div */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={toggleDatePickerVisibility}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            {isDatePickerVisible ? "Masquer le sélecteur de date" : "Afficher le sélecteur de date"}
                        </button>
                    </div>

                    {/* Conteneur parent pour le calendrier (position relative) */}
                    <div className="relative">
                        {/* Date Picker Card (conditionnellement affiché en position absolue) */}
                        {isDatePickerVisible && (
                            <div className="absolute top-0 right-0 bg-white p-6 rounded-lg shadow-lg z-10">
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
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Patient Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Phone Number</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Appointment Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Reason</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {`${appointment.patient_first_name} ${appointment.patient_last_name}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {appointment.patient_phone_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {appointment.appointment_date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {appointment.reason || "No reason provided"}
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