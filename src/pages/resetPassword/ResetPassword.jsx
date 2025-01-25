import PropTypes from 'prop-types';
import './ResetPassword.scss';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import logo from './../../assets/login/logo.png';
import axios from 'axios';

export const ResetPassword = ({ t }) => {
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate =  useNavigate();
    // Récupérer le token depuis l'URL
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!token) {
            setError('Token is missing in the URL.');
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/reset_password`, {
                token,
                new_password: form.password,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response);

            if (response.status === 200) {
                setSuccessMessage('Your password has been reset successfully.');
                setForm({ password: '', confirmPassword: '' });
                navigate('/login');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="reset-password w-full h-screen relative">
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
                            {t("Authentification.ResetPasswordTitle")}
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    {t("Authentification.NewPassword")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete="new-password"
                                        className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                                    {t("Authentification.ConfirmPassword")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        autoComplete="new-password"
                                        className="block w-full border-0 rounded-lg p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm/6 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-150 ease-linear"
                                >
                                    {t("Authentification.ResetPassword")}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

ResetPassword.propTypes = {
    t: PropTypes.func.isRequired,
};
