const {getUserProfile,editUserProfile} = require('../app/backend/dao/profileDao');
const db = require('../app/backend/db/db');

jest.mock('../app/backend/db/db');

describe('getUserProfile function', () => {
    test('should retrieve user profile successfully', async () => {
        const mockResult = {
            username: 'testUser',
            email: 'test@example.com',
            role: 'user',
            gender: 'male',
            birthday: '1990-01-01',
        };
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, [mockResult]);
        });
        const mockCallback = jest.fn();
        await getUserProfile(1, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, mockResult);
    });

    test('should handle errors during user profile retrieval', async () => {
        const mockError = new Error('Database error');
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(mockError, null);
        });
        const mockCallback = jest.fn();
        await getUserProfile(1, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(mockError, null);
    });
});

describe('editUserProfile function', () => {
    test('should edit user profile successfully', async () => {
        const mockResult = { affectedRows: 1 };
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, mockResult);
        });
        const mockCallback = jest.fn();
        const userData = {
            username: 'newUsername',
            email: 'newEmail@example.com',
            gender: 'female',
            birthday: '1995-01-01',
        };
        await editUserProfile(1, userData, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, mockResult);
    });

    test('should handle errors during user profile editing', async () => {
        const mockError = new Error('Database error');
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(mockError, null);
        });
        const mockCallback = jest.fn();
        const userData = {
            username: 'newUsername',
            email: 'newEmail@example.com',
            gender: 'female',
            birthday: '1995-01-01',
        };
        await editUserProfile(1, userData, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(mockError, null);
    });
});