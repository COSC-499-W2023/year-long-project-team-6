jest.mock('mysql');
const mysql = require('mysql');
const RecordedDao = require('../app/backend/dao/recordedDao');

const mockQuery = jest.fn();
const mockDb = {
    query: mockQuery,
};

describe('recordedDao', () => {
    let dao;

    beforeEach(() => {
        dao = new RecordedDao(mockDb);
        mockQuery.mockReset();
    });

    it('should query the database for post information', () => {
        const callback = jest.fn();
        const userId = 'testUserId';
        dao.getPostInfor(userId, callback);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT p.userid, p.post_id, p.post_title, p.post_date, p.s3_content_key, p.post_text FROM posts p WHERE p.userid = ?'),
            [userId],
            expect.any(Function)
        );
    });

    it('should query the database for group information', () => {
        const callback = jest.fn();
        dao.getGroupInfor(callback);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT groupid, groupname FROM groups'),
            expect.any(Function)
        );
    });

    it('should delete a post from the database', () => {
        const callback = jest.fn();
        const postId = 'testPostId';
        dao.deletePost(postId, callback);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM posts WHERE post_id = ?'),
            [postId],
            expect.any(Function)
        );
    });

    it('should update a post in the database', () => {
        const callback = jest.fn();
        const postId = 'testPostId';
        const newTitle = 'New Title';
        const newText = 'New Text';
        dao.editPost(postId, newTitle, newText, callback);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE posts SET post_title = ?, post_text = ? WHERE post_id = ?'),
            [newTitle, newText, postId],
            expect.any(Function)
        );
    });
});
