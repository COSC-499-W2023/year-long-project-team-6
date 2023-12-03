import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import UserProfile from './userProfile';
import profilePicture from '../app/userProfile_UI/AvatarForProfile.png';
jest.mock('../app/userProfile_UI/AvatarForProfile.png', () => 'mock-image-path');

const defaultUser = {
    name: 'David',
    email: 'DavidIsWorking@UBC.com',
    profilePicture: profilePicture,
    gender: 'Male',
    Bdate: '2001-01-01',
    role: 'Sender'
};
test('renders user profile with default values', () => {
    render(<UserProfile user={defaultUser} />);

    // Check if the default values are rendered
    expect(screen.getByText(/Username: David/i)).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
        const hasEmailText = element.tagName.toLowerCase() === 'p' &&
            element.textContent.includes('Email:');
        const hasExpectedEmail = element.textContent.includes('DavidIsWorking@UBC.com');
        return hasEmailText && hasExpectedEmail;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
        const hasGenderText = element.tagName.toLowerCase() === 'p' &&
            element.textContent.includes('Gender:');
        const hasExpectedGender = element.textContent.includes('Male');
        return hasGenderText && hasExpectedGender;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
        const hasBirthDateText = element.tagName.toLowerCase() === 'p' &&
            element.textContent.includes('Birth Date:');
        const hasExpectedBirthDate = element.textContent.includes('2001-01-01');
        return hasBirthDateText && hasExpectedBirthDate;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
        const hasRoleText = element.tagName.toLowerCase() === 'p' &&
            element.textContent.includes('Role:');
        const hasExpectedRole = element.textContent.includes('Sender');
        return hasRoleText && hasExpectedRole;
    })).toBeInTheDocument();
    expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();

});