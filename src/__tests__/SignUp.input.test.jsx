
import React from 'react'; // Add this line
import { render, screen, fireEvent } from '@testing-library/react';
import { SignUp } from '../pages/signUp/SignUp'; // Corrected import path
import { BrowserRouter as Router } from 'react-router-dom';

// Mock translation function
const t = (key) => key;

describe('SignUp Component - User Input', () => {
    test('updates username and email fields on user input', () => {
        render(
            <Router>
                <SignUp t={t} />
            </Router>
        );

        const usernameInput = screen.getByLabelText(/Authentification.userName/i);
        const emailInput = screen.getByLabelText(/Authentification.EmailAddress/i);

        // Simulate user typing
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        // Check if the inputs have the correct values
        expect(usernameInput.value).toBe('testuser');
        expect(emailInput.value).toBe('test@example.com');
    });
});