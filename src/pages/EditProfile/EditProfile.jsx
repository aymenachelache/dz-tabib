import { useState, useEffect } from "react";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import axios from "axios";
import Cookies from "js-cookie";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

export const EditProfile = ({ t }) => {
    const [errors, setErrors] = useState({});
    const [assurances, setAssurances] = useState([]);
    const states = [
        "Alger", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Sétif", "Chlef", "Tizi Ouzou",
        "Béjaïa", "Skikda", "Sidi Bel Abbès", "Tlemcen", "Ghardaïa", "Mostaganem", "Biskra",
        "Tébessa", "El Oued", "Tiaret", "Ouargla", "Djelfa", "M'sila", "Jijel", "Relizane",
        "Saïda", "Guelma", "Laghouat", "Médéa", "Tamanrasset", "Béchar", "Adrar", "Tindouf",
        "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tissemsilt", "Khenchela", "Souk Ahras",
        "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Ouled Djellal",
        "Bouira", "Illizi", "Tamanrasset", "Timimoun", "Beni Abbès", "In Salah", "In Guezzam",
        "Touggourt", "Djanet", "El M'Ghair", "El Meniaa", "Ouled Djellal"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/adv_search`);  // Replace with actual backend API endpoint
                const { assurances } = response.data;
                setAssurances(Object.values(assurances));
                console.log(response.data)
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching assurances:", error);
            }
        };

        fetchData();
    }, []);

    const [specializations, setSpecializations] = useState([]);

    const languageOptions = [
        { value: "English", label: "English" },
        { value: "French", label: "French" },
        { value: "Arabic", label: "Arabic" },
        { value: "Spanish", label: "Spanish" },
        { value: "German", label: "German" },
    ];

    const [profile, setProfile] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        photo: "",
        experience_start_date: 0,
        state: "",
        city: "",
        street: "",
        spoken_languages: "",
        zoom_link: "",
        visit_price: 0,
        phone_number: "",
        specialization_id: 0,
        assurances: [],
        latitude: 0,
        longitude: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [position, setPosition] = useState([36.752887, 3.042048]);
    const [languages, setLanguages] = useState([]);
    const [isDoctor, setIsDoctor] = useState(false);
    const navigate = useNavigate();

    const onLocationSelect = (lat, lng) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            latitude: lat,
            longitude: lng,
        }));
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

    const handleLanguageChange = (selectedOptions) => {
        setLanguages(selectedOptions);
        const languageString = selectedOptions.map((option) => option.value).join(", ");
        setProfile((prevProfile) => ({
            ...prevProfile,
            spoken_languages: languageString,
        }));
    };


    useEffect(() => {
        const fetchProfile = async () => {
            const token = Cookies.get("authToken");
            if (!token) {
                navigate("/login");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userProfile = response.data;
                setIsDoctor(userProfile.is_doctor);
                if (userProfile.is_doctor) {
                    const doctorResponse = await axios.get(`${import.meta.env.VITE_API_URL}/doctor`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setProfile({
                        ...userProfile,
                        ...doctorResponse.data,
                        assurances: doctorResponse.data.assurances || [],
                    });

                    if (doctorResponse.data.latitude && doctorResponse.data.longitude) {
                        setPosition([doctorResponse.data.latitude, doctorResponse.data.longitude]);
                    }

                    const selectedLanguages = doctorResponse.data.spoken_languages
                        .split(", ")
                        .map((lang) => {
                            return languageOptions.find((option) => option.value === lang);
                        })
                        .filter(Boolean);
                    setLanguages(selectedLanguages);
                } else {
                    setProfile(userProfile);
                }
            } catch (err) {
                setError(t("profile.fetchError"));
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

        const fetchSpecializations = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/specializations`);
                setSpecializations(res.data);
            } catch (error) {
                console.error("Error fetching specializations:", error);
            }
        };

        fetchSpecializations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const preparePayload = (profile) => {
        return {
            ...profile,
            experience_start_date: profile.experience_start_date || 0,
            state: profile.state || "",
            city: profile.city || "",
            street: profile.street || "",
            assurances: profile.assurances || [],
            zoom_link: profile.zoom_link || "",
            visit_price: profile.visit_price || 0,
            phone_number: profile.phone_number || "",
            specialization_id: profile.specialization_id || 1,
            photo: profile.photo || "",
        };
    };

    const handleSubmit = async (e) => {
        console.log(profile)
        e.preventDefault();
        setLoading(true);
        const token = Cookies.get("authToken");

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/profile`, preparePayload(profile), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            navigate("/profile");
        } catch (err) {
            setErrors({ server: err.response?.data?.detail || t("Errors.UnknownError") });
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

    return (
        <>
            <Header t={t} />
            <div className="bg-gray-100 pt-14">
                <div className="container min-h-screen mx-auto p-10 bg-white rounded-lg">
                    <h1 className="text-3xl font-bold mb-6">{t("profile.edit_profile")}</h1>
                    {success && <p className="text-green-500">{success}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-gray-700">{t("username")}</span>
                                <input
                                    type="text"
                                    name="username"
                                    value={profile.username || ""}
                                    onChange={handleChange}
                                    className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                    required
                                    disabled={!isDoctor}
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">{t("first_name")}</span>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={profile.first_name || ""}
                                    onChange={handleChange}
                                    className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                    required
                                    disabled={!isDoctor}
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">{t("last_name")}</span>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={profile.last_name || ""}
                                    onChange={handleChange}
                                    className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                    required
                                    disabled={!isDoctor}
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">{t("email")}</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email || ""}
                                    onChange={handleChange}
                                    className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                    required
                                    disabled={!isDoctor}
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">{t("phone_number")}</span>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={profile.phone_number || ""}
                                    onChange={handleChange}
                                    className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                    disabled={!isDoctor}
                                />
                            </label>
                            {isDoctor && (
                                <>
                                    <label className="block">
                                        <span className="text-gray-700">{t("experience_start_date")}</span>
                                        <input
                                            type="date"
                                            name="experience_start_date"
                                            value={profile.experience_start_date || ""}
                                            onChange={handleChange}
                                            className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">{t("state")}</span>
                                        <select
                                            name="state"
                                            value={profile.state || ""}
                                            onChange={handleChange}
                                            className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                            required
                                        >
                                            <option value="">{t("select_state")}</option>
                                            {states.map((state, index) => (
                                                <option key={index} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">{t("city")}</span>
                                        <input
                                            type="text"
                                            name="city"
                                            value={profile.city || ""}
                                            onChange={handleChange}
                                            className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">{t("street")}</span>
                                        <input
                                            type="text"
                                            name="street"
                                            value={profile.street || ""}
                                            onChange={handleChange}
                                            className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">{t("spoken_languages")}</span>
                                        <Select
                                            isMulti
                                            options={languageOptions}
                                            value={languages}
                                            onChange={handleLanguageChange}
                                            className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                            placeholder={t("select_languages")}
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">{t("zoom_link")}</span>
                                        <input
                                            type="url"
                                            name="zoom_link"
                                            value={profile.zoom_link || ""}
                                            onChange={handleChange}
                                            className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">{t("visit_price")}</span>
                                        <input
                                            type="number"
                                            name="visit_price"
                                            value={profile.visit_price || 0}
                                            onChange={handleChange}
                                            className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">{t("specialization_id")}</span>
                                        <select
                                            name="specialization_id"
                                            value={profile.specialization_id}
                                            onChange={handleChange}
                                            className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                            required
                                        >
                                            {specializations.map((specialization) => (
                                                <option key={specialization.id} value={specialization.id}>
                                                    {specialization.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">{t("latitude")}</span>
                                        <input
                                            type="number"
                                            name="latitude"
                                            value={profile.latitude}
                                            onChange={handleChange}
                                            className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">{t("longitude")}</span>
                                        <input
                                            type="number"
                                            name="longitude"
                                            value={profile.longitude}
                                            onChange={handleChange}
                                            className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                        />
                                    </label>
                                    <MapContainer
                                        center={position}
                                        zoom={13}
                                        scrollWheelZoom={false}
                                        className="w-full h-64 rounded-lg"
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <LocationMarker />
                                    </MapContainer>
                                </>
                            )}
                        </div>
                        {errors.server && <p className="mt-2 text-red-500 text-sm text-center">{errors.server}</p>}
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            {t("profile.update")}
                        </button>
                    </form>
                </div>
            </div>
            <Footer t={t} />
        </>
    );
};
