const db = require('../db/db');

function getGroups(userId, callback) {

    const query = `
    SELECT g.groupid, g.groupname, g.group_creation_time
    FROM groups g
    JOIN user_groups ug ON g.groupid = ug.groupid
    JOIN users u ON ug.userid = u.userid
    WHERE u.userid = ?;  
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

function countPeople(userId, callback) {
    const query = `
    SELECT COUNT(DISTINCT ug.userid) as member_count
    FROM user_groups ug
    WHERE ug.groupid IN (
        SELECT groupid FROM user_groups WHERE userid = ?
    );
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results[0].member_count);
        }
    });
}

module.exports = {
    getGroups,
    countPeople
};


