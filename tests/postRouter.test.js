const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../app/backend/dao/displayDAO', () => ({
    getUsernameAndPostDate: jest.fn(),
    addPost: jest.fn()
}));

const displayDAO = require('../app/backend/dao/displayDAO');
const postRouter = require('../app/backend/router/postRouter'); 

const app = express();
app.use(bodyParser.json());
app.use('/api/posts', postRouter); 

describe('Post Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /post-history/:user_id', () => {
        it('retrieves post history for a user', async () => {
            const mockPosts = [{ postId: 1, username: 'user1', date: '2024-01-01' }];
            displayDAO.getUsernameAndPostDate.mockImplementation((userId, callback) => {
                callback(null, mockPosts);
            });

            const response = await request(app)
                .get('/api/posts/post-history/123');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ data: mockPosts });
            expect(displayDAO.getUsernameAndPostDate).toHaveBeenCalledWith('123', expect.any(Function));
        });
    });

    describe('POST /add-post', () => {
        it('adds a new post', async () => {
            const mockPostData = { title: 'Test Post', content: 'This is a test' };
            displayDAO.addPost.mockImplementation((postData, callback) => {
                callback(null, { insertId: 1 });
            });

            const response = await request(app)
                .post('/api/posts/add-post')
                .send(mockPostData);

            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('New post added successfully');
            expect(displayDAO.addPost).toHaveBeenCalledWith(mockPostData, expect.any(Function));
        });
    });
});
