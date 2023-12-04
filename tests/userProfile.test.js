import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from './userProfile';
import profilePicture from '../app/userProfile_UI/AvatarForProfile.png';
jest.mock('../app/userProfile_UI/AvatarForProfile.png', () => 'mock-image-path');

describe('UserProfile Component', () => {
    beforeEach(() => {
        sessionStorage.setItem('user', JSON.stringify({
            name: 'David',
            email: 'DavidIsWorking@UBC.com',
            // profilePicture: profilePicture,
            gender: 'Male',
            Bdate: '2001-01-01',
            role: 'Sender'
        }));
    });
    it('renders user profile with default values', () => {
        render(<UserProfile />);
        expect(screen.getByText(/Username:/)).toBeInTheDocument();
        expect(screen.getByText(/Email:/)).toBeInTheDocument();
        expect(screen.getByText(/DavidIsWorking@UBC\.com/)).toBeInTheDocument();
        expect(screen.getByText(/Gender:/)).toBeInTheDocument();
        expect(screen.getByText(/Male/)).toBeInTheDocument();
        expect(screen.getByText(/Birth Date:/)).toBeInTheDocument();
        expect(screen.getByText(/2001-01-01/)).toBeInTheDocument();
        expect(screen.getByText(/Role:/)).toBeInTheDocument();
        expect(screen.getByText(/Sender/)).toBeInTheDocument();
    });
    //edit function in progress
    it('toggles edit mode', async () => {
        render(<UserProfile />);
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Edit Profile'));
        await waitFor(() => {
            expect(screen.getByText('Save')).toBeInTheDocument();
        });
    });
});