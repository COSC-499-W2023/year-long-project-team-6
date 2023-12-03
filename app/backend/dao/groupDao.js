const db = require('../db/db');

async function addNewGroup(groupname, invite_code, callback) {
    const query = 'INSERT INTO groups (groupname, invite_code) VALUES (?, ?)';
    db.query(query, [groupname, invite_code], (err, result) => {
        if (err) {
            callback(err, null);
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


module.exports = {
    addNewGroup,
    editGroupName,
    deleteGroup,
    getGroupInfo
};