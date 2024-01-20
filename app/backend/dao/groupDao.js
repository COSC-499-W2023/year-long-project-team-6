const db = require('../db/db');

async function addNewGroup(groupname, invite_code, callback) {
    const query = 'INSERT INTO `groups` (`groupname`, `invite_code`) VALUES (?, ?)';
    db.query(query, [groupname, invite_code], (err, result) => {
        if (err) {
            console.error(err); 
            callback('Error adding group', null); 
        } else {
            callback(null, result);
        }
    });
}


async function editGroupName(groupId, newGroupName, callback) {
    const query = 'UPDATE groups SET groupname = ? WHERE groupid = ?';
    db.query(query, [newGroupName, groupId], (err, result) => {
        if (err) {
            callback(err, null);
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
    const findGroupQuery = 'SELECT groupid FROM groups WHERE invite_code = ?';
    db.query(findGroupQuery, [inviteCode], (err, groupResults) => {
        if (err) {
            callback(err, null);
        } else if (groupResults.length === 0) {
            callback('No group found with the provided invite code', null);
        } else {
            const groupId = groupResults[0].groupid;
            const insertQuery = 'INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)';
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


module.exports = {
    addNewGroup,
    editGroupName,
    deleteGroup,
    getGroupInfo,
    joinGroupByInviteCode
};