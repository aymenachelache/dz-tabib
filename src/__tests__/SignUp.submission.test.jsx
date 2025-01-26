import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignUp } from '../pages/signUp/SignUp'; // Corrected import path
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock translation function
const t = (key) => key;

describe('SignUp Component - Form Submission', () => {
  test('submits the form with valid data', async () => {
    // Mock a successful axios response
    axios.post.mockResolvedValueOnce({
      status: 200,
    });

    render(
      <Router>
        <SignUp t={t} />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/Authentification.userName/i);
    const firstNameInput = screen.getByLabelText(/Authentification.firstName/i);
    const lastNameInput = screen.getByLabelText(/Authentification.lastName/i);
    const emailInput = screen.getByLabelText(/Authentification.EmailAddress/i);
    const passwordInput = screen.getByLabelText(/Authentification.Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Authentification.ConfirmPassword/i);
    const phoneNumberInput = screen.getByLabelText(/Authentification.phone_number/i);
    const submitButton = screen.getByRole('button', { name: /Header.SignUp/i });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for the axios call to resolve
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/register'), // Use expect.stringContaining to match the endpoint
        {
          first_name: 'John',
          last_name: 'Doe',
          username: 'testuser',
          phone_number: '1234567890',
          email: 'john.doe@example.com',
          password: 'password123',
          is_doctor: false,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    });
  });
});