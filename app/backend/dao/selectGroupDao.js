const db = require('../db/db');

function getUserGroups(userId, callback) {
    const query = `
        SELECT g.groupid, g.groupname
        FROM user_groups ug
        JOIN \`groups\` g ON ug.groupid = g.groupid
        WHERE ug.userid = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.log("DAO: Error in getUserGroups - ", err);
            callback(err, null);
        } else {
            console.log("DAO: Results in getUserGroups - ", results);
            callback(null, results);
        }
    });
}

module.exports = {
    getUserGroups,
};
