
import PropTypes from 'prop-types';
import './ForgetPassword.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from './../../assets/login/logo.png';
import axios from 'axios';

export const ForgetPassword = ({ t }) => {
    const [form, setForm] = useState({ email: ""});
    const [error, setError] = useState(null);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append("email", form.email);
            console.log(form)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/forgot_password`, form, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                console.log(response);  

            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="forget-password w-full h-screen relative">
            <div className="box absolute flex flex-col justify-between bg-white h-screen py-4 px-5">
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
                            {t("Authentification.Title")}
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                    {t("Authentification.EmailAddress")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                        className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-150 ease-linear"
                                >
                                    {t("Header.Login")}
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm/6 text-gray-500">
                            {t("Authentification.NotAMember")}
                            <Link to="/signup" className="font-semibold text-blue-500 hover:text-blue-600 transition-all duration-150 ease-linear">
                                {t("Header.SignUp")}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
};

ForgetPassword.propTypes = {
    t: PropTypes.func.isRequired,
};
