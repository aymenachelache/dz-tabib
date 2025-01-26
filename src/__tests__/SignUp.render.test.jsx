import React from 'react';
import { render, screen } from '@testing-library/react';
import { SignUp } from '../pages/signUp/SignUp'; // Corrected import path
import { BrowserRouter as Router } from 'react-router-dom';

// Mock translation function
const t = (key) => key;

describe('SignUp Component - Rendering', () => {
    test('renders the sign-up form', () => {
        render(
            <Router>
                <SignUp t={t} />
            </Router>
        );

        // Check if the form elements are rendered
        expect(screen.getByLabelText(/Authentification.userName/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Authentification.firstName/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Authentification.lastName/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Authentification.EmailAddress/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Authentification.Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Authentification.ConfirmPassword/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Authentification.phone_number/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Header.SignUp/i })).toBeInTheDocument();
    });
});