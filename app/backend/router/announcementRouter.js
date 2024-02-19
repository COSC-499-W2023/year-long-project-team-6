const express = require('express');
const router = express.Router();
const announceDAO = require('../dao/announceDAO');


router.post('/insertAnnouncement', (req, res) => {
    const { announcer, groupId, title, detail, attachedPost } = req.body;
    console.log(announcer, groupId, title, detail, attachedPost);

    if (!announcer || !groupId || !title || !detail) {
        res.status(400).send({ error: 'Missing required fields' });
        console.log("Missing fields");
    } else {
        announceDAO.insertAnnouncement(announcer, groupId, title, detail, attachedPost, (err, result) => {
            if (err) {
                res.status(500).json({ error: `Error inserting announcement: ${err.message}` });
                console.log('Error inserting announcement: ' + err.message);
            } else {
                res.status(201).json({ message: 'Announcement inserted successfully', result });
                console.log("Announcement inserted successfully");
            }
        });
    }
});

module.exports = router;
