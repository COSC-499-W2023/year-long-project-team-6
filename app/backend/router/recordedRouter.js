const express = require('express');

const { getPostInfor, getGroupInfor,deletePost, editPost } = require('../dao/recordedDao');
const router = express.Router();

// Get post information
router.get('/get-posts/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const sort = req.query.sort; // Retrieve the sort parameter from query

    getPostInfor(userId, sort, (err, results) => {
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
    getGroupInfor((err, results) => {
        if (err) {
            res.status(500).send('Error retrieving groups');
        } else {
            res.json(results);
        }
    });
});

// Delete a post
router.delete('/delete-posts/:id', (req, res) => {
    const postId = req.params.id;
    deletePost(postId, (err, result) => {
        if (err) {
            res.status(500).send('Error deleting post');
        } else {
            res.status(200).send(`Post with ID ${postId} deleted successfully`);
        }
    });
});

// Edit a post
router.post('/edit-posts', express.json(), (req, res) => {
    const postId = req.body.id;
    const { newTitle, newText } = req.body;

    editPost(postId, newTitle, newText, (err, result) => {
        if (err) {
            res.status(500).send('Error updating post');
        } else {
            res.status(200).send(`Post with ID ${postId} updated successfully`);
        }
    });
});

module.exports = router;