const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../app/backend/dao/homeDao', () => ({
    getGroups: jest.fn(),
    countPeople: jest.fn()
}));

const homeDao = require('../app/backend/dao/homeDao');
const homeRouter = require('../app/backend/router/homeRouter'); // Adjust path to your homeRouter file

const app = express();
app.use(bodyParser.json());
app.use('/api/home', homeRouter); 

describe('Home Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /groups/:userId', () => {
        it('retrieves groups for a user', async () => {
            const mockGroups = [{ id: 1, name: 'Group1' }, { id: 2, name: 'Group2' }];
            homeDao.getGroups.mockImplementation((userId, callback) => {
                callback(null, mockGroups);
            });

            const response = await request(app)
                .get('/api/home/groups/123');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockGroups);
            expect(homeDao.getGroups).toHaveBeenCalledWith('123', expect.any(Function));
        });

    });

    describe('GET /groups/count/:userId', () => {
        it('counts group members for a user', async () => {
            homeDao.countPeople.mockImplementation((userId, callback) => {
                callback(null, 5); // Mock count
            });

            const response = await request(app)
                .get('/api/home/groups/count/123');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ memberCount: 5 });
            expect(homeDao.countPeople).toHaveBeenCalledWith('123', expect.any(Function));
        });
    });
});
