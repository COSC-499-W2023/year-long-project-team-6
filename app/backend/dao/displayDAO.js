const db = require('../db/db');

async function getUsernameAndPostDate(userId, callback) {
    const query = `
    SELECT p.post_title, p.post_date
    FROM posts p
    JOIN users u ON u.userid = p.userid
    WHERE u.userid = ?;
        `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.log("DAO: Error - ", err);
            callback(err, null);
        } else {
            console.log("DAO: Results - ", results);
            callback(null, results);
        }
    });
}

module.exports = {
    getUsernameAndPostDate
};
