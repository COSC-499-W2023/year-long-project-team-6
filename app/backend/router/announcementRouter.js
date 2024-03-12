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
router.get('/viewAnnouncement/:groupId', (req, res) => {
    const { groupId } = req.params;
    console.log(groupId);
    announceDAO.getAnnouncements(groupId, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(result);
        }
    });
});
router.get('/announcegetpost/:postId', (req, res) => {
    const { postId } = req.params;
    console.log(postId);
    announceDAO.getPostById(postId, (err, post) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else if (!post) {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.status(200).json(post);
        }
    });
});

module.exports = router;
