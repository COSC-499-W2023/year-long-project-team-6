const express = require('express');
const router = express.Router();
const userDao = require('../dao/groupPostDao');

router.get('/get-sender-id/:senderName', (req, res) => {
    const senderName = req.params.senderName;

    userDao.getSenderId(senderName, (err, userId) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(userId);
        }
    });
});

module.exports = router;
