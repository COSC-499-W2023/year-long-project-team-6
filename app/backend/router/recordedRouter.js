const express = require('express');
const RecordedDao = require('../dao/recordedDao');
const router = express.Router();

// Get post information
router.get('/get-posts/:user_id', (req, res) => {
    const userId = req.params.user_id;
    recordedDao.getPostInfor(userId, (err, results) => {
        if (err) {
            console.error('Error in /get-posts/:user_id:', err);
            res.status(500).send(`Error retrieving posts: ${err.message}`);
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

module.exports = router;
