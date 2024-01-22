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

    test('POST /groups/add-group should handle missing data', async () => {
        addNewGroup.mockImplementation((groupName, code, callback) => {
            callback(null, { insertId: mockGroupId });
        });
        const response = await request(app)
            .post('groups/add-group')
            .send({});
        expect(response.status).toBe(200);
    });

    test('POST /edit-group/:id should edit group name', async () => {
        // Mocking the editGroupName function
        editGroupName.mockImplementation((groupId, newGroupName, callback) => {
            // Simulate a successful update
            callback(null, 'Update successful');
        });
        const response = await request(app)
            .post('/edit-group/1')
            .send({ newGroupName: 'NewTestGroup' });

        expect(response.status).toBe(200);
        expect(response.text).toContain('Group name updated successfully');
    });

    test('DELETE /delete-group/:id should delete a group', async () => {
        // Mocking the deleteGroup function
        deleteGroup.mockImplementation((groupId, callback) => {
            // Simulate a successful deletion
            callback(null, 'Deletion successful');
        });
        const response = await request(app).delete('/delete-group/1');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Group deleted successfully');
    });

    test('GET /get-group-infor/:id should get group information', async () => {
        // Mocking the getGroupInfo function
        getGroupInfo.mockImplementation((groupId, callback) => {
            // Simulate fetching a group
            const mockGroup = {
                id: mockGroupId,
                name: mockGroupName,
                code: mockGroupCode,
            };
            callback(null, mockGroup);
        });

        const response = await request(app).get('/get-group-infor/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(/* expected group information */);
    });
});