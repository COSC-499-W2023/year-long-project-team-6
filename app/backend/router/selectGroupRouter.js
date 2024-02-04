const express = require('express');
const router = express.Router();
const selectGroupsDAO = require('../dao/selectGroupDao');

router.get('/user-groups/:userId', (req, res) => {
    const userId = req.params.userId;

    selectGroupsDAO.getUserGroups(userId, (err, groups) => {
        if (err) {
            console.error('Error fetching user groups:', err);
            res.status(500).send('Error fetching user groups');
        } else {
            res.json(groups);
        }
    });
});
module.exports = router;
