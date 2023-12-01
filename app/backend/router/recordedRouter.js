const express = require('express');
const RecordedDao = require('../dao/recordedDao');
const router = express.Router();

// Get post information
router.get('/get-posts/:id', (req, res) => {
    const recordedDao = new RecordedDao(req.db);
    const postId = req.params.id;
    recordedDao.getPostInfor(postId, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving posts');
        } else {
            res.json(results);
        }
    });
});

// Get group information
router.get('/get-groups', (req, res) => {
    const recordedDao = new RecordedDao(req.db);
    recordedDao.getGroupInfor((err, results) => {
        if (err) {
            res.status(500).send('Error retrieving groups');
        } else {
            res.json(results);
        }
    });
});

// Delete a post
router.delete('/delete-posts/:id', (req, res) => {
    const recordedDao = new RecordedDao(req.db);
    const postId = req.params.id;
    recordedDao.deletePost(postId, (err, result) => {
        if (err) {
            res.status(500).send('Error deleting post');
        } else {
            res.status(200).send(`Post with ID ${postId} deleted successfully`);
        }
    });
});

// Edit a post
router.post('/edit-posts', express.json(), (req, res) => {
    const recordedDao = new RecordedDao(req.db);
    const postId = req.body.id;
    const { newTitle, newText } = req.body;

    recordedDao.editPost(postId, newTitle, newText, (err, result) => {
        if (err) {
            res.status(500).send('Error updating post');
        } else {
            res.status(200).send(`Post with ID ${postId} updated successfully`);
        }
    });
});

router.post('/add-post', express.json(), (req, res) => {
    const recordedDao = new RecordedDao(req.db);
    const postData = req.body;

    recordedDao.addPost(postData, (err, result) => {
        if (err) {
            res.status(500).send('Error adding post: ' + err.message);
        } else {
            res.status(200).send(`New post added successfully with ID ${result.insertId}`);
        }
    });
});

module.exports = router;
