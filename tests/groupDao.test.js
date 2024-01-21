const { addNewGroup, editGroupName, deleteGroup, getGroupInfo } = require('../app/backend/dao/groupDao');
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
        // Mocking a database error
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