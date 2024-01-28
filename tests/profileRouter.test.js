const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../app/backend/dao/profileDao', () => ({
    editUserProfile: jest.fn(),
    getUserProfile: jest.fn()
}));

const profileDao = require('../app/backend/dao/profileDao');
const profileRouter = require('../app/backend/router/profileRouter'); // Adjust path to your profileRouter file

const app = express();
app.use(bodyParser.json());
app.use('/api/profile', profileRouter); 

describe('Profile Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('PUT /edit-profile/:userId', () => {
        it('updates a user profile', async () => {
            profileDao.editUserProfile.mockImplementation((userId, userData, callback) => {
                callback(null, { message: 'Profile updated successfully' });
            });

            const response = await request(app)
                .put('/api/profile/edit-profile/123')
                .send({ name: 'Test User', email: 'test@example.com' });

            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('Profile updated successfully');
            expect(profileDao.editUserProfile).toHaveBeenCalledWith('123', { name: 'Test User', email: 'test@example.com' }, expect.any(Function));
        });
    });

    describe('GET /get-profile/:userId', () => {
        it('fetches a user profile', async () => {
            const mockProfile = { userId: '123', name: 'Test User', email: 'test@example.com' };
            profileDao.getUserProfile.mockImplementation((userId, callback) => {
                callback(null, mockProfile);
            });

            const response = await request(app)
                .get('/api/profile/get-profile/123');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockProfile);
            expect(profileDao.getUserProfile).toHaveBeenCalledWith('123', expect.any(Function));
        });
    });
});
