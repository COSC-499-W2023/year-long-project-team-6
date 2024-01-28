const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../app/backend/dao/PostDao', () => {
    return jest.fn().mockImplementation(() => ({
        authenticateUser: jest.fn(),
        getUserByEmail: jest.fn(),
        checkUsernameExists: jest.fn(),
        checkEmailExists: jest.fn(),
        signup: jest.fn()
    }));
});

const PostDao = require('../app/backend/dao/PostDao');
const userRouter = require('../app/backend/router/userRouter');

const app = express();
app.use(bodyParser.json());
const mockPostDao = new PostDao();
app.use('/api/auth', userRouter(mockPostDao));

describe('user Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /login', () => {
        it('handles user login', async () => {
            const mockUser = { email: 'test@example.com', password: 'password' };
            mockPostDao.authenticateUser.mockImplementation((email, password, callback) => {
                callback(null, true);
            });
            mockPostDao.getUserByEmail.mockImplementation((email, callback) => {
                callback(null, { id: 1, email: 'test@example.com', name: 'Test User' }); // Simulated user data
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send(mockUser);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ success: true, user: { id: 1, email: 'test@example.com', name: 'Test User' } });
            expect(mockPostDao.authenticateUser).toHaveBeenCalledWith(mockUser.email, mockUser.password, expect.any(Function));
        });
    });


    describe('POST /signup', () => {
        it('handles user signup', async () => {
            const newUser = { username: 'newuser', email: 'newuser@example.com', password: 'password', role: 'user', userImage: 'image.jpg' };
            mockPostDao.checkUsernameExists.mockImplementation((username, callback) => {
                callback(null, false);
            });
            mockPostDao.checkEmailExists.mockImplementation((email, callback) => {
                callback(null, false);
            });
            mockPostDao.signup.mockImplementation((username, email, password, role, userImage, callback) => {
                callback(null, { insertId: 1 });
            });

            const response = await request(app)
                .post('/api/auth/signup')
                .send(newUser);

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({ success: true, message: 'User successfully registered' });
            expect(mockPostDao.checkUsernameExists).toHaveBeenCalledWith(newUser.username, expect.any(Function));
            expect(mockPostDao.checkEmailExists).toHaveBeenCalledWith(newUser.email, expect.any(Function));
            expect(mockPostDao.signup).toHaveBeenCalledWith(newUser.username, newUser.email, newUser.password, newUser.role, newUser.userImage, expect.any(Function));
        });
    });
});
