


import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.scss';
import logo from './../../assets/login/logo.png';
import axios from 'axios';

export const SignUp = ({ t }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        phone_number: '',
        email: '',
        password: '',
        is_doctor: false,
        confirmPassword: '',
    });


    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};

        // Check if firstName is not empty
        if (!formData.first_name.trim()) {
            newErrors.first_name = t("Errors.RequiredFirstName");
        }

        // Check if lastName is not empty
        if (!formData.last_name.trim()) {
            newErrors.last_name = t("Errors.RequiredLastName");
        }

        // Check if userName is not empty
        if (!formData.username.trim()) {
            newErrors.userName = t("Errors.RequiredUsername");
        }

        // Check if phone_number is not empty
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = t("Errors.Requiredphone_number");
        }

        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
        if (!formData.email.trim()) {
            newErrors.email = t("Errors.RequiredEmail");
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = t("Errors.InvalidEmail"); // Add "InvalidEmail" to your translation file
        }

        // Check if password matches confirmPassword
        if (!formData.password) {
            newErrors.password = t("Errors.RequiredPassword");
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t("Errors.PasswordMismatch");
        }

        // Update state with errors
        setErrors(newErrors);

        // Return true if there are no errors
        return Object.keys(newErrors).length === 0;
    };


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Exclude confirmPassword from the data being sent
        // eslint-disable-next-line no-unused-vars
        const { confirmPassword, ...dataToSend } = formData;

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                // Navigate to the login page on success
                navigate('/login');
            } else {
                setErrors({ server: response.data.message || t("Errors.UnknownError") });
            }
        } catch (err) {
            console.log()
            const msgError = err.response?.data?.detail || err.response?.data?.detail[0].msg
            if (err.response) {
                // Server returned an error response
                setErrors({ server: msgError || "Errors.UnknownError" });
            } else {
                setErrors({ server: 'An error occurred. Please try again.' });
            }
        }
    };

    return (
        <div className="signup w-full h-[120vh] relative">
            <div className="box absolute flex flex-col justify-between bg-white h-full py-4 px-5">
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <Link to="/">
                            <img
                                alt="Your Company"
                                src={logo}
                                className="mx-auto h-20 w-auto"
                            />
                        </Link>
                        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                            {t("Authentification.CreateAccount")}
                        </h2>
                    </div>

                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div>
                                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                    {t("Authentification.userName")}
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}

                                        autoComplete="username"
                                        className="block w-full rounded-md border-0  px-2 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                    />
                                    {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                                <div className='col-span-1'>
                                    <label htmlFor="first_name" className="block text-sm/6 font-medium text-gray-900">
                                        {t("Authentification.firstName")}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            autoComplete="first_name"
                                            className="block w-full rounded-md border-0  px-2 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                        />
                                        {errors.first_name && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                                    </div>
                                </div>
                                <div className='col-span-1'>
                                    <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-900">
                                        {t("Authentification.lastName")}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            autoComplete="last_name"
                                            className="block w-full rounded-md border-0  px-2 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                        />
                                        {errors.last_name && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                                    </div>
                                </div>
                            </div>


                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                    {t("Authentification.EmailAddress")}
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0  px-2 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-1">
                                <div className='col-span-1'>
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                        {t("Authentification.Password")}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            min={8}
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                            className="block w-full rounded-md border-0  px-2 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                        />
                                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                    </div>
                                </div>

                                <div className='col-span-1'>
                                    <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                                        {t("Authentification.ConfirmPassword")}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            min={8}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                            className="block w-full rounded-md border-0  px-2 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                                    </div>
                                </div>


                            </div>
                            <div>
                                <label htmlFor="phone_number" className="block text-sm/6 font-medium text-gray-900">
                                    {t("Authentification.phone_number")}
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="phone_number"
                                        name="phone_number"
                                        type="text"
                                        value={formData.phone_number}
                                        onChange={handleChange}

                                        autoComplete="phone_number"
                                        className="block w-full rounded-md border-0  px-2 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                    />
                                    {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}
                                </div>
                            </div>
                            <div>
                                <label className='flex items-center gap-2'>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_doctor}
                                        onChange={(e) => setFormData({ ...formData, is_doctor: e.target.checked })}
                                    />
                                    <p>Are you a doctor?</p>
                                </label>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-150 ease-linear"
                                >
                                    {t("Header.SignUp")}
                                </button>
                            </div>
                        </form>
                        {errors.server && <p className="mt-2 text-red-500 text-sm text-center">{errors.server}</p>}
                        <p className="mt-5 text-center text-sm/6 text-gray-500">
                            {t("Authentification.AlreadyHaveAccount")}{' '}
                            <Link to="/login" className="font-semibold text-blue-500 hover:text-indigo-600 transition-all duration-150 ease-linear">
                                {t("Header.Login")}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

SignUp.propTypes = {
    t: PropTypes.func.isRequired,
};
