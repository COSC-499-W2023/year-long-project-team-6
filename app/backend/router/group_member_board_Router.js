const express = require('express');
const router = express.Router();
const groupDao = require('../dao/group_member_board_Dao');

router.get('/groups-users/:groupId', (req, res) => {
    const groupId = req.params.groupId;

    groupDao.getUsersInGroup(groupId, (err, users) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(users);
        }
    });
});

router.get('/group-admin/:groupId', (req, res) => {
    const groupId = req.params.groupId;
    groupDao.checkAdmin(groupId, (err, admin) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(admin);
        }
    });
});


module.exports = router;
