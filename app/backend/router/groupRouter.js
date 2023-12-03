const express = require('express');
const { addNewGroup, editGroupName, deleteGroup, getGroupInfo } = require('../dao/groupDao');
const router = express.Router();

router.post('/add-group', async (req, res) => {
    const { groupName, code } = req.body;
    console.log(groupName, code)
    if(groupName && code){
        addNewGroup(groupName, code, (err, result) => {
            if (err) {
                res.status(500).send('Error adding group: ' + err.message);
                console.log('Error adding group: ' + err.message)
                
            } else {
                res.status(200).send(`New group added successfully with ID ${result.insertId}`);
                console.log(`New group added successfully with ID ${result.insertId}`)
            }
        });
    }else{
        console.log("empty")
    }

});

router.post('/edit-group/:id', express.json(), (req, res) => {
    const groupId = req.params.id;
    const { newGroupName } = req.body;
    editGroupName(groupId, newGroupName, (err, result) => {
        if (err) {
            res.status(500).send('Error updating group: ' + err.message);
        } else {
            res.status(200).send(`Group name updated successfully for ID ${groupId}`);
        }
    });
});

router.delete('/delete-group/:id', (req, res) => {
    const groupId = req.params.id;
    deleteGroup(groupId, (err, result) => {
        if (err) {
            res.status(500).send('Error deleting group: ' + err.message);
        } else {
            res.status(200).send(`Group deleted successfully with ID ${groupId}`);
        }
    });
});

router.get('/get-group-infor/:id', (req, res) => {
    const groupId = req.params.id;
    getGroupInfo(groupId, (err, group) => {
        if (err) {
            res.status(500).send('Error fetching group: ' + err.message);
        } else if (!group) {
            res.status(404).send('Group not found');
        } else {
            res.status(200).json(group);
        }
    });
});

module.exports = router;

