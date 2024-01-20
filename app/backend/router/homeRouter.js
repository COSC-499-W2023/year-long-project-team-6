const express = require('express');
const router = express.Router();
const homeDao = require('../dao/homeDao');

router.get('/groups/:userId', (req, res) => {
    const userId = req.params.userId;
    homeDao.getGroups(userId, (err, groups) => {
        if (err) {
            res.status(500).json({error: err.message});
        } else {
            res.json(groups);
        }
    });
});

router.get('/groups/count/:userId', (req, res) => {
    const userId = req.params.userId;
    homeDao.countPeople(userId, (err, count) => {
        if (err) {
            res.status(500).json({error: err.message});
        } else {
            res.json({memberCount: count});
        }
    });
});

module.exports = router;
