const db = require('../db/db');

async function getUsersInGroup(groupId, callback) {
    const query = `
        SELECT u.userid, u.username, u.email, u.user_image, u.gender, u.birthday
        FROM users u
        JOIN user_groups ug ON u.userid = ug.userid
        WHERE ug.groupid = ?;
    `;
    db.query(query, [groupId], (err, results) => {
        if (err) {
            console.error(err);
            callback('Error fetching users in group', null);
        } else {
            const updatedResults = results.map(user => {
                if (user.user_image) {
                    user.user_image = Buffer.from(user.user_image).toString('base64');
                }
                return user;
            });
            callback(null, updatedResults);
        }
    });
}

async function checkAdmin(groupId, callback) {
    const query = `
    SELECT g.admin, u.username, g.invite_code
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

// For the avatar click event
async function getUserDetails(userId, callback) {
    const query = `
        SELECT username, gender, birthday, user_image
        FROM users
        WHERE userid = ?;
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            callback('Error fetching user details', null);
        } else {
            if (results.length > 0) {
                const user = results[0];
                if (user.user_image) {
                    user.user_image = Buffer.from(user.user_image).toString('base64');
                }
                callback(null, user);
            } else {
                callback('User not found', null);
            }
        }
    });
}



module.exports = {
    getUsersInGroup,
    checkAdmin,
    getUserDetails,
};
