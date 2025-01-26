
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignUp } from '../pages/signUp/SignUp';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock translation function
const t = (key) => key;

describe('SignUp Component - Checkbox Interaction', () => {
    test('updates is_doctor checkbox when clicked', () => {
        render(
            <Router>
                <SignUp t={t} />
            </Router>
        );

        const checkbox = screen.getByRole('checkbox', { name: /Are you a doctor?/i });

        // Simulate clicking the checkbox
        fireEvent.click(checkbox);

        // Check if the checkbox is checked
        expect(checkbox.checked).toBe(true);

        // Simulate clicking the checkbox again
        fireEvent.click(checkbox);

        // Check if the checkbox is unchecked
        expect(checkbox.checked).toBe(false);
    });
});