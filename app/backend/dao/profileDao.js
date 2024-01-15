const db = require('../db/db');

function editUserProfile(userId, { username, password, role, user_image, gender, birthday }, callback) {
    const query = `
        UPDATE users 
        SET username = ?, password = ?, role = ?, user_image = ?, gender = ?, birthday = ?
        WHERE userid = ?;
    `;

    db.query(query, [username, password, role, user_image, gender, birthday, userId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

function getUserProfile(userId, callback) {
    const query = `
        SELECT username, password, email, role, user_image, gender, birthday 
        FROM users 
        WHERE userid = ?;
    `;
    db.query(query, [userId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result[0]);
        }
    });
}

module.exports = {
    editUserProfile,
    getUserProfile
};