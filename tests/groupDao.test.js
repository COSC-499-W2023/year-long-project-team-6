const { addNewGroup, editGroupName, deleteGroup, getGroupInfo,joinGroupByInviteCode } = require('../app/backend/dao/groupDao');
const db = require('../app/backend/db/db');

jest.mock('../app/backend/db/db');

describe('addNewGroup', () => {
    test('adds a new group to the database', async () => {
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, { insertId: 1 }); // Assuming the query was successful and returned an insertId
        });
        const callback = jest.fn();
        await addNewGroup('TestGroup', '123456', callback);
        expect(db.query).toHaveBeenCalledWith(
            'INSERT INTO `groups` (`groupname`, `invite_code`) VALUES (?, ?)',
            ['TestGroup', '123456'],
            expect.any(Function)
        );
        expect(callback).toHaveBeenCalledWith(null, { insertId: 1 });
    });

    test('handles database error', async () => {
        db.query.mockImplementationOnce((query, values, callback) => {
            callback('Database error', null);
        });
        const callback = jest.fn();
        await addNewGroup('TestGroup', '123456', callback);
        expect(db.query).toHaveBeenCalledWith(
            'INSERT INTO `groups` (`groupname`, `invite_code`) VALUES (?, ?)',
            ['TestGroup', '123456'],
            expect.any(Function)
        );
        expect(callback).toHaveBeenCalledWith('Error adding group', null);
    });
});
describe('editGroupName', () => {
    test('edits the group name in the database', async () => {
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, { affectedRows: 1 }); // Assuming the query was successful and affected 1 row
        });
        const callback = jest.fn();
        await editGroupName(1, 'NewTestGroup', callback);
        expect(db.query).toHaveBeenCalledWith(
            'UPDATE groups SET groupname = ? WHERE groupid = ?',
            ['NewTestGroup', 1],
            expect.any(Function)
        );
        expect(callback).toHaveBeenCalledWith(null, { affectedRows: 1 });
    });

    test('handles database error', async () => {
        db.query.mockImplementationOnce((query, values, callback) => {
            callback('Database error', null);
        });
        const callback = jest.fn();
        await editGroupName(1, 'NewTestGroup', callback);
        expect(db.query).toHaveBeenCalledWith(
            'UPDATE groups SET groupname = ? WHERE groupid = ?',
            ['NewTestGroup', 1],
            expect.any(Function)
        );
        expect(callback).toHaveBeenCalledWith('Database error', null);
    });
});
describe('deleteGroup', () => {
    test('deletes the group from the database', async () => {
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, { affectedRows: 1 }); // Assuming the query was successful and affected 1 row
        });
        const callback = jest.fn();
        await deleteGroup(1, callback);
        expect(db.query).toHaveBeenCalledWith(
            'DELETE FROM groups WHERE groupid = ?',
            [1],
            expect.any(Function)
        );
        expect(callback).toHaveBeenCalledWith(null, { affectedRows: 1 });
    });

    test('handles database error', async () => {
        db.query.mockImplementationOnce((query, values, callback) => {
            callback('Database error', null);
        });
        const callback = jest.fn();
        await deleteGroup(1, callback);
        expect(db.query).toHaveBeenCalledWith(
            'DELETE FROM groups WHERE groupid = ?',
            [1],
            expect.any(Function)
        );
        expect(callback).toHaveBeenCalledWith('Database error', null);
    });
});
describe('getGroupInfo', () => {
    test('returns group information from the database', async () => {
        const mockResults = [{ groupId: 1, groupName: 'TestGroup' }];
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, mockResults);
        });
        const callback = jest.fn();
        await getGroupInfo(1, callback);
        expect(db.query).toHaveBeenCalledWith(
            'SELECT * FROM groups WHERE groupid = ?',
            [1],
            expect.any(Function)
        );
        expect(callback).toHaveBeenCalledWith(null, mockResults[0]);
    });

    test('handles database error', async () => {
        db.query.mockImplementationOnce((query, values, callback) => {
            callback('Database error', null);
        });
        const callback = jest.fn();
        await getGroupInfo(1, callback);
        expect(db.query).toHaveBeenCalledWith(
            'SELECT * FROM groups WHERE groupid = ?',
            [1],
            expect.any(Function)
        );
        expect(callback).toHaveBeenCalledWith('Database error', null);
    });
});
describe('joinGroupByInviteCode', () => {
    test('should join a group with a valid invite code', (done) => {
        const userId = 1;
        const inviteCode = 'ABC123';
        const mockGroupResults = [{ groupid: 123 }];

        db.query.mockImplementationOnce((query, values, callback) => {
            expect(query).toContain('SELECT groupid FROM groups WHERE invite_code = ?');
            expect(values).toEqual([inviteCode]);
            callback(null, mockGroupResults);
        });

        db.query.mockImplementationOnce((query, values, callback) => {
            expect(query).toContain('INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)');
            expect(values).toEqual([userId, mockGroupResults[0].groupid]);
            callback(null, { /* Mock insert result */ });
        });

        joinGroupByInviteCode(userId, inviteCode, (err, result) => {
            expect(err).toBeNull();
            expect(result).toBeDefined();
            done();
        });
    });

    test('should handle no group found with the provided invite code', (done) => {
        const userId = 1;
        const inviteCode = 'INVALID';

        db.query.mockImplementationOnce((query, values, callback) => {
            expect(query).toContain('SELECT groupid FROM groups WHERE invite_code = ?');
            expect(values).toEqual([inviteCode]);
            callback(null, []); // Simulate no group found
        });

        joinGroupByInviteCode(userId, inviteCode, (err, result) => {
            expect(err).toBe('No group found with the provided invite code');
            expect(result).toBeNull();
            done();
        });
    });

    test('should handle database query error', (done) => {
        const userId = 1;
        const inviteCode = 'ABC123';
        const mockError = new Error('Database error');

        db.query.mockImplementationOnce((query, values, callback) => {
            callback(mockError, null);
        });

        joinGroupByInviteCode(userId, inviteCode, (err, result) => {
            expect(err).toEqual(mockError);
            expect(result).toBeNull();
            done();
        });
    });
});