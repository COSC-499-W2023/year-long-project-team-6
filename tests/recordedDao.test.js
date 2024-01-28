const {getPostInfor, getGroupInfor,deletePost, editPost} = require('../app/backend/dao/recordedDao');
const db = require('../app/backend/db/db');
const mysql = require('mysql');

jest.mock('../app/backend/db/db');

describe('getPostInfor function', () => {
    test('should retrieve post information for a given userId', async () => {
        // Set up mock results for the database query
        const mockResults = [{ userid: 1, post_id: 1, post_title: 'Test Post', post_date: '2022-01-01', post_text: 'Lorem ipsum' }];
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, mockResults);
        });
        const mockCallback = jest.fn();
        await getPostInfor(1, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, mockResults);
    });

    test('should handle errors during database query', async () => {
        const mockError = new Error('Database error');
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(mockError, null);
        });
        const mockCallback = jest.fn();
        await getPostInfor(1, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(mockError, null);
    });
});

describe('deletePost function', () => {
    test('should delete a post successfully', async () => {
        const mockResult = { affectedRows: 1 };
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, mockResult);
        });
        const mockCallback = jest.fn();
        await deletePost(1, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, mockResult);
    });

    test('should handle errors during post deletion', async () => {
        const mockError = new Error('Database error');
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(mockError, null);
        });
        const mockCallback = jest.fn();
        await deletePost(1, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(mockError, null);
    });
});
describe('editPost function', () => {
    test('should edit a post successfully', async () => {
        const mockResult = { affectedRows: 1 };
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, mockResult);
        });
        const mockCallback = jest.fn();
        await editPost(1, 'New Title', 'New Text', mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, mockResult);
    });

    test('should handle errors during post editing', async () => {
        const mockError = new Error('Database error');
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(mockError, null);
        });
        const mockCallback = jest.fn();
        await editPost(1, 'New Title', 'New Text', mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(mockError, null);
    });
});
describe('getGroupInfor function', () => {
    test('should retrieve group information', async () => {
        const mockResults = [{ groupid: 1, groupname: 'Test Group' }];
        db.query.mockImplementationOnce((query, callback) => {
            callback(null, mockResults);
        });
        const mockCallback = jest.fn();
        await getGroupInfor(mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, mockResults);
    });

    test('should handle errors during database query', async () => {
        const mockError = new Error('Database error');
        db.query.mockImplementationOnce((query, callback) => {
            callback(mockError, null);
        });
        const mockCallback = jest.fn();
        await getGroupInfor(mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(mockError, null);
    });
});