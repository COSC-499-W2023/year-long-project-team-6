const express = require('express');
const request = require('supertest');
// const { mockRequest, mockResponse } = require('jest-mock-req-res');
const router = require('../app/backend/router/postRouter.js'); 

jest.mock('../app/backend/dao/displayDAO', () => {
    return jest.fn().mockImplementation(() => {
        return {
            getUsernameAndPostDate: jest.fn().mockImplementation((callback) => {
                const mockData = [
                    { username: 'user1', postDate: '2024-01-14' },
                ];
                callback(null, mockData);
            }),
        };
    });
});

describe('GET /post-history', () => {
    test('should respond with JSON data', async () => {
        const app = express();
        app.use('/', router);

        const response = await request(app).get('/post-history');
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toEqual([
            { username: 'user1', postDate: '2024-01-14' },
        ]);
    });
});
