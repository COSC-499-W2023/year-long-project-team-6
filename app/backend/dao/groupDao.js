const db = require('../db/db');

async function addNewGroup(groupname, invite_code, admin, callback) {
    const query = 'INSERT INTO `groups` (`groupname`, `invite_code`, `admin`) VALUES (?, ?, ?)';
    const queryParams = [groupname, invite_code, admin];
    db.query(query, queryParams, (err, result) => {
        if (err) {
            console.error(err);
            callback('Error adding group', null);
        } else {
            const groupId = result.insertId;
            const addUserToGroupQuery = 'INSERT INTO user_groups (userid, groupid) VALUES (?, ?)';
            db.query(addUserToGroupQuery, [admin, groupId], (addUserErr, addUserResult) => {
                if (addUserErr) {
                    console.error(addUserErr);
                    callback('Error adding user to the new group', null);
                } else {
                    callback(null, { groupId, addUserResult });
                }
            });
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
    const query = 'DELETE FROM groups WHERE groupid = ?';
    db.query(query, [groupId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

async function getGroupInfo(groupId, callback) {
    const query = 'SELECT * FROM groups WHERE groupid = ?';
    db.query(query, [groupId], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results[0]);
        }
    });
}

async function joinGroupByInviteCode(userId, inviteCode, callback) {
    const findGroupQuery = 'SELECT groupid FROM `groups` WHERE invite_code = ?';
    db.query(findGroupQuery, [inviteCode], (err, groupResults) => {
        if (err) {
            callback(err, null);
        } else if (groupResults.length === 0) {
            callback('No group found with the provided invite code', null);
        } else {
            const groupId = groupResults[0].groupid;
            const checkUserInGroupQuery = 'SELECT * FROM user_groups WHERE userid = ? AND groupid = ?';
            db.query(checkUserInGroupQuery, [userId, groupId], (checkErr, checkResults) => {
                if (checkErr) {
                    callback(checkErr, null);
                } else if (checkResults.length > 0) {
                    callback('User is already a member of this group', null);
                } else if (groupResults.length === 0) {
                    callback('No group found with the provided invite code', null);
                } else {
                    const insertQuery = 'INSERT INTO user_groups (userid, groupid) VALUES (?, ?)';
                    db.query(insertQuery, [userId, groupId], (insertErr, insertResult) => {
                        if (insertErr) {
                            callback(insertErr, null);
                        } else {
                            callback(null, insertResult);
                        }
                    });
                }
            });
        }
    });

}

async function getAllInviteCodes(callback) {
    const query = 'SELECT invite_code FROM `groups`';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            callback('Error fetching invite codes', null);
        } else {
            callback(null, results);
        }
    });
}


async function deleteGroupMemberAdmin(adminId, groupId, memberId, callback) {
    const checkAdmin = 'SELECT admin FROM `groups` WHERE groupid = ?';
    db.query(checkAdmin, [groupId], (adminErr, adminResults) => {
        if (adminErr) {
            console.error(adminErr);
            callback('Error checking group admin', null);
        } else if (adminResults.length === 0 || adminResults[0].admin !== adminId) {
            callback('Only the group admin can delete members', null);
        } else {
            const deleteMemberQuery = 'DELETE FROM user_groups WHERE userid = ? AND groupid = ?';
            db.query(deleteMemberQuery, [memberId, groupId], (deleteErr, deleteResult) => {
                if (deleteErr) {
                    console.error(deleteErr);
                    callback('Error deleting user from the group', null);
                } else if (deleteResult.affectedRows === 0) {
                    callback('No such member in the group', null);
                } else {
                    callback(null, 'Member deleted successfully');
                }
            });
        }
    });
}

async function editPostAdmin(userId, postId, newTitle, newText, callback) {
    const findGroupQuery = `
        SELECT g.admin 
        FROM posts p
        JOIN groups g ON p.groupid = g.groupid
        WHERE p.post_id = ?
    `;
    db.query(findGroupQuery, [postId], (groupErr, groupResults) => {
        if (groupErr) {
            console.error(groupErr);
            callback('Error finding group for post', null);
        } else if (groupResults.length === 0 || groupResults[0].admin !== userId) {
            callback('Only the group admin can edit this post', null);
        } else {
            const query = `
                UPDATE posts 
                SET post_title = ?, post_text = ?
                WHERE post_id = ?
            `;
            db.query(query, [newTitle, newText, postId], (err, result) => {
                if (err) {
                    callback(err, null);
                } else if (result.affectedRows === 0) {
                    callback('No changes made to the post, or post does not exist', null);
                } else {
                    callback(null, result);
                }
            });
        }
    });
}


async function deleteGroupAdmin(groupId, adminId, callback) {
    db.beginTransaction(err => {
        if (err) {
            console.error(err);
            callback('Transaction start error', null);
            return;
        }
        const checkAdminQuery = 'SELECT admin FROM `groups` WHERE groupid = ?';
        db.query(checkAdminQuery, [groupId], (checkErr, checkResults) => {
            if (checkErr) {
                console.error(checkErr);
                db.rollback(() => {
                    callback('Error checking group admin', null);
                });
                return;
            }
            if (checkResults.length === 0) {
                db.rollback(() => {
                    callback('Group not found', null);
                });
                return;
            }
            if (checkResults[0].admin !== adminId) {
                db.rollback(() => {
                    callback('Only the group admin can delete this group', null);
                });
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
    });
}

async function deletePostAdmin(userId, postId, callback) {
    db.beginTransaction(err => {
        if (err) {
            console.error(err);
            callback('Transaction start error', null);
            return;
        }
        const checkAdminQuery = `
            SELECT g.admin 
            FROM posts p
            JOIN groups g ON p.groupid = g.groupid
            WHERE p.post_id = ?
        `;
        db.query(checkAdminQuery, [postId], (checkAdminErr, checkAdminResults) => {
            if (checkAdminErr) {
                console.error(checkAdminErr);
                db.rollback(() => {
                    callback('Error checking admin rights', null);
                });
                return;
            }
            if (checkAdminResults.length === 0 || checkAdminResults[0].admin !== userId) {
                db.rollback(() => {
                    callback('Unauthorized or post not found', null);
                });
                return;
            }
            const deleteQuery = `
                DELETE FROM posts 
                WHERE post_id = ?
            `;
            db.query(deleteQuery, [postId], (deleteErr, deleteResult) => {
                if (deleteErr) {
                    console.error(deleteErr);
                    db.rollback(() => {
                        callback('Error deleting post', null);
                    });
                    return;
                }
                db.commit(commitErr => {
                    if (commitErr) {
                        console.error(commitErr);
                        db.rollback(() => {
                            callback('Error committing transaction', null);
                        });
                        return;
                    }
                    callback(null, 'Post deleted successfully');
                });
            });
        });
    });
}






module.exports = {
    addNewGroup,
    editGroup,
    deleteGroup,
    getGroupInfo,
    joinGroupByInviteCode,
    getAllInviteCodes,
    deleteGroupMemberAdmin,
    editPostAdmin,
    deleteGroupAdmin,
    deletePostAdmin
};