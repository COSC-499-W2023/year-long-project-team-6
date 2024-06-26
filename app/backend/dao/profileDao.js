const db = require('../db/db');

// profileDao.js

function editUserProfile(userId, userData, callback) {
    const query = `
        UPDATE users 
        SET username = ?, email = ?, gender = ?, birthday = ?
        WHERE userid = ?;
    `;

    const params = [userData.username, userData.email, userData.gender, userData.birthday, userId];
    console.log("params is: " + params);

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
        SELECT username, email, gender, birthday, user_image
        FROM users 
        WHERE userid = ?;
    `;
    db.query(query, [userId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const userData = result[0];
            if (userData && userData.user_image) {
                userData.user_image = Buffer.from(userData.user_image).toString('base64');
            }
            callback(null, userData);
        }
    });
}

function updateUserAvatar(userId, avatarBlob, callback) {
    const query = `
        UPDATE users 
        SET user_image = ?
        WHERE userid = ?;
    `;
    db.query(query, [avatarBlob, userId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

function updateUserPassword(userId, currentPassword, newPassword, callback) {
    // First, retrieve the current password from the database
    db.query('SELECT password FROM users WHERE userid = ?', [userId], (err, result) => {
        if (err) {
            return callback(err, null);
        }

        const existingPassword = result[0].password;

        // Verify if the current password is correct
        if (currentPassword !== existingPassword) {
            return callback(new Error('Current password is incorrect'), null);
        }

        // Update the password in the database
        const updateQuery = `
            UPDATE users 
            SET password = ?
            WHERE userid = ?;
        `;
        db.query(updateQuery, [newPassword, userId], (updateErr, updateResult) => {
            if (updateErr) {
                return callback(updateErr, null);
            }
            callback(null, updateResult);
        });
    });
}



module.exports = {
    editUserProfile,
    getUserProfile,
    updateUserAvatar,
    updateUserPassword
};