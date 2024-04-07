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
    let query = 'UPDATE `groups` SET';
    const queryParams = [];

    // Dynamically construct the query based on provided data
    if (newGroupName) {
        query += ' `groupname` = ?,';
        queryParams.push(newGroupName);
    }
    if (newAdmin) {
        query += ' `admin` = ?,';
        queryParams.push(newAdmin);
    }
    query = query.slice(0, -1);

    query += ' WHERE `groupid` = ?';
    queryParams.push(groupId);

    if (queryParams.length === 1) {
        return callback('No new data provided for update', null);
    }

    db.query(query, queryParams, (err, result) => {
        if (err) {
            console.error(err);
            callback('Error updating group details', null);
        } else {
            callback(null, result);
        }
    });
}

async function deleteGroup(groupId, callback) {
    const deleteAnnouncementsQuery = 'DELETE FROM announcement WHERE groupid = ?';
    db.query(deleteAnnouncementsQuery, [groupId], (err, announcementResult) => {
        if (err) {
            db.rollback(() => {
                callback(err, null);
            });
            return;
        }
        const deleteUserGroupsQuery = 'DELETE FROM `user_groups` WHERE groupid = ?';
        db.query(deleteUserGroupsQuery, [groupId], (err, userGroupsResult) => {
            if (err) {
                db.rollback(() => {
                    callback(err, null);
                });
                return;
            }
            const deleteGroupQuery = 'DELETE FROM groups WHERE groupid = ?';
            db.query(deleteGroupQuery, [groupId], (err, groupResult) => {
                if (err) {
                    db.rollback(() => {
                        callback(err, null);
                    });
                    return;
                }
                db.commit(err => {
                    if (err) {
                        db.rollback(() => {
                            callback(err, null);
                        });
                        return;
                    }
                    callback(null, groupResult);
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
