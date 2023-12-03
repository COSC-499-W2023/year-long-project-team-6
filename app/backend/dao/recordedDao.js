const mysql = require('mysql');
const db = require('../db/db');



async function getPostInfor(userId, callback) {
    const query = `
            SELECT p.userid, p.post_id, p.post_title, p.post_date, p.post_text
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

async function getGroupInfor(callback) {
    const query = `
        SELECT groupid, groupname
        FROM groups;
        `;

    this.db.query(query, (err, results) => {
        callback(err, results);
    });
}

async function deletePost(postId, callback) {
    const query = `
            DELETE FROM posts 
            WHERE post_id = ?
        `;
    db.query(query, [postId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

async function editPost(postId, newTitle, newText, callback) {
    const query = `
            UPDATE posts 
            SET post_title = ?, post_text = ?
            WHERE post_id = ?
        `;
    db.query(query, [newTitle, newText, postId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}




module.exports = {
    getPostInfor,
    deletePost,
    editPost
};