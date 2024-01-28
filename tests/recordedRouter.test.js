const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../app/backend/dao/recordedDao', () => ({
    getPostInfor: jest.fn(),
    getGroupInfor: jest.fn(),
    deletePost: jest.fn(),
    editPost: jest.fn()
}));

const recordedDao = require('../app/backend/dao/recordedDao');
const recordedRouter = require('../app/backend/router/recordedRouter'); 

const app = express();
app.use(bodyParser.json());
app.use('/api', recordedRouter); 

describe('Recorded Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /get-posts/:user_id', () => {
        it('retrieves posts for a user', async () => {
            const mockPosts = [{ id: 1, title: 'Test Post' }];
            recordedDao.getPostInfor.mockImplementation((userId, callback) => {
                callback(null, mockPosts);
            });

            const response = await request(app)
                .get('/api/get-posts/123');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockPosts);
            expect(recordedDao.getPostInfor).toHaveBeenCalledWith('123', expect.any(Function));
        });

    });

    describe('GET /get-groups', () => {
        it('retrieves group information', async () => {
            const mockGroups = [{ id: 1, name: 'Group1' }];
            recordedDao.getGroupInfor.mockImplementation(callback => {
                callback(null, mockGroups);
            });

            const response = await request(app)
                .get('/api/get-groups');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockGroups);
            expect(recordedDao.getGroupInfor).toHaveBeenCalledWith(expect.any(Function));
        });

    });

    describe('DELETE /delete-posts/:id', () => {
        it('deletes a post', async () => {
            recordedDao.deletePost.mockImplementation((postId, callback) => {
                callback(null, { message: 'Post deleted successfully' });
            });

            const response = await request(app)
                .delete('/api/delete-posts/1');

            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('Post with ID 1 deleted successfully');
            expect(recordedDao.deletePost).toHaveBeenCalledWith('1', expect.any(Function));
        });
    });

    describe('POST /edit-posts', () => {
        it('edits a post', async () => {
            const mockPostData = { id: '1', newTitle: 'Updated Title', newText: 'Updated text' };
            recordedDao.editPost.mockImplementation((postId, newTitle, newText, callback) => {
                callback(null, { message: 'Post updated successfully' });
            });

            const response = await request(app)
                .post('/api/edit-posts')
                .send(mockPostData);

            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('Post with ID 1 updated successfully');
            expect(recordedDao.editPost).toHaveBeenCalledWith('1', 'Updated Title', 'Updated text', expect.any(Function));
        });
    });
});
