// const dbFunctions = require('../app/backend/dao/PostDao');
const mockDb = require('../app/backend/db/db');
const PostDao = require('../app/backend/dao/PostDao');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

jest.mock('mysql');
jest.mock('bcrypt');
jest.mock('../app/backend/db/db', () => ({
    query: jest.fn()
}));


describe('PostDao', () => {
    mysql.createConnection.mockImplementation(() => ({
        query: jest.fn()
    }));
    const mockDb = new mysql.createConnection();
    const postDao = new PostDao(mockDb);

    describe('getUsernameAndPostDate', () => {
        it('should retrieve username and post date', async () => {
            const expectedResult = [{ username: 'TestUser', post_date: '2024-01-20' }];
            mockDb.query.mockImplementation((query, callback) => {
                callback(null, expectedResult);
            });
            const callback = jest.fn();
            await postDao.getUsernameAndPostDate(callback);
            expect(callback).toHaveBeenCalledWith(null, expectedResult);
        });

        it('should handle errors during query execution', async () => {
            const expectedError = new Error('Test Error');
            mockDb.query.mockImplementation((query, callback) => {
                callback(expectedError, null);
            });
            const callback = jest.fn();
            await postDao.getUsernameAndPostDate(callback);
            expect(callback).toHaveBeenCalledWith(expectedError, null);
        });
    });

    describe('authenticateUser', () => {
        it('should authenticate a user with valid credentials', async () => {
            const email = 'test@example.com';
            const password = 'password';
                    mockDb.query.mockImplementation((query, params, callback) => {
                if (query.includes('SELECT password FROM users WHERE email = ?')) {
                    const results = [{ password: 'password' }];
                    callback(null, results);
                } else {
                    callback(null, []);
                }
            });
            //instance
            const postDao = new PostDao(mockDb);
            let userExists;
            const callback = jest.fn();
            await postDao.authenticateUser(email, password, callback);
            // actual parameters
            console.log('Actual parameters received by the callback:', callback.mock.calls[0]);
            userExists = callback.mock.calls[0][1];
            expect(callback).toHaveBeenCalledWith(null, userExists);
        });        
                    

        it('should handle errors during query execution', async () => {
            const email = 'test@example.com';
            const password = 'password';
            const expectedError = new Error('Test Error');
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(expectedError, null);
            });
            const callback = jest.fn();
            await postDao.authenticateUser(email, password, callback);
            expect(callback).toHaveBeenCalledWith(expectedError, null);
        });
    });

    describe('getUserByEmail', () => {
        it('should retrieve user by email', async () => {
            const email = 'test@example.com';
            const expectedResult = {
                userid: 1,
                username: 'TestUser',
                email: 'test@example.com',
                role: 'user',
                user_image: 'user.jpg'
            };
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(null, [expectedResult]);
            });
            const callback = jest.fn();
            await postDao.getUserByEmail(email, callback);
            expect(callback).toHaveBeenCalledWith(null, expectedResult);
        });

        it('should handle user not found', async () => {
            const email = 'nonexistent@example.com';
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(null, []);
            });
            const callback = jest.fn();
            await postDao.getUserByEmail(email, callback);
            expect(callback).toHaveBeenCalledWith(new Error('User not found'), null);
        });

        it('should handle errors during query execution', async () => {
            const email = 'test@example.com';
            const expectedError = new Error('Test Error');
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(expectedError, null);
            });
            const callback = jest.fn();
            await postDao.getUserByEmail(email, callback);
            expect(callback).toHaveBeenCalledWith(expectedError, null);
        });
    });

    describe('checkUsernameExists', () => {
        it('should return true if username exists', async () => {
            const username = 'TestUser';
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(null, [{ count: 1 }]);
            });
            const callback = jest.fn();
            await postDao.checkUsernameExists(username, callback);
            expect(callback).toHaveBeenCalledWith(null, true);
        });

        it('should return false if username does not exist', async () => {
            const username = 'NonExistentUser';
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(null, [{ count: 0 }]);
            });
            const callback = jest.fn();
            await postDao.checkUsernameExists(username, callback);
            expect(callback).toHaveBeenCalledWith(null, false);
        });

        it('should handle errors during query execution', async () => {
            const username = 'TestUser';
            const expectedError = new Error('Test Error');
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(expectedError, null);
            });
            const callback = jest.fn();
            await postDao.checkUsernameExists(username, callback);
            expect(callback).toHaveBeenCalledWith(expectedError, null);
        });
    });
    describe('checkEmailExists', () => {
        it('should return true if email exists', async () => {
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(null, [{ count: 1 }]);
            });
            const callback = jest.fn();
            await postDao.checkEmailExists('test@example.com', callback);
            expect(callback).toHaveBeenCalledWith(null, true);
        });

        it('should return false if email does not exist', async () => {
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(null, [{ count: 0 }]);
            });
            const callback = jest.fn();
            await postDao.checkEmailExists('nonexistent@example.com', callback);
            expect(callback).toHaveBeenCalledWith(null, false);
        });

        it('should handle errors during query execution', async () => {
            const expectedError = new Error('Test Error');
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(expectedError, null);
            });
            const callback = jest.fn();
            await postDao.checkEmailExists('test@example.com', callback);
            expect(callback).toHaveBeenCalledWith(expectedError, null);
        });
    });
    describe('signup', () => {
        it('should successfully sign up a user', async () => {
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(null, { insertId: 1 }); // Simulate a successful insertion
            });
            const callback = jest.fn();
            await postDao.signup('testUser', 'test@example.com', 'password', 'user', 'image.jpg', callback);
            expect(callback).toHaveBeenCalledWith(null, { insertId: 1 });
        });

        it('should handle errors during signup', async () => {
            const expectedError = new Error('Test Error');
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(expectedError, null);
            });
            const callback = jest.fn();
            await postDao.signup('testUser', 'test@example.com', 'password', 'user', 'image.jpg', callback);
            expect(callback).toHaveBeenCalledWith(expectedError, null);
        });
    });
});




