const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const groupRouter = require('../app/backend/router/groupRouter');

const app = express();
app.use(bodyParser.json());
app.use('/api/group', groupRouter);

jest.mock('../app/backend/dao/groupDao', () => ({
    addNewGroup: jest.fn(),
    editGroupName: jest.fn(),
    deleteGroup: jest.fn(),
    getGroupInfo: jest.fn(),
    joinGroupByInviteCode: jest.fn()
}));

const { addNewGroup, editGroupName, deleteGroup, getGroupInfo, joinGroupByInviteCode } = require('../app/backend/dao/groupDao');

const groupDao = require('../app/backend/dao/groupDao');

describe('Group Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/groups/add-group', () => {
        it('should add a new group and return 200', async () => {
          const mockGroup = { groupName: 'Test Group', code: '1234', admin: 'adminUserId' };
          require('../app/backend/dao/groupDao').addNewGroup.mockImplementation((groupName, code, admin, cb) => cb(null, { id: 'newGroupId' }));
          
          await request(app)
            .post('/api/group/add-group')
            .send(mockGroup)
            .expect(200)
            .then((response) => {
              expect(response.body.message).toContain('New group added successfully');
            });
        });
    });

    describe('POST /edit-group/:id', () => {
        it('updates a group name', async () => {
            groupDao.editGroupName.mockImplementation((groupId, newGroupName, callback) => {
                callback(null, { affectedRows: 1 });
            });

            const response = await request(app)
                .post('/api/group/edit-group/1')
                .send({ newGroupName: 'UpdatedGroupName', newAdmin: 'newAdminId' });

            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('Group name updated successfully');
            expect(editGroupName).toHaveBeenCalledWith('1', 'UpdatedGroupName', expect.any(Function));
        });

    });

    describe('DELETE /delete-group/:id', () => {
        it('deletes a group', async () => {
            deleteGroup.mockImplementation((groupId, callback) => {
                callback(null, { affectedRows: 1 });
            });

            const response = await request(app)
                .delete('/api/group/delete-group/1');

            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('Group deleted successfully');
            expect(deleteGroup).toHaveBeenCalledWith('1', expect.any(Function));
        });

    });

    describe('GET /get-group-infor/:id', () => {
        it('retrieves group information', async () => {
            getGroupInfo.mockImplementation((groupId, callback) => {
                callback(null, { groupId: 1, groupName: 'TestGroup' });
            });

            const response = await request(app)
                .get('/api/group/get-group-infor/1');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ groupId: 1, groupName: 'TestGroup' });
            expect(getGroupInfo).toHaveBeenCalledWith('1', expect.any(Function));
        });

    });

    describe('POST /join-group/:userId', () => {
        it('allows a user to join a group', async () => {
            joinGroupByInviteCode.mockImplementation((userId, inviteCode, callback) => {
                callback(null, { message: 'Successfully joined the group' });
            });

            const response = await request(app)
                .post('/api/group/join-group/1')
                .send({ inviteCode: '1234' });

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toContain('Successfully joined the group');
            expect(joinGroupByInviteCode).toHaveBeenCalledWith('1', '1234', expect.any(Function));
        });
    });
});

