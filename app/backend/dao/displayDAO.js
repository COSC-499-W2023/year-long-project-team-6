<<<<<<< HEAD
const mysql = require('mysql');

class PostDao {
    constructor(db) {
        this.db = db;
    }

    getUsernameAndPostDate(callback) {
        const query = `
            SELECT u.username, p.post_date 
            FROM users u 
            JOIN posts p ON u.userid = p.userid;
        `;

        this.db.query(query, (err, results) => {
            callback(err, results);
        });
    }
}

module.exports = PostDao;
=======
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
async function addPost(postData, callback) {
    const {
        user_group_id,
        s3_content_key,
        post_text,
        userid,
        post_title
    } = postData;
    const query = `
        INSERT INTO posts (user_group_id, s3_content_key, post_text, userid, post_title)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [user_group_id, s3_content_key, post_text, userid, post_title], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}
module.exports = {
    getUsernameAndPostDate,
    addPost
};
>>>>>>> 07fffb993a70f62b8a37adff83105b36f9c6883f
