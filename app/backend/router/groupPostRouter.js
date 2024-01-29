const express = require('express');
const router = express.Router();
const groupPostDao = require('../dao/groupPostDao');

router.get('/get-sender-id/:senderName', (req, res) => {
    const senderName = req.params.senderName;

    groupPostDao.getSenderId(senderName, (err, userId) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(userId);
        }
    });
});

router.get('/posts/:userId/:groupId', (req, res) => {
    const userId = req.params.userId;
    const groupId = req.params.groupId;

    groupPostDao.getPostInfor(userId, groupId, (err, posts) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(posts);
            console.log("Posts: " + posts);
        }
    });
});

module.exports = router;
