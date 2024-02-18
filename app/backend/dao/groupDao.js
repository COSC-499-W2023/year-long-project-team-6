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



module.exports = {
    addNewGroup,
    editGroup,
    deleteGroup,
    getGroupInfo,
    joinGroupByInviteCode,
    getAllInviteCodes
};