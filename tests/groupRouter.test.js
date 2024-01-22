const { addNewGroup, editGroupName, deleteGroup, getGroupInfo } = require('../app/backend/dao/groupDao');
const express = require('express');
const request = require('supertest');
const router = require('../app/backend/router/groupRouter');

jest.mock('../app/backend/dao/groupDao');

const app = express();
app.use(express.json());
app.use('/groups', router);

describe('Group Routes', () => {
    const mockGroupId = 1;
    const mockGroupName = 'TestGroup';
    const mockGroupCode = 'ABC123';

    test('POST /groups/edit-group/:id should edit group name', async () => {
        editGroupName.mockImplementation((groupId, newGroupName, callback) => {
            callback(null, {});
        });

        const response = await request(app)
            .post('/groups/edit-group/1')
            .send({ newGroupName: 'NewTestGroup' });

        expect(response.status).toBe(200);
        expect(response.text).toContain('Group name updated successfully');
    });

    test('POST /groups/add-group - should add a new group successfully', async () => {
        const mockResult = { insertId: mockGroupId };
        addNewGroup.mockImplementationOnce((groupName, code, callback) => {
            callback(null, mockResult);
        });

        const response = await request(app)
            .post('/groups/add-group')
            .send({ groupName: mockGroupName, code: mockGroupCode });

        expect(response.status).toBe(200);
        expect(response.text).toContain('New group added successfully');
    });

    test('DELETE /groups/delete-group/:id should delete a group', async () => {
        deleteGroup.mockImplementation((groupId, callback) => {
            callback(null, {});
        });

        const response = await request(app).delete('/groups/delete-group/1');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Group deleted successfully');
    });

    test('GET /groups/get-group-info/:id should get group information', async () => {
        const mockGroup = {
            id: mockGroupId,
            name: mockGroupName,
            code: mockGroupCode,
        };

        getGroupInfo.mockImplementation((groupId, callback) => {
            callback(null, mockGroup);
        });

        const response = await request(app).get('/groups/get-group-infor/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockGroup);
    }, 10000);
});
