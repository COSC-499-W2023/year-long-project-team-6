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

module.exports = {
    editUserProfile
};