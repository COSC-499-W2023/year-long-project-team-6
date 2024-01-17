const db = require('../db/db');

// profileDao.js

function editUserProfile(userId, userData, callback) {
    const query = `
        UPDATE users 
        SET username = ?, email = ?, gender = ?, birthday = ?
        WHERE userid = ?;
    `;

    const params = [userData.username, userData.email, userData.gender, userData.birthday, userId];
    console.log(params);

    db.query(query, params, (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}


function getUserProfile(userId, callback) {
    const query = `
        SELECT username, email, role, gender, birthday 
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