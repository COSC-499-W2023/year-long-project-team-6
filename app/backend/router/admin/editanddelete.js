const express = require('express');
const router = express.Router();
const {
    editUser,
    deleteUser,
    editPost,
    deletePost,
    editGroup,
    deleteGroup,
    removeUserFromGroup
} = require('../../dao/admin/editanddelete'); 

// Edit User
router.put('/admin-user/edit/:userId', (req, res) => {
    const { userId } = req.params;
    const { newUsername, newEmail } = req.body;
    editUser(userId, newUsername, newEmail, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('User updated successfully.');
        }
    });
});

// Delete User
router.delete('/admin-user/:userId', (req, res) => {
    const { userId } = req.params;
    deleteUser(userId, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('User deleted successfully.');
        }
    });
});

// Edit Post
router.put('/admin-post/edit/:postId', (req, res) => {
    const { postId } = req.params;
    const { newTitle, newText } = req.body;
    editPost(postId, newTitle, newText, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Post updated successfully.');
        }
    });
});

// Delete Post
router.delete('/admin-post/:postId', (req, res) => {
    const { postId } = req.params;
    deletePost(postId, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Post deleted successfully.');
        }
    });
});

// Edit Group
router.put('/admin-group/edit/:groupId', (req, res) => {
    const { groupId } = req.params;
    const { newGroupName, newAdmin } = req.body;
    editGroup(groupId, newGroupName, newAdmin, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Group updated successfully.');
        }
    });
});

// Delete Group
router.delete('/admin-group/:groupId', (req, res) => {
    const { groupId } = req.params;
    deleteGroup(groupId, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Group deleted successfully.');
        }
    });
});

// Remove User from Group
router.delete('/admin-group/:groupId/user/:userId', (req, res) => {
    const { userId, groupId } = req.params;
    removeUserFromGroup(userId, groupId, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('User removed from group successfully.');
        }
    });
});

module.exports = router;
