const db = require('../db/db');

function editUserProfile(userId, userDataArray, callback) {
    const query = `
        UPDATE users 
        SET username = ?, role = ?, gender = ?, birthday = ?
        WHERE userid = ?;
    `;

    userDataArray.push(userId);
    console.log(userDataArray);

    db.query(query, userDataArray, (err, result) => {
        console.log(result);
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