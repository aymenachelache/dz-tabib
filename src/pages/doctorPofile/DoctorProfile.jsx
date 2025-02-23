import PropTypes from 'prop-types';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import doctorImg from "./../../assets/doctor.jpg";
import Cookies from "js-cookie";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DoctorProfile.css';
import { Rating } from '../../components/rating/Rating';
import { Spinner } from './Spinner'; // Ensure this component exists and is properly styled


import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Comments } from '../../components/comments/Comments';

// Fix default marker icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export const DoctorProfile = ({ t }) => {
    const [profile, setProfile] = useState({});
    const [position, setPosition] = useState([0, 0]);
    const [token, setToken] = useState("");
    const [MappingWokingDayId, setMappingWokingDayId] = useState(0);
    const [workingDays, setWorkingDays] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    const { id } = useParams();

    const onLocationSelect = (lat, lng) => {
        setProfile((prevProfile) => ({ ...prevProfile, latitude: lat, longitude: lng }));
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                onLocationSelect(lat, lng);
            },
        });
        return position === null ? null : <Marker position={position} />;
    };

    useEffect(() => {
        setToken(Cookies.get("authToken"));

        const fetchData = async () => {
            try {
                // Fetch doctor profile
                const doctorResponse = await axios.get(`${import.meta.env.VITE_API_URL}/doctors/${id}`);
                setProfile(doctorResponse.data);

                // Set map position based on doctor's coordinates
                const lat = doctorResponse.data?.latitude || 36.752887;
                const lng = doctorResponse.data?.longitude || 3.042048;
                setPosition([lat, lng]);

                // Fetch working days
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/working-days/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setWorkingDays(response.data);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false); // Stop loading indicator
            }
        };

        fetchData();
    }, [id, token]);

    const handleRatingSuccess = () => {
        fetchData(); // Re-fetch the doctor profile data
      };

    // Map days of the week to their numerical values
    const allowedDays = workingDays?.map((item) => {
        switch (item.day_of_week) {
            case "Sunday":
                return 0;
            case "Monday":
                return 1;
            case "Tuesday":
                return 2;
            case "Wednesday":
                return 3;
            case "Thursday":
                return 4;
            case "Friday":
                return 5;
            case "Saturday":
                return 6;
            default:
                return null;
        }
    }).filter(day => day !== null);

    // Handle date selection
    const handleDateChange = (date) => {
        setSelectedDate(date);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

        const mappingId = (() => {
            switch (dayOfWeek) {
                case "Sunday":
                    return 0;
                case "Monday":
                    return 1;
                case "Tuesday":
                    return 2;
                case "Wednesday":
                    return 3;
                case "Thursday":
                    return 4;
                case "Friday":
                    return 5;
                case "Saturday":
                    return 6;
                default:
                    return null;
            }
        })();

        setMappingWokingDayId(mappingId);
    };

    // Get excluded dates
    const getExcludedDates = () => {
        const excludedDates = [];
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            if (!allowedDays.includes(date.getDay())) {
                excludedDates.push(date);
            }
        }

        return excludedDates;
    };

    const excludedDates = getExcludedDates();

    // Display loading spinner while data is being fetched
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner /> {/* Loading spinner component */}
            </div>
        );
    }

    return (
        <div className="doctor-profile h-auto">
            <Header t={t} />
            <div className="bg-gray-100 min-h-screen p-6">
                <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
                    {/* Doctor Info */}
                    <section className="p-6 flex items-center gap-6 border-b">
                        <div className="w-28 h-28 object-cover bg-gray-200 rounded-full border-2 border-blue-400 overflow-hidden">
                            <img src={!profile.photo ? doctorImg : profile.photo} alt="DoctorImg" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">
                                {t("doctorCard.doctor")} {profile.first_name} {profile.last_name}
                            </h1>
                            <p className="text-gray-500">
                                {profile.email}
                            </p>
                            {/* Ratings */}
                            <div className="flex items-center mt-2">
                                <div className="flex text-yellow-400">
                                    {"★".repeat(Math.floor(profile.rating))}
                                    {"☆".repeat(5 - Math.floor(profile.rating))}
                                </div>
                                <span className="text-gray-600 text-sm ml-2">
                                    {Math.round(profile.rating)}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* About and Booking */}
                    <div className="grid grid-cols-3 gap-6 p-6">
                        {/* Left Section */}
                        <div className="col-span-2 max-md:col-span-3">
                            {/* About the Doctor */}
                            <div className="mb-6 p-6 bg-white shadow-lg rounded-xl border border-gray-200 space-y-6">
                                {/* Spoken Languages */}
                                <div className="flex items-center">
                                    <strong className="w-48 text-gray-600">{t("spoken_languages")}:</strong>
                                    <span className="text-gray-900 font-medium">{profile.spoken_languages}</span>
                                </div>



        
                                <p className="my-1">
                                    <strong>{t("specializedIn")}:</strong> {profile.specialization_name}
                                </p>
                                <p className="my-1">
                                    <strong>{t("spoken_languages")}:</strong> {profile.spoken_languages}
                                </p>
                                <p className="my-1">
                                    <strong>{t("Assurances")}:</strong> {profile.assurances?.map((as, idx) => <span>{as}, </span>)}
                                </p>
                                <p className="my-1">
                                    <strong>{t("years_of_experience")}:</strong> {profile.years_of_experience} {t("years")}
                                </p>
                                <p className="my-1">
                                    <strong>{t("zoom_link")}:</strong>{" "}
                                    <a
                                        href={profile.zoom_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500"
                                    >
                                        {profile.zoom_link}
                                    </a>
                                </p>
                                <p className="my-1">
                                    <strong>{t("visit_price")}:</strong> {profile.visit_price} DA
                                </p>
                                <p className="my-1">
                                    <strong>{t("latitude")}:</strong> {profile.latitude}
                                </p>
                                <p className="my-1">
                                    <strong>{t("longitude")}:</strong> {profile.longitude}
                                </p>

                                {/* Map Section */}
                                <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 px-4 pt-4">{t("location_map")}</h3>
                                    <MapContainer
                                        center={position}
                                        zoom={13}
                                        scrollWheelZoom={false}
                                        className="w-full h-64"
                                        key={position}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <LocationMarker />
                                    </MapContainer>
                                </div>
                            </div>
                            <div className='flex justify-center items-center text-center'>
                                <Rating idDoctor={profile.id} t={t} onRatingSuccess={handleRatingSuccess} />
                            </div>
                            <div className="">
                                <Comments idDoctor={profile.id} t={t} />
                            </div>
                        </div>

                        {/* Booking Section */}
                        <div className="col-span-1 max-md:col-span-3 bg-blue-50 p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">Booking Information</h2>
                            <div className="mb-4">
                                <p className="text-sm mt-1">
                                    <span className="font-medium">{t("doctorCard.specializedIn")}</span>{" "}
                                    {profile.specialization_name}
                                </p>
                                {/* Location */}
                                <p className="text-sm text-gray-600 mt-2">
                                    {t("doctorCard.location")} {profile.street}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    {t("doctorCard.location")} {profile.city}, {profile.state}, Algeria
                                </p>
                                <p className="text-sm text-gray-600">{t("doctorCard.phone")} {profile.phone_number}</p>
                            </div>
                            {/* Appointment Times */}
                            <div className="space-y-4">
                                <div className="mt-1 !text-center">
                                    {workingDays?.map((el, idx) => (
                                        <div key={idx} className='mb-1 grid grid-cols-4 rounded-t-md rounded-b-md overflow-hidden cursor-pointer'>
                                            <div className="bg-blue-200 hover:bg-blue-300 text-sm px-4 py-3">
                                                {el.day_of_week}
                                            </div>
                                            <div className="bg-blue-200 !text-center hover:bg-blue-300 text-sm px-4 py-3">
                                                {el.daily_appointment_limit}
                                            </div>
                                            <div className="col-span-2 !text-center bg-blue-200 hover:bg-blue-300 text-sm px-4 py-3">
                                                {el?.hours[0].start_time} - {el?.hours[0].end_time}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mini-agenda-container mx-auto">
                                        <h2 className='mb-2'>Sélectionner une date pour votre rendez-vous</h2>
                                        <div className='w-full flex justify-center items-center'>
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={handleDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                minDate={new Date()}
                                                inline
                                                excludeDates={getExcludedDates()}
                                            />
                                        </div>
                                        {selectedDate && (
                                            <div className='mt-2 flex justify-center items-center'>
                                                <h3>Date sélectionnée : {selectedDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h3>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full !text-center mt-4">
                                        {selectedDate ? (
                                            <Link to={token ? `/appointment/${id}/${selectedDate?.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}/${MappingWokingDayId}` : "/login"}>
                                                <button
                                                    className="w-full !text-center text-sm px-4 py-3 rounded-b-md rounded-t-md mb-2 bg-red-500 text-white font-semibold hover:bg-red-600"
                                                >
                                                    {t("booking.book")}
                                                </button>
                                            </Link>
                                        ) : (
                                            <div className="text-red-500 font-semibold mt-2">
                                                {t("booking.selectDateError", "Please select a date before booking.")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer t={t} />
        </div>
    );
};

DoctorProfile.propTypes = {
    t: PropTypes.func.isRequired,
};