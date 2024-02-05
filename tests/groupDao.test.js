// const { addNewGroup, editGroupName, deleteGroup, getGroupInfo, joinGroupByInviteCode } = require('../app/backend/dao/groupDao');
const groupDao = require('../app/backend/dao/groupDao');
const db = require('../app/backend/db/db');

jest.mock('../app/backend/db/db');

describe('Group DAO Functions', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        db.query.mockClear();
    });

    describe('addNewGroup', () => {
        it('should successfully add a new group and user to it', async () => {
            // Mock db.query to simulate successful insertion
            db.query
                .mockImplementationOnce((query, queryParams, callback) => callback(null, { insertId: 1 })) // Mocking insert group
                .mockImplementationOnce((query, queryParams, callback) => callback(null, { affectedRows: 1 })); // Mocking insert user to group

            const callback = jest.fn();
            await groupDao.addNewGroup('TestGroup', 'inviteCode', 1, callback);

            expect(callback).toHaveBeenCalledWith(null, expect.any(Object));
            expect(db.query).toHaveBeenCalledTimes(2);
        });

        // Add more tests here to cover error cases and other scenarios
    });

    describe('editGroup', () => {
        it('should successfully edit group details', async () => {
            // Mock db.query to simulate successful update
            db.query.mockImplementation((query, queryParams, callback) => callback(null, { affectedRows: 1 }));

            const callback = jest.fn();
            await groupDao.editGroup(1, 'NewGroupName', null, 'newImage.png', callback);

            expect(callback).toHaveBeenCalledWith(null, expect.any(Object));
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        // Add more tests here to cover error cases and other scenarios
    });

    describe('deleteGroup', () => {
        it('should successfully delete a group', async () => {
            // Mock db.query to simulate successful deletion
            db.query.mockImplementation((query, queryParams, callback) => callback(null, { affectedRows: 1 }));

            const callback = jest.fn();
            await groupDao.deleteGroup(1, callback);

            expect(callback).toHaveBeenCalledWith(null, expect.any(Object));
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        // Add more tests here to cover error cases and other scenarios
    });

    describe('getGroupInfo', () => {
        it('should successfully retrieve group information', async () => {
            // Mock db.query to simulate fetching group info
            db.query.mockImplementation((query, queryParams, callback) => callback(null, [{ groupid: 1, groupname: 'TestGroup' }]));

            const callback = jest.fn();
            await groupDao.getGroupInfo(1, callback);

            expect(callback).toHaveBeenCalledWith(null, expect.any(Object));
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        // Add more tests here to cover error cases and other scenarios
    });

    describe('joinGroupByInviteCode', () => {
        it('should not allow a user to join a group if they are already a member', async () => {
            // Mock db.query to simulate finding the group
            db.query
                .mockImplementationOnce((query, queryParams, callback) => callback(null, [{ groupid: 1 }])) // Simulate finding group
                .mockImplementationOnce((query, queryParams, callback) => callback(null, [{ userid: 1, groupid: 1 }])); // Simulate checking user in group

            const callback = jest.fn();
            await groupDao.joinGroupByInviteCode(1, 'validCode', callback);

            expect(callback).toHaveBeenCalledWith('User is already a member of this group', null);
            expect(db.query).toHaveBeenCalledTimes(2); // Expecting 2 calls: one for finding group and one for checking user in group
        });
    });


    describe('getAllInviteCodes', () => {
        it('should retrieve all invite codes', async () => {
            // Adjust mockImplementation to correctly match the signature of db.query in this context
            db.query.mockImplementation((query, callback) => callback(null, [{ invite_code: 'code1' }, { invite_code: 'code2' }]));

            const callback = jest.fn();
            await groupDao.getAllInviteCodes(callback);

            // Verify that the callback was called with the expected results
            expect(callback).toHaveBeenCalledWith(null, [{ invite_code: 'code1' }, { invite_code: 'code2' }]);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });
});
