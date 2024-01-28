const db = require('../db/db');

async function getSenderId(senderName, callback) {
    const query = `SELECT userid FROM users WHERE username = ?;`;
    db.query(query, [senderName], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

module.exports = {
    getSenderId
};