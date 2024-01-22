const { addNewGroup, editGroupName, deleteGroup, getGroupInfo } = require('../app/backend/dao/groupDao');
const express = require('express');
const request = require('supertest');
const router = require('../app/backend/router/groupRouter');

jest.mock('../app/backend/dao/groupDao'); 


const app = express();
app.use(express.json());
app.use('/groups', router);

describe('Group Routes', () => {
    test('POST /groups/add-group - should add a new group successfully', async () => {
        const mockResult = { insertId: 1 };
        addNewGroup.mockImplementationOnce((groupName, code, callback) => {
            callback(null, mockResult);
        });

        const response = await request(app)
            .post('/groups/add-group')
            .send({ groupName: 'Test Group', code: 'ABC123' });

        expect(response.status).toBe(200);
        expect(response.text).toContain('New group added successfully');
    });

    // test('POST /add-group should handle missing data', async () => {
    //     const response = await request(app)
    //         .post('/add-group')
    //         .send({});

    //     expect(response.status).toBe(200); // Assuming you want to handle it silently in this case
    // });

    // test('POST /edit-group/:id should edit group name', async () => {
    //     const response = await request(app)
    //         .post('/edit-group/1')
    //         .send({ newGroupName: 'NewTestGroup' });

    //     expect(response.status).toBe(200);
    //     expect(response.text).toContain('Group name updated successfully');
    // });

    // test('DELETE /delete-group/:id should delete a group', async () => {
    //     const response = await request(app).delete('/delete-group/1');

    //     expect(response.status).toBe(200);
    //     expect(response.text).toContain('Group deleted successfully');
    // });

    // test('GET /get-group-infor/:id should get group information', async () => {
    //     const response = await request(app).get('/get-group-infor/1');

    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual(/* expected group information */);
    // });
});