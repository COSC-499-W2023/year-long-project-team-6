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

async function getPostInfor(userId, groupId, callback) {
    const query = `
        SELECT 
            p.post_id, 
            p.s3_content_key, 
            p.post_title, 
            p.post_date, 
            p.post_text
        FROM posts p
        WHERE p.userid = ? AND p.groupid = ?;
    `;
    db.query(query, [userId, groupId], (err, results) => {
        if (err) {
            console.log("DAO: Error - ", err);
            callback(err, null);
        } else {
            console.log("userid: Results - ", userId);
            console.log("DAO: Results - ", results);
            callback(null, results);
        }
    });
}


module.exports = {
    getSenderId,
    getPostInfor
};