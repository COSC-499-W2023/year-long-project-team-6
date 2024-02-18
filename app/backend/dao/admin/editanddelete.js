const db = require('../../db/db');

async function editUser(userId, newUsername, newEmail, callback) {
    const query = 'UPDATE users SET username = ?, email = ? WHERE userid = ?';
    db.query(query, [newUsername, newEmail, userId], (err, result) => {
        if (err) {
            console.error(err);
            callback('Error updating user', null);
        } else {
            callback(null, result);
        }
    });
}

async function deleteUser(userId, callback) {
    const query = 'DELETE FROM users WHERE userid = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error(err);
            callback('Error deleting user', null);
        } else {
            callback(null, result);
        }
    });
}

async function deletePost(postId, callback) {
    const query = `
            DELETE FROM posts 
            WHERE post_id = ?
        `;
    db.query(query, [postId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

async function editPost(postId, newTitle, newText, callback) {
    const query = `
            UPDATE posts 
            SET post_title = ?, post_text = ?
            WHERE post_id = ?
        `;
    db.query(query, [newTitle, newText, postId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

async function editGroup(groupId, newGroupName, newAdmin, callback) {
    const query = 'UPDATE `groups` SET groupname = ?, admin = ? WHERE groupid = ?';
    db.query(query, [newGroupName, newAdmin, groupId], (err, result) => {
        if (err) {
            console.error(err);
            callback('Error updating group', null);
        } else {
            callback(null, result);
        }
    });
}

async function deleteGroup(groupId, callback) {
    db.beginTransaction(err => {
        if (err) {
            console.error(err);
            callback('Transaction start error', null);
            return;
        }
        const deleteUserGroupsQuery = 'DELETE FROM `user_groups` WHERE groupid = ?';
        db.query(deleteUserGroupsQuery, [groupId], (err, result) => {
            if (err) {
                console.error(err);
                db.rollback(() => {
                    callback('Error deleting from user_groups', null);
                });
                return;
            }
            const deleteGroupQuery = 'DELETE FROM `groups` WHERE groupid = ?';
            db.query(deleteGroupQuery, [groupId], (err, result) => {
                if (err) {
                    console.error(err);
                    db.rollback(() => {
                        callback('Error deleting group', null);
                    });
                    return;
                }
                db.commit(err => {
                    if (err) {
                        console.error(err);
                        db.rollback(() => {
                            callback('Error committing transaction', null);
                        });
                        return;
                    }
                    callback(null, result);
                });
            });
        });
    });
}


async function removeUserFromGroup(userId, groupId, callback) {
    const query = 'DELETE FROM user_groups WHERE userid = ? AND groupid = ?';
    db.query(query, [userId, groupId], (err, result) => {
        if (err) {
            console.error(err);
            callback('Error removing user from group', null);
        } else {
            callback(null, result);
        }
    });
}

module.exports = {
    editUser,
    deleteUser,
    editPost,
    deletePost,
    editGroup,
    deleteGroup,
    removeUserFromGroup
};
