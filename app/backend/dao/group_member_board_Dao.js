const db = require('../db/db');

async function getUsersInGroup(groupId, callback) {
    const query = `
        SELECT u.userid, u.username, u.email
        FROM users u
        JOIN user_groups ug ON u.userid = ug.userid
        WHERE ug.groupid = ?;
    `;
    db.query(query, [groupId], (err, results) => {
        if (err) {
            console.error(err);
            callback('Error fetching users in group', null);
        } else {
            callback(null, results);
        }
    });
}

async function checkAdmin(groupId, callback) {
    const query = `
    SELECT g.admin, u.username
    FROM \`groups\` g
    JOIN users u ON g.admin = u.userid
    WHERE g.groupid = ?;
`;


    db.query(query, [groupId], (err, results) => {
        if (err) {
            console.error(err);
            callback('Error fetching admin in group', null);
        } else {
            callback(null, results);
        }
    });
}


module.exports = {
    getUsersInGroup,
    checkAdmin,
};