import PropTypes from 'prop-types';
import { Footer } from '../../components/footer/Footer';
import { Header } from '../../components/header/Header';
import './homePage.scss';
import logo from '../../assets/dz_tabib.svg'
import { Link } from 'react-router-dom';
import image1 from './../../assets/pexels-photo-8376277.jpeg'
import image2 from './../../assets/pexels-shkrabaanthony-5467596.jpg'
import image3 from './../../assets/follow-us@3x.png'
import { useEffect, useState } from 'react';
import axios from 'axios';
import doctorImg from "./../../assets/doctor.jpg"
import { SearchBar } from '../../components/search/SearchBar';


export const HomePage = ({ t }) => {
    const [specialties, setSpecialties] = useState([]);

    const [doctors, setDoctors] = useState([
        {
            _id: 1,
            name: "Achelache Aymen",
            specialty: "Cardiologue",
            rating: 4,
            location: "Ferdjioua, Mila, Algeria",
            image: "https://via.placeholder.com/150",
        },

        {
            _id: 1,
            name: "Achelache Aymen",
            specialty: "Homologue",
            rating: 4,
            location: "Ferdjioua, Mila, Algeria",
            image: "https://via.placeholder.com/150",
        },
        {
            _id: 1,
            name: "Achelache Aymen",
            specialty: "Homologue",
            rating: 4,
            location: "Ferdjioua, Mila, Algeria",
            image: "https://via.placeholder.com/150",
        }
    ]);

    useEffect(() => {

        const fetchSpecializations = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/specializations`
                );
                setSpecialties(res.data);

            } catch (error) {
                console.error("Error fetching specializations:", error);
            }
        };

        fetchSpecializations();
    }, []);
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/doctors`, {
                    params: {
                        page: 1,
                        limit: 6,
                    },
                });
                console.log(response.data)
                setDoctors(response.data || []);
                console.log(response.data.doctors)
            } catch (err) {
                console.log(err)
            }
        };

        fetchDoctors();
    }, []);




    const SpecialitiesMedical = [
        { name: t("Specialities.Geriatrics"), icon: "🌅" },
        { name: t("Specialities.Neurology"), icon: "🧠" },
        { name: t("Specialities.Orthopedic Surgery"), icon: "🦴" },
        { name: t("Specialities.Pediatrics"), icon: "👶" },
        { name: t("Specialities.Pulmonology"), icon: "🌅" },
    ];
    return (
        <>
            <Header t={t} />
            <div className="hero hero-work">
                <div className="container mx-auto h-screen flex flex-col justify-center">
                    <div className="text text-center md:text-left">
                        <h1 className="text-white font-extrabold text-3xl lg:text-4xl">{t("HomePage.hero.title")}</h1>
                        <p className="text-white mt-5 tracking-wider text-base">{t("HomePage.hero.reservation")}</p>
                    </div>
                    <div className="mt-7 flex justify-center items-center md:justify-start flex-col md:flex-row gap-6">

                    </div>
                    <SearchBar />
                </div>
            </div>
            <div>
                <div className="shadow-md bg-white font-sans tracking-wide relative z-50">

                    <section className="flex items-center justify-center flex-wrap gap-5 relative py-3 px-10 border-gray-200 border-b lg:min-h-[80px] max-lg:min-h-[60px]">
                        <a href="#">
                            <img
                                src={logo}
                                alt="logo"
                                className="md:w-[170px] w-36"
                            />
                        </a>
                    </section>
                    <div className="flex flex-wrap py-3.5">
                        <div
                            id="collapseMenu"
                            className="w-full left-0"
                        >
                            <ul className="flex justify-center gap-x-10 overflow-x-auto">
                                <li className="max-lg:border-b max-lg:py-3">
                                    <a
                                        href="#"
                                        className="hover:text-[#007bff] text-[#007bff] font-bold text-[15px] block"
                                    >
                                        Home
                                    </a>
                                </li>
                                {specialties.map((specialty, index) => (
                                    <li key={index} value={specialty.name} className="max-lg:border-b max-lg:py-3">
                                        <a
                                            href="#"
                                            className="hover:text-[#007bff] text-gray-500 font-bold text-[15px] block text-nowrap"
                                        >
                                            {specialty.name}
                                        </a>
                                    </li>
                                ))}

                            </ul>
                        </div>
                    </div>
                </div>


            </div>





            <div className="bg-white container min-h-screen py-10 px-4">
                {/* Section des Médecins */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">{t("HomePage.home.AllDoctors")}</h2>
                        <Link to="doctors?page=1&limit=10" className="text-blue-500 hover:underline">
                            {t("HomePage.home.SeeMore")}
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {doctors.map((doctor, index) => (
                            <Link to={`doctor/${doctor.id}`} key={index}>
                                <div
                                    className="border rounded-lg p-4 shadow-md flex flex-col items-center"
                                >
                                    <img
                                        src={doctor.photo || doctorImg}
                                        alt={doctor.name}
                                        className="w-20 h-20 rounded-full mb-4"
                                    />
                                    <h3 className="text-lg font-semibold">Dr. {doctor.first_name}  {doctor.last_name}</h3>
                                    <p className="text-blue-500 text-sm">{doctor.specialization_name}</p>
                                    <p className="text-gray-600 text-sm"> {doctor.city},{doctor.state}, Algeria</p>
                                    <div className="flex my-2">
                                        <div className="flex text-yellow-400">
                                            {"★".repeat(Math.floor(doctor.rating))}
                                            {"☆".repeat(5 - Math.floor(doctor.rating))}
                                        </div>

                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <Link to={`doctor/${doctor.id}`}>
                                            <button className="text-xs border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-100">
                                                {t("HomePage.home.ViewProfile")}
                                            </button>
                                        </Link>
                                        <Link to={`doctor/${doctor.id}`}>
                                            <button className="text-xs bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                                {t("HomePage.home.BookAppointment")}
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Section des Spécialités */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {t("HomePage.home.AllSpecialties")}
                        </h2>
                        <a href="#" className="text-blue-500 hover:underline">
                            {t("HomePage.home.SeeMore")}
                        </a>
                    </div>
                    <div className="flex gap-4 overflow-x-auto">
                        {SpecialitiesMedical.map((speciality, index) => (
                            <div key={index} className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                                    {speciality.icon}
                                </div>
                                <p className="text-sm text-gray-700">{speciality.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Teleconsultation */}
            <div className="container flex items-center justify-center my-20 bg-white mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Section */}
                    <div className="space-y-6">
                        <h2 className="text-red-500 text-sm font-semibold uppercase">
                            {t("HomePage.Teleconsultation.Title")}
                        </h2>
                        <h1 className="text-4xl font-bold text-gray-900">
                            {t("HomePage.Teleconsultation.Description1")}
                            <span className="text-blue-500"> {t("HomePage.Teleconsultation.Description11")}</span>
                        </h1>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-center">
                                <span className="bg-blue-100 text-blue-500 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                                    ✓
                                </span>
                                {t("HomePage.Teleconsultation.Description2")}
                            </li>
                            <li className="flex items-center">
                                <span className="bg-blue-100 text-blue-500 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                                    ✓
                                </span>
                                {t("HomePage.Teleconsultation.Description3")}
                            </li>
                            <li className="flex items-center">
                                <span className="bg-blue-100 text-blue-500 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                                    ✓
                                </span>
                                {t("HomePage.Teleconsultation.Description4")}
                            </li>
                            <li className="flex items-center">
                                <span className="bg-blue-100 text-blue-500 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                                    ✓
                                </span>
                                {t("HomePage.Teleconsultation.Description5")}
                            </li>
                        </ul>
                    </div>

                    {/* Right Section */}
                    <div className="relative">
                        <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg bg-white">
                            <div className="relative">
                                <img
                                    className="w-full h-72 object-cover"
                                    src={image1}
                                    alt="Doctor"
                                />
                                <div className="absolute top-2 left-2 w-20 h-24 rounded-md border-2 border-white overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={image2}
                                        alt="Patient"
                                    />
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Dr. Dounia Tahraoui
                                </h3>
                                <p className="text-sm text-gray-500">{t("Specialities.Cardiology")}</p>
                            </div>
                            <div className="flex justify-around p-4 border-t">
                                <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                                    💬
                                </button>
                                <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                                    🎥
                                </button>
                                <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                                    📞
                                </button>
                                <button className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 10.5c-1.5-1-4.5-3-9-3s-7.5 2-9 3a1 1 0 000 1.6l2.5 2a1 1 0 001.3-.1l1.6-1.5c.3-.3.4-.8.2-1.2a7.7 7.7 0 013.4 0c-.2.4-.1.9.2 1.2l1.6 1.5c.3.3.8.3 1.3.1l2.5-2a1 1 0 000-1.6z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="container flex flex-col md:flex-row !items-center md:items-start gap-10 p-8 my-20">
                {/* Left Section - Image Cards */}
                <div className="w-full md:w-1/2">
                    {/* Card 1 */}
                    <div className="relative">
                        <img
                            src={image3}
                            alt="Astuces"
                            className="rounded-lg object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg flex items-end p-4">
                            <span className="text-white text-lg font-bold">DZ-TABIB</span>
                        </div>
                    </div>
                </div>

                {/* Right Section - Text and Social Icons */}
                <div className="w-full md:w-1/2">
                    <h3 className="text-red-500 uppercase font-bold tracking-wider mb-2">
                        {t("HomePage.FollowUs.Title")}
                    </h3>
                    <h2 className="text-2xl font-extrabold mb-4">
                        {t("HomePage.FollowUs.Description1")}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {t("HomePage.FollowUs.Description2")}
                        <span className="font-bold text-gray-800">{t("HomePage.FollowUs.Description3")}</span>
                    </p>

                    {/* Social Media Icons */}
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-700 hover:text-black">
                            <i className="fab fa-youtube text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-700 hover:text-black">
                            <i className="fab fa-instagram text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-700 hover:text-black">
                            <i className="fab fa-facebook text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-700 hover:text-black">
                            <i className="fab fa-linkedin text-xl"></i>
                        </a>
                    </div>
                </div>
            </div>







            <div className="bg-gray-100">
                <div className="container flex flex-col items-center justify-center py-20">
                    <h1 className="text-4xl font-bold text-blue-500 mb-4">
                        {t("HomePage.home.aboutPlatform.title")}
                    </h1>
                    <p className="!text-center text-gray-700">
                        {t("HomePage.home.aboutPlatform.description")}
                    </p>
                    <Link to='/' className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                        {t("Footer.About.AboutUs")}
                    </Link>
                </div>

            </div>




            <Footer t={t} />
        </>
    );
};

HomePage.propTypes = {
    t: PropTypes.func.isRequired,
};

// npm install prop-types
// /* eslint-disable-next-line react/prop-types */
