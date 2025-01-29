import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import doctorImg from "./../../assets/doctor.jpg"


export const MyProfile = ({ t }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const [position, setPosition] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const onLocationSelect = (lat, lng) => { setProfile((prevProfile) => ({ ...prevProfile, latitude: lat, longitude: lng, })); };
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng; setPosition([lat, lng]); onLocationSelect(lat, lng);
      },
    });
    return position === null ? null : <Marker position={position} />;
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }
    const token = Cookies.get("authToken");
    const formData = new FormData();
    formData.append("photo", selectedFile);
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/profile/updload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile((prevProfile) => ({ ...prevProfile, photo: response.data.photo }));
      setLoading(false);
    } catch (error) {
      console.log("Error uploading profile picture:", error);
      setLoading(false)
    }
  };



  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get("authToken"); // Fetch token from cookies
      if (!token) {
        setError(t("profile.noTokenError"));
        setLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userProfile = userResponse.data;
        if (userProfile.is_doctor) {
          const doctorResponse = await axios.get(`${import.meta.env.VITE_API_URL}/doctor`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProfile({ ...userProfile, ...doctorResponse.data });
          const latitude = doctorResponse?.data?.latitude || 0;
          const longitude = doctorResponse?.data?.longitude || 0;
          setPosition([latitude, longitude]);

        } else {
          setProfile(userProfile);
        }

        console.log(profile)
      } catch (err) {
        setError(t("profile.fetchError"));
        console.log(err)
        // Cookies.remove("authToken");
        // navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }



  if (!profile) {
    Cookies.remove("authToken");
    navigate("/login");
    return null;
  }

  return (
    <>
      <Header t={t} />
      <div className="doctor-profile h-auto">
        <div className="bg-gray-100 min-h-screen p-6">
          <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
            {/* Doctor Info */}
            <section className="p-6 flex items-center justify-between flex-col xl::flex-row gap-6 border-b">
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 object-cover bg-gray-200 rounded-full border-2 border-blue-400 overflow-hidden">
                  <img src={profile.photo || doctorImg} alt="DoctorImg" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold capitalize">
                    {profile.is_doctor ? t("doctorCard.doctor") : ""} {`${profile.first_name} ${profile.last_name}`}
                  </h1>
                  <p className="text-gray-500">
                    {profile.username}
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                {!selectedFile ? <div className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-2 px-4 border border-blue-500 rounded shadow cursor-pointer"><input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="file-upload"
                  className="hidden"
                />
                  <label
                    htmlFor="file-upload"
                    className=""
                  > {t("Select Image")}</label>
                </div>
                  : <button onClick={handleUpload} className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-2 px-4 border border-blue-500 rounded shadow">
                    {t("Upload Picture")}
                  </button>}

                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                  <Link to={`/editprofile`}><p className="cursor-pointer hover:text-black">{t("Edit My Profile")}</p></Link>
                </button>
                {profile.is_doctor && <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                  <Link to={`/appointments`}><p className="cursor-pointer hover:text-black">{t("Doctor Appointments")}</p></Link>
                </button>}
                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                  <Link to={`/myappointments`}><p className="cursor-pointer hover:text-black">{t("My Appointments")}</p></Link>
                </button>
              </div>
            </section>

            {/* About and Booking */}
            <div className="grid grid-cols-3 gap-6 p-6">
              {/* Left Section */}
              <div className="col-span-2 max-md:col-span-3">
                {/* About the Doctor */}
                <div className="mb-6">
                  {profile.is_doctor && <h2 className="text-xl font-bold mb-2">{t("aboutDoctor.title")}</h2>}
                  <p className="my-1">
                    <strong>{t("Email")}:</strong> {profile.email}
                  </p>
                </div>
                {profile.is_doctor && (
                  <div>
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
                    <p className="my-1">
                      <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                        <Link to={`/workingdays/${profile.id}`}><p className="cursor-pointer hover:text-black">{t("Working Days")}</p></Link>
                      </button>
                    </p>

                    <div className='my-5 w-full'>
                      <MapContainer
                        center={position}
                        zoom={13}
                        scrollWheelZoom={false}
                        className="w-full h-64 rounded-lg"
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
                )}


              </div>
              {/* Booking Section */}
              <div className="col-span-1 max-md:col-span-3 bg-blue-50 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">{t("Information")}</h2>
                <div className="mb-4">
                  {/* Location */}
                  {profile.is_doctor &&
                    <>
                      <p className="text-sm text-gray-600 mt-2">
                        {t("doctorCard.location")} {profile.street}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {t("doctorCard.location")} {profile.city},{profile.state}, Algeria
                      </p>
                    </>
                  }
                  <p className="text-sm text-gray-600">{t("doctorCard.phone")} {profile.phone_number}</p>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer t={t} />
    </>
  );
};

MyProfile.propTypes = {
  t: PropTypes.func.isRequired,
};
